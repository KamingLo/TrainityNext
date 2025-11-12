import { connectDB } from "@/lib/db";
import Product from "@/models/product"; 
import UserProduct from "@/models/user_product"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    // 1. Dapatkan sesi pengguna (jika ada)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id
    console.log(userId);

    await connectDB();

    // 2. Ambil data produk
    const products = await Product.find({})
      .select("name name_lowercase shortDesc video")
      .slice("video", 1)
      .lean<IProduct[]>(); // <--- PERBAIKAN: Beri tahu TypeScript ini adalah array IProduct

    // 3. Ambil data kepemilikan pengguna (jika login)
    let ownedProductIds = new Set<string>();  
    if (userId) {
      const userProducts = await UserProduct.find({ 
        user: userId, 
        status: 'aktif' 
      })
      .select("product")
      .lean<IUserProduct[]>(); // <--- PERBAIKAN: Beri tahu TypeScript ini adalah array IUserProduct
      
      ownedProductIds = new Set(userProducts.map(p => p.product.toString()));
    }

    // 4. Format data
    // Sekarang TypeScript tahu bahwa 'product' adalah IProduct
    const formattedProducts = products.map(product => {
      const firstVideo = product.video?.[0];
      // 'product._id' sekarang dikenali, '?' tidak lagi diperlukan
      const isOwned = ownedProductIds.has(product._id.toString()); 

      return {
        _id: product._id.toString(), // '?' tidak lagi diperlukan
        name: product.name,
        shortDesc: product.shortDesc,
        kodePelajaranPertama: firstVideo ? firstVideo.kodePelajaran : null,
        isOwned: isOwned
      };
    });

    return NextResponse.json(formattedProducts);

  } catch (error) {
    console.error("Gagal mengambil produk:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}