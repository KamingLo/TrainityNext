import { NextResponse } from "next/server";
import Product from "@/models/product";
import { connectDB } from "@/lib/db";
import { canAccess } from "@/lib/access"; 

// CREATE
export async function POST(req: Request) {

    const roleCheck = await canAccess(req, ["admin"]);
    if (roleCheck) return roleCheck;

    try {
        await connectDB();
        const data = await req.json();

        const existing = await Product.findOne({ name: data.name });
        if (existing) {
        const newVideos = data.video.filter(
            (v: any) =>
            !existing.video.some(
                (ev: any) => ev.namaPelajaran === v.namaPelajaran
            )
        );

        if (newVideos.length === 0) {
            return NextResponse.json(
            { message: "Nama pelajaran sudah ada, tidak ada yang ditambahkan" },
            { status: 200 }
            );
        }

        existing.video.push(...newVideos);
        await existing.save();

        return NextResponse.json(
            { message: "Video baru ditambahkan", product: existing },
            { status: 200 }
        );
        } else {
        const newProduct = await Product.create(data);
        return NextResponse.json(
            { message: "Produk baru dibuat", product: newProduct },
            { status: 201 }
        );
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET ALL
export async function GET(req: Request) {
    try {
        await connectDB();
        const products = await Product.find().sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
