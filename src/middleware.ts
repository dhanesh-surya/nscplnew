import { NextResponse, type NextRequest } from "next/server";

/**
 * Exposes the current path to server components via an `x-pathname` request
 * header.
 *
 * Why: the root layout renders the site-wide gallery strip, but the App Router
 * gives layouts no direct access to the URL. Reading this header lets the
 * layout skip the strip on /admin without moving every public page into a route
 * group or doing a client-side hide (which would flash).
 *
 * @see src/app/layout.tsx
 */
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Skip Next internals and static files; everything else gets the header.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)"],
};
