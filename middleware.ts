import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_LOGIN_PATH = "/admin";
const PUBLIC_ADMIN_PATHS = new Set<string>([ADMIN_LOGIN_PATH]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin (excluding the login page itself)
  if (pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.has(pathname)) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = ADMIN_LOGIN_PATH;
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
