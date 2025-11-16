import { NextResponse } from "next/server";
import { connectDB }from "@/lib/db";
import VerificationToken from "@/models/verificationToken";
import User from "@/models/user";
import { sendEmail } from "@/lib/email";
import { getVerificationEmailTemplate } from "@/lib/template/email-template";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Email tidak terdaftar." }, { status: 404 });
    }

    const existingToken = await VerificationToken.findOne({ email });
    
    if (existingToken) {
      const now = new Date().getTime();
      const lastSent = new Date(existingToken.lastSentAt).getTime();
      const diff = now - lastSent;
      const oneMinute = 60 * 1000;

      if (diff < oneMinute) {
        const remainingSeconds = Math.ceil((oneMinute - diff) / 1000);
        return NextResponse.json(
          { message: `Mohon tunggu ${remainingSeconds} detik sebelum mengirim ulang.` },
          { status: 429 }
        );
      }
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await VerificationToken.findOneAndUpdate(
      { email },
      { 
        token: otpCode, 
        expiresAt: expiresAt, 
        lastSentAt: new Date() 
      },
      { upsert: true, new: true }
    );

    const emailHtml = getVerificationEmailTemplate(otpCode);
    const isSent = await sendEmail({
      to: email,
      subject: "Kode Verifikasi Reset Password",
      html: emailHtml,
    });

    if (!isSent) {
      return NextResponse.json({ message: "Gagal mengirim email." }, { status: 500 });
    }

    return NextResponse.json({ message: "Kode verifikasi telah dikirim." });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan server." }, { status: 500 });
  }
}