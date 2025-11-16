import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import UserProduct from "@/models/user_product";
import Product from "@/models/product";

export async function GET(req: NextRequest) {
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
        select: "name video",
        populate: {
          path: "video",
          select: "kodePelajaran",
        }
      })
      .select("lastWatchedVideoId status")
      .lean();

    const result = owned.map((item) => {
      const product = item.product as any;
      const videos = Array.isArray(product?.video) ? product.video : [];
      const totalVideos = videos.length;

      // default values
      let progressPercentage = 0;
      let kodePertama = videos[0]?.kodePelajaran || null;

      if (totalVideos > 0 && item.lastWatchedVideoId) {
        const lastId = String(item.lastWatchedVideoId).trim();

        // cocokkan baik ID atau kodePelajaran
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

      return {
        name: product?.name,
        shortDesc: product?.shortDesc,
        kodePertama,
        progressPercentage,
      };
    });

    return NextResponse.json({ data: result }, { status: 200 });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
