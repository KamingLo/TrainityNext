import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import UserProduct from "@/models/user_product";

export async function GET(
  req: Request,
  { params }: { params: { key: string } }
) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Cari UserProduct yang aktif & populate Product
  const userProduct = await UserProduct.findOne({
    user: session.user.id,
  })
    .populate({
      path: "product",
      match: { name: params.key }, // pastikan key sesuai URL
    });

  if (!userProduct || !userProduct.product || userProduct.status !== "aktif") {
    return new Response(
      JSON.stringify({ message: "Kamu belum membeli produk ini." }),
      { status: 403 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Akses diberikan.",
      lastWatchedVideoId: userProduct.lastWatchedVideoId,
      product: userProduct.product, // ini model Product lengkap
    }),
    { status: 200 }
  );
}

export async function PATCH(
  req: Request,
  { params }: { params: { key: string } }
) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { status, lastWatchedVideoId } = body;

  if (!status && !lastWatchedVideoId) {
    return new Response(
      JSON.stringify({ message: "Tidak ada data untuk diupdate" }),
      { status: 400 }
    );
  }

  // Cari UserProduct yang sesuai
  const userProduct = await UserProduct.findOne({
    user: session.user.id,
  }).populate({
    path: "product",
    match: { name: params.key },
  });

  if (!userProduct || !userProduct.product) {
    return new Response(
      JSON.stringify({ message: "Produk tidak ditemukan untuk user ini" }),
      { status: 404 }
    );
  }

  // Update status jika diberikan
  if (status) userProduct.status = status;

  // Update lastWatchedVideoId jika diberikan
  if (lastWatchedVideoId) userProduct.lastWatchedVideoId = lastWatchedVideoId;

  await userProduct.save();

  return new Response(
    JSON.stringify({
      message: "UserProduct berhasil diupdate",
      userProduct,
    }),
    { status: 200 }
  );
}