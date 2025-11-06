import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isUserPath = pathname.startsWith("/user");
  const isAdminPath = pathname.startsWith("/admin");
  
  if (!token && (isUserPath || isAdminPath)) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (token) {
      const role = (token as any).role;
      if (isAdminPath && role !== "admin") {
          const url = req.nextUrl.clone();
          url.pathname = "/user/dashboard";
          return NextResponse.redirect(url);
          console.log("berhasil")
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
