import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import UserProduct from "@/models/user_product";
import Product from "@/models/product";

interface IDashboardResponse {
  ownedProducts: Array<{
    name: string;
    shortDesc: string;
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

    const ownedProductDocs = await UserProduct.find({ user: userId })
      .select("product")
      .lean();

    const ownedIds = ownedProductDocs.map((item) => item.product);

    const latestProducts = await Product.find({
      _id: { $nin: ownedIds },
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const owned = await UserProduct.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate({
        path: "product",
        model: Product,
        select: "name shortDesc video",
      })
      .lean();

    const ownedProducts = owned.map((item) => {
      const product = item.product as any;

      const kodePertama =
        Array.isArray(product?.video) && product.video.length > 0
          ? product.video[0]?.kodePelajaran || null
          : null;

      return {
        _id: product?._id,
        name: product?.name,
        shortDesc: product?.shortDesc,
        status: item.status,
        lastWatchedVideoId: item.lastWatchedVideoId,
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
  } catch (err) {
    console.error("Gagal mengambil data dashboard:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
