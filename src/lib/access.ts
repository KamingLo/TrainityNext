import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ROLE-BASED ACCESS CHECK
export async function canAccess(req: Request, roles: string[] = []) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { role } = session.user;
  if (role === "admin" || roles.includes(role)) return null;

  return NextResponse.json({ message: "Forbidden: insufficient role" }, { status: 403 });
}