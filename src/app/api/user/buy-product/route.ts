import { connectDB } from "@/lib/db";
import UserProduct from "@/models/user_product";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // 1. Cek Sesi Pengguna
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Anda harus login untuk membeli." },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    // 2. Ambil Product ID dari request
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID diperlukan." },
        { status: 400 }
      );
    }

    await connectDB();

    // 3. Cek apakah user sudah memiliki produk ini
    const existingOwnership = await UserProduct.findOne({
      user: userId,
      product: productId,
    });

    if (existingOwnership) {
      // Jika sudah ada, cek statusnya
      if (existingOwnership.status === 'aktif') {
         return NextResponse.json(
          { message: "Anda sudah memiliki produk ini.", product: existingOwnership },
          { status: 200 } // OK
        );
      } else {
        // Jika ada tapi 'pending', update jadi 'aktif'
        existingOwnership.status = 'aktif';
        await existingOwnership.save();
         return NextResponse.json(
          { message: "Produk berhasil diaktifkan.", product: existingOwnership },
          { status: 200 }
        );
      }
    }

    // 4. Jika belum ada, buat entri baru
    const newUserProduct = new UserProduct({
      user: userId,
      product: productId,
      status: "aktif", // Langsung aktif saat dibeli
      lastWatchedVideoId: null,
    });

    await newUserProduct.save();

    return NextResponse.json(
      { message: "Produk berhasil dibeli!", product: newUserProduct },
      { status: 201 } // Created
    );

  } catch (error) {
    console.error("Gagal memproses pembelian:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}