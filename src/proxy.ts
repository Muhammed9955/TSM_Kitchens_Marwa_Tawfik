import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rewrite non-English routes to Arabic locale prefix internally
  if (!pathname.startsWith("/en")) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = `/ar${pathname}`;
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Intercept all routes except Next.js internals, images, and static assets
    "/((?!_next|images|api|favicon.ico|.*\\..*).*)",
  ],
};
