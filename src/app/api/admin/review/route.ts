import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/review";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 1. Cek Autentikasi Admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== "admin") {
       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Ambil Query Parameters (page & limit)
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // 3. Query Database
    // Mengambil data review + info user + info produk
    const reviews = await Review.find()
      .populate("userId", "name email image") // Ambil info user
      .populate("productId", "name price")    // Ambil info produk (sesuaikan field productmu)
      .sort({ createdAt: -1 })                // Urutkan dari yang terbaru
      .skip(skip)
      .limit(limit);

    // Hitung total dokumen untuk info pagination
    const totalReviews = await Review.countDocuments();

    // 4. Return Response
    return NextResponse.json(
      {
        data: reviews,
        pagination: {
          total: totalReviews,
          page: page,
          limit: limit,
          totalPages: Math.ceil(totalReviews / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: AppError) {
    if(error instanceof Error){
        console.error("Get Admin Reviews Error:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
    }
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    // 1. Cek Autentikasi & Otorisasi
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
       return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Review successfully deleted" },
      { status: 200 }
    );

  } catch (error: AppError) {
    if(error instanceof Error){
        console.error("Delete Review Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}