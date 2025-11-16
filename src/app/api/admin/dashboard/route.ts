import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";

import UserProduct from "@/models/user_product";
import Review from "@/models/review"; 

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawUserActivity = await UserProduct.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('createdAt user product') 
      .populate({ path: "user", select: "username" }) 
      .populate({ path: "product", select: "name" }) 
      .lean();

    const latestUserActivity = rawUserActivity.map((item) => ({
      userName: item.user?.username || "Pengguna Anonim",
      purchasedAt: item.createdAt, 
      productName: item.product?.name || "Produk Dihapus",
    }));

    const rawReviews = await Review.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('rating comment userId productId createdAt')
      .populate({ path: "userId", select: "username" }) 
      .populate({ path: "productId", select: "name" }) 
      .lean();

    const latestReviews = rawReviews.map((review) => ({
      productName: review.productId?.name || "Produk Dihapus",
      rating: review.rating,
      comment: review.comment,
      userName: review.userId?.username || "Pengguna Anonim",
      reviewedAt: review.createdAt,
    }));
    
    return NextResponse.json({
      message: 'Data dashboard aktivitas global berhasil diambil.',
      data: {
        latestUserActivity, 
        latestReviews,
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