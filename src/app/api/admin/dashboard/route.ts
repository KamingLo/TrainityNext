import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";

// Pastikan path import model Anda sudah benar
import UserProduct from "@/models/user_product";
import Product from "@/models/product";
import Review from "@/models/review"; 

export async function GET(req: NextRequest) {
  try {
    // 1. Koneksi Database
    await connectDB();

    // 2. Otentikasi Pengguna
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ------------------------------------------------------------------
    // A. Ambil 5 UserProduct Terbaru (Aktivitas Pembelian Global)
    // Data: Nama User (username), Tanggal Beli (createdAt), Nama Produk
    // ------------------------------------------------------------------
    const rawUserActivity = await UserProduct.find({})
      .sort({ createdAt: -1 }) // Terbaru dahulu
      .limit(5)
      .select('createdAt user product') 
      // Populate field 'user', ambil 'username' dari model User
      .populate({ path: "user", select: "username" }) 
      // Populate field 'product', ambil 'name' dari model Product
      .populate({ path: "product", select: "name" }) 
      .lean();

    // Mapping data agar sesuai output yang diminta
    const latestUserActivity = rawUserActivity.map((item: any) => ({
      userName: item.user?.username || "Pengguna Anonim",
      purchasedAt: item.createdAt, 
      productName: item.product?.name || "Produk Dihapus",
    }));


    // ------------------------------------------------------------------
    // B. Ambil 5 Review Terbaru (Testimoni Global)
    // Data: Nama Produk, Rating, Komentar, Nama User (username)
    // ------------------------------------------------------------------
    const rawReviews = await Review.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('rating comment userId productId createdAt')
      // Populate field 'userId', ambil 'username' dari model User
      .populate({ path: "userId", select: "username" }) 
      // Populate field 'productId', ambil 'name' dari model Product
      .populate({ path: "productId", select: "name" }) 
      .lean();

    // Mapping data agar sesuai output yang diminta
    const latestReviews = rawReviews.map((review: any) => ({
      productName: review.productId?.name || "Produk Dihapus",
      rating: review.rating,
      comment: review.comment,
      userName: review.userId?.username || "Pengguna Anonim",
      reviewedAt: review.createdAt,
    }));
    
    // 3. Kirim Respons
    return NextResponse.json({
      message: 'Data dashboard aktivitas global berhasil diambil.',
      data: {
        latestUserActivity, // Aktivitas kepemilikan terbaru (5 item)
        latestReviews,      // Review terbaru (5 item)
      }
    }, { status: 200 });

  } catch (err) {
    console.error("Gagal mengambil data dashboard:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}