import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = [
  "/home",
  "/wallet",
  "/activity",
  "/profile",
  "/settings",
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

  if (pathname === "/location" || pathname.startsWith("/location/")) {
    return NextResponse.redirect(new URL("/places", request.url));
  }

  if (pathname === "/wallet" || pathname.startsWith("/wallet/")) {
    return NextResponse.redirect(new URL("/activity", request.url));
  }

  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isAuthRoute = authRoutes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isProtected && !accessToken) {
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
    "/activity/:path*",
    "/settings/:path*",
    "/location/:path*",
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
