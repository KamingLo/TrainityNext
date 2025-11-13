import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import VerificationToken from "@/models/verificationToken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, code } = await req.json();

    const record = await VerificationToken.findOne({ email });

    if (!record) {
      return NextResponse.json({ message: "Permintaan tidak valid." }, { status: 400 });
    }

    // Cek apakah sudah expired
    if (new Date() > new Date(record.expiresAt)) {
      return NextResponse.json({ message: "Kode telah kadaluarsa." }, { status: 400 });
    }

    // Cek apakah kode cocok
    if (record.token !== code) {
      return NextResponse.json({ message: "Kode verifikasi salah." }, { status: 400 });
    }

    return NextResponse.json({ message: "Kode valid." });

  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan server." }, { status: 500 });
  }
}