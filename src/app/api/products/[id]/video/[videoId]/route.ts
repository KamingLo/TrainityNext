import { NextResponse } from "next/server";
import Product from "@/models/product";
import { connectDB } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; videoId: string } }
) {
  try {
    const { id, videoId } = params;
    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const video = product.video.id(videoId);
    if (!video) {
      return NextResponse.json({ error: "Video tidak ditemukan" }, { status: 404 });
    }

    video.deleteOne();
    await product.save();

    return NextResponse.json(
      { message: "Video berhasil dihapus", product },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /video error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; videoId: string } }
) {
  try {
    const { id, videoId } = params;
    const { namaPelajaran, kodePelajaran } = await req.json();
    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const video = product.video.id(videoId);
    if (!video) {
      return NextResponse.json({ error: "Video tidak ditemukan" }, { status: 404 });
    }

    if (namaPelajaran) video.namaPelajaran = namaPelajaran;
    if (kodePelajaran) video.kodePelajaran = kodePelajaran;

    await product.save();

    return NextResponse.json(
      { message: "Video berhasil diperbarui", product },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH /video error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
