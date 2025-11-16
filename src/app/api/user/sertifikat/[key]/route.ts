import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import UserProduct from "@/models/user_product";
import Product from "@/models/product";
import User from "@/models/user";

interface ICertificateData {
  _id: string;
  userName: string;
  courseName: string;
  completedAt: Date | null;
  progressPercentage: number;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await User.findById(userId).select("name").lean() as { name: string } | null;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAllCertificates = params.key === "all";

    const userProducts = await UserProduct.find({ 
      user: userId,
      status: "aktif"
    })
      .populate({
        path: "product",
        model: Product,
        select: "name video",
      })
      .lean();
    const certificates: ICertificateData[] = userProducts
      .map((item) => {
        const product = item.product as any;
        const videos = Array.isArray(product?.video) ? product.video : [];
        const totalVideos = videos.length;

        let progressPercentage = 0;
        let completedAt: Date | null = null;

        if (totalVideos > 0 && item.lastWatchedVideoId) {
          const lastId = String(item.lastWatchedVideoId).trim();
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
            if (progressPercentage === 100) {
              completedAt = item.updatedAt || item.createdAt;
            }
          }
        }

        return {
          _id: product?._id,
          userName: user.name || "User",
          courseName: product?.name || "Unknown Course",
          completedAt,
          progressPercentage,
        };
      })
      .filter((cert) => cert.progressPercentage === 100);

    if (!isAllCertificates) {
      const specificCert = certificates.find(
        (cert) => cert.courseName === params.key
      );

      if (!specificCert) {
        return NextResponse.json(
          { error: "Sertifikat tidak ditemukan atau kursus belum selesai" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { data: specificCert },
        { status: 200 }
      );
    }

    certificates.sort((a, b) => {
      if (!a.completedAt) return 1;
      if (!b.completedAt) return -1;
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    });

    return NextResponse.json(
      { data: certificates },
      { status: 200 }
    );
  } catch (err) {
    console.error("Gagal mengambil data sertifikat:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}