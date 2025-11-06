import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

interface CheckOptions {
  model: string;             // contoh: "Payment" atau "UserProduct"
  resourceId: string;        // id resource yang mau dicek
  userPath: string;          // field user pemilik, misal: "userId" atau "userProduct.userId"
  allowedRoles: ("admin" | "user")[];
}

export async function ownershipCheck(req: Request, options: CheckOptions) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { model, resourceId, userPath, allowedRoles } = options;
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  // kalau admin boleh akses → langsung lanjut
  if (allowedRoles.includes("admin") && role === "admin") return null;

  // ambil model mongoose
  const Model = mongoose.models[model];
  if (!Model) {
    return NextResponse.json({ message: `Model ${model} not found` }, { status: 500 });
  }

  // ambil resource dari DB
  const resource = await Model.findById(resourceId).populate(userPath.split(".")[0]);
  if (!resource) {
    return NextResponse.json({ message: "Resource not found" }, { status: 404 });
  }

  // ambil ownerId (support nested path)
  const pathParts = userPath.split(".");
  let ownerId = resource;
  for (const part of pathParts) {
    ownerId = ownerId?.[part];
  }

  if (!ownerId) {
    return NextResponse.json({ message: "Owner not found" }, { status: 400 });
  }

  if (String(ownerId) !== String(userId)) {
    return NextResponse.json({ message: "Forbidden: not owner" }, { status: 403 });
  }

  return null; // lolos cek
}
