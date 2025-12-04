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
    const key = searchParams.get('key');

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    await connectDB();

    // Modifikasi pada objek query untuk menggunakan $or
    const query: { $or?: Array<{ name: RegExp } | { desc: RegExp } | { shortDesc: RegExp }> } = {};

    if (key) {
      // Membuat ekspresi reguler case-insensitive untuk pencarian
      const regex = new RegExp(key, 'i');

      // Menggunakan operator $or untuk mencari di name, desc, atau shortDesc
      query.$or = [
        { name: regex },
        { desc: regex },
        { shortDesc: regex }
      ];
    }

    const products = await Product.find(query)
      .select("name desc shortDesc video")
      .slice("video", 1)
      .lean<IProduct[]>();

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