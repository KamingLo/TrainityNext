import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

// ROLE-BASED ACCESS CHECK
export async function canAccess(req: Request, roles: string[] = []) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { role } = session.user;
  if (role === "admin" || roles.includes(role)) return null;

  return NextResponse.json({ message: "Forbidden: insufficient role" }, { status: 403 });
}

// OWNERSHIP CHECK TANPA CEK ROLE
export async function ownershipCheck(req: Request, options: CheckOptions) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { model, resourceId, userPath } = options;
  const userId = session.user.id;

  const Model = mongoose.models[model];
  if (!Model)
    return NextResponse.json({ message: `Model ${model} not found` }, { status: 500 });

  const resource = await Model.findById(resourceId).populate(userPath.split(".")[0]);
  if (!resource)
    return NextResponse.json({ message: "Resource not found" }, { status: 404 });

  // traverse nested path (e.g. "author._id")
  const pathParts = userPath.split(".");
  let ownerId: unknown = resource;
  for (const part of pathParts) {
    ownerId = (ownerId as Record<string, unknown>)?.[part];
  }

  if (!ownerId)
    return NextResponse.json({ message: "Owner not found" }, { status: 400 });

  if (String(ownerId) !== String(userId))
    return NextResponse.json({ message: "Forbidden: not owner" }, { status: 403 });

  return null;
}
