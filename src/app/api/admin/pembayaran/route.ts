// app/api/admin/pembayaran/route.ts
import { connectDB } from "@/lib/db";
import UserProduct from "@/models/user_product";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit")) || 20),
    );
    const search = (searchParams.get("search") || "").trim();

    const skip = (page - 1) * limit;

    // Filter pencarian
    const filter: any = {};
    if (search) {
      filter.$or = [
        { "user.email": { $regex: search, $options: "i" } },
        { "product.name": { $regex: search, $options: "i" } },
      ];
    }

    // Aggregation yang BENAR → selalu return ARRAY
    const userProducts = await UserProduct.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [{ $project: { email: 1, name: 1 } }],
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          user: { email: "$user.email", name: "$user.name" },
          product: { name: "$product.name" },
          createdAt: 1,
        },
      },
    ]);

    const total = await UserProduct.countDocuments(filter);

    // Pastikan userProducts selalu array
    return NextResponse.json({
      userProducts: userProducts || [], // ← ini yang penting!
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error: any) {
    console.error("Admin pembayaran error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}
