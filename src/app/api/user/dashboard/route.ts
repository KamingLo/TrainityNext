import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import UserProduct from "@/models/user_product";
import Product from "@/models/product";

interface IDashboardResponse {
  ownedProducts: Array<{
    _id: string; 
    name: string;
    shortDesc: string;
    status: string;
    lastWatchedVideoId: string | null;
    progressPercentage: number; 
    kodePertama: string | null;
  }>;
  latestProducts: Array<any>;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Ambil ID Produk yang Sudah Dimiliki
    const ownedProductDocs = await UserProduct.find({ user: userId })
      .select("product")
      .lean();

    const ownedIds = ownedProductDocs.map((item) => item.product);

    // 2. Ambil 3 Produk Terbaru (Global) yang BELUM Dimiliki ($nin)
    const latestProducts = await Product.find({
      _id: { $nin: ownedIds },
    })
      .sort({ createdAt: -1 }) 
      .limit(3)
      .lean();

    // 3. Ambil Produk yang Dimiliki User (3 yang terakhir diakses)
    const owned = await UserProduct.find({ user: userId })
      .sort({ createdAt: -1 }) 
      .limit(2)
      .populate({
        path: "product",
        model: Product,
        select: "name shortDesc video", 
      })
      .lean();

    // 4. Proses dan Hitung Persentase Kemajuan
    // 4. Proses dan Hitung Persentase Kemajuan
const ownedProducts = owned.map((item) => {
  const product = item.product as any;

  const videos = Array.isArray(product?.video) ? product.video : [];
  const totalVideos = videos.length;

  let progressPercentage = 0;
  let kodePertama = null;

  if (totalVideos > 0) {
    // Video pertama
    kodePertama = videos[0]?.kodePelajaran || null;

    if (item.lastWatchedVideoId) {
      const lastId = String(item.lastWatchedVideoId).trim();

      // --- FIX PALING PENTING ---
      // Matching berdasarkan _id atau kodePelajaran (2 kemungkinan)
      const watchedIndex = videos.findIndex((v: any) => {
        const byKode = v.kodePelajaran && String(v.kodePelajaran).trim() === lastId;
        const byId = v._id && String(v._id).trim() === lastId;
        return byKode || byId;
      });

      if (watchedIndex !== -1) {
        const videosCompleted = watchedIndex + 1;
        progressPercentage = Math.round((videosCompleted / totalVideos) * 100);

        if (progressPercentage > 100) {
          progressPercentage = 100;
        }
      }
    }
  }

  return {
    _id: product?._id,
    name: product?.name,
    shortDesc: product?.shortDesc,
    status: item.status,
    lastWatchedVideoId: item.lastWatchedVideoId,
    progressPercentage,
    kodePertama,
  };
});


    // 5. Kirim Respons
    return NextResponse.json(
      {
        data: {
          ownedProducts,
          latestProducts,
        } as IDashboardResponse,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Gagal mengambil data dashboard:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}