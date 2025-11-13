import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB }from "@/lib/db";
import User from "@/models/user";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email }).select("username email");
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    username: user.username,
    email: user.email,
  });
}

export async function PATCH(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username, email } = body;
  if (!username && !email) {
    return NextResponse.json(
      { error: "Nothing to update. Provide username and/or email." },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (email && email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
  }

  if (username) user.username = username;
  if (email) user.email = email;

  try {
    await user.save();
    return NextResponse.json(
      { username: user.username, email: user.email },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating profile:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
