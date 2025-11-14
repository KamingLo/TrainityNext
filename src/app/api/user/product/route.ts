import { connectDB } from "@/lib/db";
import Product from "@/models/product"; 
import UserProduct from "@/models/user_product"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = 'force-dynamic'; 

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key'); // bisa undefined

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    await connectDB();

    // --- Buat query
    const query: {name?: string} = {};
    if (key) {
      query.name = key; // filter jika key ada
    }

    const products = await Product.find(query)
      .select("name desc shortDesc video")
      .slice("video", 1)
      .lean<IProduct[]>(); // <-- array produk

    // --- Ambil produk yang dimiliki user
    let ownedProductIds = new Set<string>();
    if (userId) {
      const userProducts = await UserProduct.find({
        user: userId,
        status: 'aktif'
      })
      .select("product")
      .lean<IUserProduct[]>();

      ownedProductIds = new Set(userProducts.map(p => p.product.toString()));
    }

    // --- Format produk
    const formattedProducts = products.map(product => {
      const firstVideo = product.video?.[0];
      const isOwned = ownedProductIds.has(product._id.toString());

      return {
        _id: product._id.toString(),
        name: product.name,
        desc: product.desc,
        shortDesc: product.shortDesc,
        kodePelajaranPertama: firstVideo?.kodePelajaran ?? null,
        isOwned
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
