import { NextResponse } from "next/server";
import { rateLimiter } from "@/app/lib/rate-limiter";

// This function can be marked `async` if using `await` inside
export async function middleware(req) {
  const ip = req.ip ?? "127.0.0.1";

  try {
    const { success } = await rateLimiter.limit(ip);

    if (!success) return new NextResponse("You are writing messages too fast.");
    return NextResponse.next();
  } catch (error) {
    return new NextResponse(
      "Sorry, something went wrong processing your message. Please refresh the page."
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/api/message/:path*",
};
