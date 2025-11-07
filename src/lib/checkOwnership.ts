import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

interface CheckOptions {
  model: string;
  resourceId: string;
  userPath: string; // contoh: "userId" atau "userProduct.userId"
}

export async function ownershipCheck(req: Request, options: CheckOptions) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { model, resourceId, userPath } = options;
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  if (role === "admin") return null;

  const Model = mongoose.models[model];
  if (!Model)
    return NextResponse.json({ message: `Model ${model} not found` }, { status: 500 });

  const resource = await Model.findById(resourceId).populate(userPath.split(".")[0]);
  if (!resource)
    return NextResponse.json({ message: "Resource not found" }, { status: 404 });

  const pathParts = userPath.split(".");
  let ownerId: any = resource;
  for (const part of pathParts) {
    ownerId = ownerId?.[part];
  }

  if (!ownerId)
    return NextResponse.json({ message: "Owner not found" }, { status: 400 });

  if (String(ownerId) !== String(userId))
    return NextResponse.json({ message: "Forbidden: not owner" }, { status: 403 });

  return null;
}
