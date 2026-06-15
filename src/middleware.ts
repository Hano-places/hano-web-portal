import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = [
  "/home",
  "/wallet",
  "/profile",
  "/orders",
  "/checkout",
  "/moments/capture",
  "/business",
  "/onboarding",
];

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-otp"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("@hano/accessToken")?.value;

  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isAuthRoute = authRoutes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // Client-side auth uses localStorage; middleware checks cookie if set
  // For SSR protection, redirect unauthenticated users on protected routes when no cookie
  if (isProtected && !accessToken) {
    // Allow client-side auth check — only block business routes strictly
    if (pathname.startsWith("/business")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/wallet/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/moments/capture/:path*",
    "/business/:path*",
    "/onboarding/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ],
};
