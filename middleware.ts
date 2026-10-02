import { NextRequest, NextResponse } from "next/server";

const INTERNAL_PREFIXES = [
  "/mvp",
  "/demo",
  "/preview",
  "/ai-map",
  "/synthetic-smoke",
  "/pilot",
  "/pilot-auth-check",
  "/pilot-auth-server-check",
  "/pwa-check",
  "/pwa-reset",
  "/requester-portal",
  "/facility-portal"
];

function isInternalPath(pathname: string) {
  if (pathname === "/pilot/reset-password") return false;
  return INTERNAL_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function addPrivateHeaders(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isInternalPath(pathname)) return NextResponse.next();
  return addPrivateHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|manifest-v2.webmanifest|offline|brand/|icons/).*)"
  ]
};
