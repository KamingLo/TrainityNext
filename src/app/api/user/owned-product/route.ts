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

interface IProduct {
  name: string;
  shortDesc?: string;
  video?: IVideo[];
}

interface IUserProduct {
  product: IProduct;
  lastWatchedVideoId?: string | null;
  status: string;
}

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const owned = await UserProduct.find({ user: session.user.id })
      .populate({
        path: "product",
        model: Product,
        select: "name shortDesc video",
        populate: {
          path: "video",
          select: "kodePelajaran",
        },
      })
      .select("lastWatchedVideoId status")
      .lean<IUserProduct[]>();

    const result = owned.map((item) => {
      const product = item.product;

      const videos: IVideo[] = Array.isArray(product?.video)
        ? product.video
        : [];

      const totalVideos = videos.length;

      let progressPercentage = 0;
      const kodePertama = videos[0]?.kodePelajaran ?? null;

      if (totalVideos > 0 && item.lastWatchedVideoId) {
        const lastId = String(item.lastWatchedVideoId).trim();

        const watchedIndex = videos.findIndex((v) => {
          const byKode =
            v.kodePelajaran &&
            String(v.kodePelajaran).trim() === lastId;

          const byId =
            v._id &&
            String(v._id).trim() === lastId;

          return byKode || byId;
        });

        if (watchedIndex !== -1) {
          const videosCompleted = watchedIndex + 1;
          progressPercentage = Math.round(
            (videosCompleted / totalVideos) * 100
          );
          if (progressPercentage > 100) progressPercentage = 100;
        }
      }

      return {
        name: product.name,
        shortDesc: product.shortDesc,
        kodePertama,
        progressPercentage,
      };
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err: AppError) {
    if (err instanceof Error) {
      console.error("Server error:", err.message);
    } else {
      console.error("Unknown error:", err);
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
