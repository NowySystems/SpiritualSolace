import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "churchwork_internal_access";
const DEFAULT_INTERNAL_KEY = "churchwork-internal-preview";

const INTERNAL_PREFIXES = [
  "/admin",
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

function internalKey() {
  return process.env.CHURCHWORK_INTERNAL_ACCESS_KEY || DEFAULT_INTERNAL_KEY;
}

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

  if (!isInternalPath(pathname)) {
    return NextResponse.next();
  }

  const key = internalKey();
  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;

  if (cookieValue === key) {
    return addPrivateHeaders(NextResponse.next());
  }

  const suppliedKey = request.nextUrl.searchParams.get("access") || request.nextUrl.searchParams.get("key");

  if (suppliedKey && suppliedKey === key) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("access");
    cleanUrl.searchParams.delete("key");

    const response = addPrivateHeaders(NextResponse.redirect(cleanUrl));
    response.cookies.set(COOKIE_NAME, key, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12
    });
    return response;
  }

  const gateUrl = request.nextUrl.clone();
  gateUrl.pathname = "/internal-access";
  gateUrl.search = "";
  gateUrl.searchParams.set("from", pathname);

  return addPrivateHeaders(NextResponse.redirect(gateUrl));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|manifest-v2.webmanifest|offline|brand/|icons/).*)"
  ]
};
