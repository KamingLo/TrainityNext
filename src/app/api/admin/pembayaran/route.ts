import { connectDB } from "@/lib/db";
import UserProduct from "@/models/user_product";
import User from "@/models/user";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userProducts = await UserProduct.find()
      .populate("user", "name email")
      .populate("product", "name");

    return NextResponse.json(userProducts, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch payment data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
