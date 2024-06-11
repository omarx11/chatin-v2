import { NextResponse } from "next/server";
import { rateLimiter } from "./lib/rate-limiter";
import { errorMsg } from "./data/errorMsg";

// This function can be marked `async` if using `await` inside
export async function middleware(req) {
  const ip = req.ip ?? "127.0.0.1";

  try {
    const { success } = await rateLimiter.limit(ip);

    if (!success) return new NextResponse(errorMsg.limit);
    return NextResponse.next();
  } catch (error) {
    return new NextResponse(
      "Please try to refresh the page, something went wrong!",
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/api/message/:path*",
};
