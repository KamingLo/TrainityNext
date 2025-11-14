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
        select: "name shortDesc video",
        populate: {
          path: "video", // kalau video adalah array ref
          select: "kodePelajaran",
        }
      })
      .lean();

    const result = owned.map((item) => {
      const product = item.product;

      // nge-guard biar ga error kalau kosong
      const kodePertama = Array.isArray(product?.video)
        ? product.video[0]?.kodePelajaran
        : null;

      return {
        name: product?.name,
        shortDesc: product?.shortDesc,
        kodePertama: kodePertama || null
      };
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
