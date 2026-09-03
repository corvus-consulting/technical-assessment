import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  const response = NextResponse.redirect(new URL("/bookings", url.origin));

  if (userId) {
    response.cookies.set("uid", userId, { httpOnly: true, path: "/" });
  } else {
    response.cookies.delete("uid");
  }

  return response;
}
