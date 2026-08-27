import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "churchwork_internal_access";

const INTERNAL_PREFIXES = [
  "/mvp",
  "/demo",
  "/preview",
  "/design",
  "/ai-map",
  "/synthetic-smoke",
  "/pilot",
  "/pilot-auth-check",
  "/pilot-auth-server-check",
  "/pwa-check",
  "/pwa-reset",
  "/app",
  "/care-binder",
  "/advisor-intelligence",
  "/daily-brief",
  "/donor-market-intelligence",
  "/evidence-intelligence",
  "/fund-class-map",
  "/funding-search",
  "/governance",
  "/grant-radar",
  "/grants-gov-live",
  "/guardrails",
  "/keyword-category-manager",
  "/landing-v1",
  "/learning-loop",
  "/opportunity-database",
  "/past-awards",
  "/proposal-scanner",
  "/reports",
  "/request-care",
  "/review-queue",
  "/source-database",
  "/source-watch",
  "/api/churchwork-demo-audio",
  "/api/grants-gov",
  "/api/review-queue",
  "/api/source-pilots",
  "/api/usaspending"
];

const PUBLIC_RECOVERY_PATHS = new Set([
  "/pilot/reset-password"
]);

function internalKey() {
  const value = process.env.CHURCHWORK_INTERNAL_ACCESS_KEY?.trim();
  return value || null;
}

function isInternalPath(pathname: string) {
  return INTERNAL_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function addPrivateHeaders(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Password recovery must remain reachable from the Supabase recovery email even
  // though other legacy /pilot/* diagnostics are internal-only.
  if (PUBLIC_RECOVERY_PATHS.has(pathname)) {
    return addPrivateHeaders(NextResponse.next());
  }

  // The operator console has its own owner/platform-admin Supabase authentication.
  // Keep it private/noindex, but do not hide its login screen behind the generic
  // diagnostics/demo access key.
  if (isAdminPath(pathname)) {
    return addPrivateHeaders(NextResponse.next());
  }

  if (!isInternalPath(pathname)) {
    return NextResponse.next();
  }

  const key = internalKey();

  if (!key) {
    return addPrivateHeaders(
      new NextResponse("ChurchWork internal access is not configured.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      })
    );
  }

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
