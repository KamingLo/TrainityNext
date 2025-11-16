import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/product";
import { connectDB } from "@/lib/db";
import { canAccess } from "@/lib/access";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; videoId: string }> } // <- Promise
) {
  const { id, videoId } = await params; // harus await
  const roleCheck = await canAccess(req, ["admin"]);
  if (roleCheck) return roleCheck;

  try {
    await connectDB();
    const product = await Product.findById(id);
    if (!product)
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

    const video = product.video.id(videoId);
    if (!video)
      return NextResponse.json({ error: "Video tidak ditemukan" }, { status: 404 });

    video.deleteOne();
    await product.save();

    return NextResponse.json(
      { message: "Video berhasil dihapus", product },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("DELETE /video error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; videoId: string }> } // <- Promise
) {
  const { id, videoId } = await params;
  const roleCheck = await canAccess(req, ["admin"]);
  if (roleCheck) return roleCheck;

  try {
    const { namaPelajaran, kodePelajaran } = await req.json();
    await connectDB();

    const product = await Product.findById(id);
    if (!product)
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

    const video = product.video.id(videoId);
    if (!video)
      return NextResponse.json({ error: "Video tidak ditemukan" }, { status: 404 });

    if (namaPelajaran) video.namaPelajaran = namaPelajaran;
    if (kodePelajaran) video.kodePelajaran = kodePelajaran;

    await product.save();

    return NextResponse.json(
      { message: "Video berhasil diperbarui", product },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("PATCH /video error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
