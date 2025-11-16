import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import UserProduct from "@/models/user_product";
import Product from "@/models/product";
import { Types } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> } // <- Promise
) {
  const { key } = await params; // harus await
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const product = await Product.findOne({ name: key });
  if (!product) {
    return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }

  const userProduct = await UserProduct.findOne({
    user: new Types.ObjectId(session.user.id),
    product: product._id,
  }).populate("product");

  if (!userProduct || userProduct.status !== "aktif") {
    return NextResponse.json({ message: "Kamu belum membeli produk ini." }, { status: 403 });
  }

  return NextResponse.json({
    message: "Akses diberikan.",
    lastWatchedVideoId: userProduct.lastWatchedVideoId,
    product: userProduct.product,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> } // <- Promise
) {
  const { key } = await params;
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { status, lastWatchedVideoId } = body;

  if (!status && !lastWatchedVideoId) {
    return NextResponse.json({ message: "Tidak ada data untuk diupdate" }, { status: 400 });
  }

  const product = await Product.findOne({ name: key });
  if (!product) {
    return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }

  const userProduct = await UserProduct.findOne({
    user: session.user.id,
    product: product._id,
  });

  if (!userProduct) {
    return NextResponse.json({ message: "Produk tidak ditemukan untuk user ini" }, { status: 404 });
  }

  if (status) userProduct.status = status;
  if (lastWatchedVideoId) userProduct.lastWatchedVideoId = lastWatchedVideoId;

  await userProduct.save();

  return NextResponse.json({
    message: "UserProduct berhasil diupdate",
    userProduct,
  });
}
