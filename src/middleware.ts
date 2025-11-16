import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

interface CustomToken {
    role: "admin" | "user";
}

const AUTH_PATHS = ["/auth/login", "/auth/register"];

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    const isUserPath = pathname.startsWith("/user");
    const isAdminPath = pathname.startsWith("/admin");
    const isAuthPath = AUTH_PATHS.includes(pathname);

    if (isAdminPath) {
        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = "/auth/login";
            return NextResponse.redirect(url);
        }

        if ((token as CustomToken).role !== "admin") {
            const url = req.nextUrl.clone();
            url.pathname = "/user/dashboard";
            return NextResponse.redirect(url);
        }
    }

    if (isUserPath && !token) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
    }

    if (token && isAuthPath) {
        const role = (token as CustomToken).role;
        const url = req.nextUrl.clone();
        url.pathname = role === "admin" ? "/admin/dashboard" : "/user/dashboard";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
