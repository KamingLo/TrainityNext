import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, email, password, confirm, role} = await req.json();

    if (!username || !email || !password || !confirm) {
      return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
    }

    if(password.length <= 8 && confirm.length <= 8){
        return NextResponse.json({ error: "Password harus 8 karakter"}, {status: 400});
    }

    if(password != confirm){
        return NextResponse.json({ error: "Password tidak sama"}, {status: 400});
    }

    await connectDB();

    const existingUser = await User.findOne({ $or: [{email}] });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Registrasi berhasil." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
