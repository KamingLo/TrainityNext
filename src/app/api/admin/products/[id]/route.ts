import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/product";
import { canAccess } from "@/lib/access";
import { connectDB } from "@/lib/db";

// GET /api/admin/products/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <- pakai Promise
) {
  const { id } = await params; // harus await
  await connectDB();

  const product = await Product.findById(id);
  if (!product)
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

  return NextResponse.json(product);
}

// PATCH /api/admin/products/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const roleCheck = await canAccess(req, ["admin"]);
  if (roleCheck) return roleCheck;

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

  const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
  if (!updated)
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

  return NextResponse.json({ message: "Produk berhasil diperbarui", product: updated });
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const roleCheck = await canAccess(req, ["admin"]);
  if (roleCheck) return roleCheck;

  await connectDB();
  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted)
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

  return NextResponse.json({ message: "Produk dihapus" });
}
