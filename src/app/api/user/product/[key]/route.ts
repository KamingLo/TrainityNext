import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Product from "@/models/product";

export async function GET(
  req: Request,
  context: { params: Promise<{ key: string }>}
) {
  try {
    const { key } = await context.params;

    await connectDB();

    const product = await Product.findOne({ name: key });

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}