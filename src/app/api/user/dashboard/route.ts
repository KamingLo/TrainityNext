import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import UserProduct from "@/models/user_product";
import Product from "@/models/product";

interface IVideo {
  _id: string;
  kodePelajaran?: string;
}

interface IProductLean {
  _id: string;
  name: string;
  shortDesc: string;
  video?: IVideo[];
}

interface IUserProductLean {
  product: IProductLean;
  status: string;
  lastWatchedVideoId: string | null;
}

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
  latestProducts: Array<IProductLean>;
}

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const ownedProductDocs = await UserProduct.find({ user: userId })
      .select("product")
      .lean<{ product: string }[]>();

    const ownedIds = ownedProductDocs.map((item) => item.product);

    const latestProducts = await Product.find({
      _id: { $nin: ownedIds },
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean<IProductLean[]>();

    const owned = await UserProduct.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(2)
      .populate({
        path: "product",
        model: Product,
        select: "name shortDesc video",
      })
      .lean<IUserProductLean[]>();

    const ownedProducts = owned.map((item) => {
      const product = item.product;

      const videos: IVideo[] = Array.isArray(product?.video) ? product.video : [];
      const totalVideos = videos.length;

      let progressPercentage = 0;
      let kodePertama: string | null = null;

      if (totalVideos > 0) {
        kodePertama = videos[0]?.kodePelajaran ?? null;

        if (item.lastWatchedVideoId) {
          const lastId = String(item.lastWatchedVideoId).trim();

          const watchedIndex = videos.findIndex((v) => {
            const byKode =
              v.kodePelajaran && String(v.kodePelajaran).trim() === lastId;
            const byId = v._id && String(v._id).trim() === lastId;
            return byKode || byId;
          });

          if (watchedIndex !== -1) {
            const completed = watchedIndex + 1;
            progressPercentage = Math.round((completed / totalVideos) * 100);
            if (progressPercentage > 100) progressPercentage = 100;
          }
        }
      }

      return {
        _id: product._id,
        name: product.name,
        shortDesc: product.shortDesc,
        status: item.status,
        lastWatchedVideoId: item.lastWatchedVideoId,
        progressPercentage,
        kodePertama,
      };
    });

    return NextResponse.json(
      {
        data: {
          ownedProducts,
          latestProducts,
        } as IDashboardResponse,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Gagal mengambil data dashboard:", err.message);
      return NextResponse.json(
        { error: "Server error", detail: err.message },
        { status: 500 }
      );
    }

    console.error("Error tidak dikenal:", err);
    return NextResponse.json(
      { error: "Unknown error" },
      { status: 500 }
    );
  }
}
