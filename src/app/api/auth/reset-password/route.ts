import { NextResponse } from "next/server";
import { connectDB }from "@/lib/db";
import VerificationToken from "@/models/verificationToken";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, code, newPassword } = await req.json();

    const record = await VerificationToken.findOne({ email });

    if(newPassword.length < 8){
        return NextResponse.json({ message: "Password harus lebih dari 8 karakter"}, {status: 400})
    }

    if (!record || record.token !== code || new Date() > new Date(record.expiresAt)) {
      return NextResponse.json({ message: "Sesi tidak valid atau kadaluarsa." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    await VerificationToken.findOneAndDelete({ email });

    return NextResponse.json({ message: "Password berhasil diubah. Silakan login." });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengubah password." }, { status: 500 });
  }
}