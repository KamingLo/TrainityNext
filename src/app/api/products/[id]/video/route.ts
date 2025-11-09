import { NextResponse } from "next/server";
import Product from "@/models/product";
import { connectDB } from "@/lib/db";
import { canAccess } from "@/lib/access";

// CREATE — tambah video baru ke produk
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {

    const roleCheck = await canAccess(req, ["admin"]);
    if (roleCheck) return roleCheck;

    try {
        const { id } = await context.params;
        await connectDB();

        const { namaPelajaran, kodePelajaran } = await req.json();
        if (!namaPelajaran || !kodePelajaran) {
        return NextResponse.json({ error: "Data video tidak lengkap" }, { status: 400 });
        }

        const product = await Product.findById(id);
        if (!product) {
        return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
        }

        // cek duplikat namaPelajaran
        const duplicate = product.video.some((v: any) => v.namaPelajaran === namaPelajaran);
        if (duplicate) {
        return NextResponse.json(
            { message: "Nama pelajaran sudah ada, tidak ditambahkan", product },
            { status: 200 }
        );
        }

        product.video.push({ namaPelajaran, kodePelajaran });
        await product.save();

        return NextResponse.json(
        { message: "Video berhasil ditambahkan", product },
        { status: 201 }
        );
    } catch (error: any) {
        console.error("POST /video error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}