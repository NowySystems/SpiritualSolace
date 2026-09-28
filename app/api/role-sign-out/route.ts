import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { ok: true, message: "Signed out of ChurchWork pilot." },
    {
      headers: {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive"
      }
    }
  );

  response.cookies.set("churchwork_role_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  response.cookies.set("churchwork_role", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  response.cookies.set("churchwork_operator_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  response.cookies.set("churchwork_pending_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  response.cookies.set("churchwork_pending_portal", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  return response;
}
