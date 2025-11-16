import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/review";
import Product from "@/models/product"; 
import { getServerSession } from "next-auth";
<<<<<<< HEAD
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
=======
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Sesuaikan path config NextAuth kamu
import mongoose from "mongoose";
>>>>>>> 7e8ec7c0a045a4452c7d18f6d985e45e9c57886a

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions); 
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Harap login terlebih dahulu" }, { status: 401 });
    }

    const userId = session?.user?.id;
    const { productKey, rating, comment } = await req.json();

    console.log(userId, productKey, rating);
    if (!productKey || !rating) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const targetProduct = await Product.findOne({ name: productKey });

    if (!targetProduct) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const productId = targetProduct._id; 

    // Cek berapa banyak review yang sudah dibuat user untuk produk ini
    const userReviewCount = await Review.countDocuments({
      userId,
      productId,
    });

    // Batasi maksimal 3 review per user per produk
    if (userReviewCount >= 3) {
      return NextResponse.json(
        { error: "Kesempatan review anda sudah habis" },
        { status: 403 }
      );
    }

    // Buat review baru (bukan update)
    try {
      const review = await Review.create({
        userId,
        productId,
        rating,
        comment,
      });

      // Populate userId setelah create untuk memastikan username tersedia
      await review.populate({ path: "userId", select: "username" });

      const message = "Review berhasil ditambahkan";

      return NextResponse.json(
        { message, data: review },
        { status: 201 }
      );
    } catch (createError: unknown) {
      // Handle MongoDB duplicate key error (E11000) - berarti unique index masih ada
      if (createError instanceof Error && createError.message.includes("E11000")) {
        console.log("Unique index masih ada, mencoba menghapus...");
        
        try {
          // Coba hapus unique index
          const db = mongoose.connection.db;
          if (db) {
            const collection = db.collection('reviews');
            try {
              await collection.dropIndex('userId_1_productId_1');
              console.log("✅ Unique index berhasil dihapus");
            } catch (dropError: any) {
              if (dropError.code !== 27 && dropError.codeName !== 'IndexNotFound') {
                console.error("Error dropping index:", dropError);
              }
            }
            
            // Buat index non-unique baru
            try {
              await collection.createIndex({ userId: 1, productId: 1 }, { unique: false });
              console.log("✅ Non-unique index berhasil dibuat");
            } catch (createIndexError: any) {
              console.error("Error creating index:", createIndexError);
            }
          }
          
          // Coba create lagi setelah index dihapus
          const review = await Review.create({
            userId,
            productId,
            rating,
            comment,
          });

          await review.populate({ path: "userId", select: "username" });

          return NextResponse.json(
            { message: "Review berhasil ditambahkan (index telah diperbaiki)", data: review },
            { status: 201 }
          );
        } catch (retryError: unknown) {
          console.error("Error setelah fix index:", retryError);
          throw retryError;
        }
      }
      
      // Jika bukan E11000, throw error asli
      throw createError;
    }

  } catch (error: unknown) {
    console.error("Review Error:", error);
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan server";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productKey = searchParams.get("productKey");
<<<<<<< HEAD
    const limit = parseInt(searchParams.get("limit") || "5", 10);
=======
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : null; // null jika tidak ada limit
>>>>>>> 7e8ec7c0a045a4452c7d18f6d985e45e9c57886a

    let reviews;

    if (productKey) {
      const product = await Product.findOne({ name: productKey });
      if (!product)
        return NextResponse.json({ error: "Product not found" }, { status: 404 });

      // Query untuk mengambil SEMUA review dari SEMUA user untuk produk ini
      // Di-sort terbaru dulu berdasarkan createdAt (karena sekarang semua review adalah baru, tidak ada update)
      let query = Review.find({ productId: product._id })
        .populate({ path: "userId", select: "username" })
        .sort({ createdAt: -1 }); // Sort berdasarkan createdAt (terbaru di atas)
      
      // Jika limit diberikan, gunakan limit
      if (limit && limit > 0) {
        query = query.limit(limit);
      }
      
      reviews = await query.lean(); // Gunakan lean() untuk performa dan memastikan semua field termasuk timestamps
      
      // Debug: log untuk memastikan semua review diambil
      console.log(`[API] Fetched ${reviews.length} reviews for product: ${productKey}`);
    } else {
      // Query untuk semua review
      let query = Review.find()
        .populate({ path: "userId", select: "username" })
        .populate({ path: "productId", select: "name" })
        .sort({ createdAt: -1 }); // Sort berdasarkan createdAt (terbaru di atas)
      
      if (limit && limit > 0) {
        query = query.limit(limit);
      }
      
      reviews = await query.lean(); // Gunakan lean() untuk performa dan memastikan semua field termasuk timestamps
    }

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}