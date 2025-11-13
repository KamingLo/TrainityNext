import { NextResponse } from "next/server";
import Product from "@/models/product";
import { canAccess } from "@/lib/access";
import { connectDB } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectDB();

  const product = await Product.findById(id);
  if (!product)
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

  return NextResponse.json(product);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const roleCheck = await canAccess(req, ["admin"]);
  if (roleCheck) return roleCheck;

  try {
    await connectDB();
    const body = await req.json();

    const allowed = ["name", "shortDesc", "desc"];
    const updates: Record<string, string> = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const val = body[key];
        if (typeof val === "string" && val.trim() === "") {
          return NextResponse.json({ error: `${key} tidak boleh kosong` }, { status: 400 });
        }
        updates[key] = val;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Tidak ada field valid untuk diupdate" }, { status: 400 });
    }

    const updated = await Product.findByIdAndUpdate(params.id, updates, { new: true });
    if (!updated)
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ message: "Produk berhasil diperbarui", product: updated });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const roleCheck = await canAccess(req, ["admin"]);
  if (roleCheck) return roleCheck;

  await connectDB();
  const deleted = await Product.findByIdAndDelete(params.id);
  if (!deleted)
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

  return NextResponse.json({ message: "Produk dihapus" });
}
