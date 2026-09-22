import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { ok: true },
    {
      headers: {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive"
      }
    }
  );

  for (const name of ["churchwork_operator_session", "churchwork_role_session", "churchwork_role"]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0
    });
  }

  return response;
}
