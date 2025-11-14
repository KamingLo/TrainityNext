import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/review";
import Product from "@/models/product"; // Pastikan path ini benar sesuai struktur projectmu
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Sesuaikan path config NextAuth kamu

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions); // Pakai any atau interface custom jika sudah setup type NextAuth
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Harap login terlebih dahulu" }, { status: 401 });
    }

    const userId = session?.user?.id; // Mengambil _id dari session sesuai request
    const { productKey, rating, comment } = await req.json();

    console.log(userId, productKey, rating);
    if (!productKey || !rating) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const targetProduct = await Product.findOne({ name: productKey });

    if (!targetProduct) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const productId = targetProduct._id; // Ambil _id dari produk yang ditemukan

    // 4. SIMPAN REVIEW
    const newReview = await Review.create({
      userId,
      productId,
      rating,
      comment,
    });

    return NextResponse.json(
      { message: "Review berhasil ditambahkan", data: newReview },
      { status: 201 }
    );

  } catch (error: AppError) {
    if (error instanceof Error) return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productKey = searchParams.get("productKey");
    const limit = parseInt(searchParams.get("limit") || "5", 10); // default ambil 5 review terbaru

    let reviews;

    if (productKey) {
      // kalau dikirimin productKey → filter berdasarkan produk
      const product = await Product.findOne({ name: productKey });
      if (!product)
        return NextResponse.json({ error: "Product not found" }, { status: 404 });

      reviews = await Review.find({ productId: product._id })
        .populate("userId", "name image")
        .sort({ createdAt: -1 })
        .limit(limit);
    } else {
      reviews = await Review.find()
        .populate("userId", "name")
        .populate("productId", "name") // biar tahu review ini buat produk apa
        .sort({ createdAt: -1 })
        .limit(limit);
    }

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}