import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import UserProduct from "@/models/user_product";
import Product from "@/models/product";
import User from "@/models/user";

const COURSE_CODE_MAP: { [key: string]: string } = {
  react: "RCT",
  nodejs: "NODE",
  laravel: "LVL",
  golang: "GO",
  php: "PHP",
  javascript: "JS",
  css: "CSS",
  html: "HTML", 
};

const getCourseCode = (courseName: string): string => {
  if (!courseName) return "GEN";
  const name = courseName.toLowerCase();

  for (const key in COURSE_CODE_MAP) {
    if (name.includes(key)) {
      return COURSE_CODE_MAP[key];
    }
  }
  
  return "GEN";
};

const generateCertificateId = (courseName: string, userProductId: string): string => {
  const prefix = "TRN";
  const courseCode = getCourseCode(courseName);
  
  const uniqueIdentifier = String(userProductId).slice(-4).toUpperCase();

  return `${prefix}-${courseCode}-${uniqueIdentifier}`;
};

interface ICertificateData {
  _id: string;
  userName: string;
  courseName: string;
  completedAt: Date | null;
  progressPercentage: number;
  certificateId: string;
}

interface IVideo {
  _id: string;
  kodePelajaran: string;
}

interface IPopulatedProduct {
  _id: string;
  name: string;
  video: IVideo[];
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ key: string }> }
) {
  const params = await context.params;
  
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
        const product = item.product as IPopulatedProduct | null; 

        const videos = Array.isArray(product?.video) ? product.video : [];
        const totalVideos = videos.length;

        let progressPercentage = 0;
        let completedAt: Date | null = null;

        if (totalVideos > 0 && item.lastWatchedVideoId) {
          const lastId = String(item.lastWatchedVideoId).trim();
          const watchedIndex = videos.findIndex((v: IVideo) => {
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

        const courseName = product?.name || "Unknown Course";
        
        const certificateId = generateCertificateId(courseName, String(item._id));
        return {
          _id: product?._id || String(item._id), 
          userName: user.name || "User",
          courseName: courseName,
          completedAt,
          progressPercentage,
          certificateId: certificateId,
        };
      })
      .filter((cert) => cert.progressPercentage === 100); 

  
    if (!isAllCertificates) {
      const specificCert = certificates.find(
        (cert) => cert.courseName === decodeURIComponent(params.key)
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