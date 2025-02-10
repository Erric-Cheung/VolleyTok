import { NextResponse, type NextRequest } from "next/server";

import { auth0 } from "./lib/auth0";
import { getCurrentUser } from "./lib/data/user";

const protectedRoutes = ["/welcome", "/profile"];

export async function middleware(req: NextRequest) {
  const authRes = await auth0.middleware(req);

  if (req.nextUrl.pathname.startsWith("/auth")) {
    return authRes;
  }

  const session = await auth0.getSession();
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  // If no session and route is protected
  if (isProtectedRoute && !session) {
    console.log("PROTECTED ROUTE");
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // If user doesn't have profile created
  if (req.nextUrl.pathname.startsWith("/welcome")) {
    console.log("WELCOME ROUTE");
    const user = await getCurrentUser();

    if (user) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  // the headers from the auth middleware should always be returned
  return authRes;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
