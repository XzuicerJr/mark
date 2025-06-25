export { auth as middleware } from "@/lib/auth";

import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getUserViaToken, parse } from "./lib/middleware/utils";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (proxies for third-party services)
     * 4. Metadata files: favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest
     */
    "/((?!api/|_next/|_proxy/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest).*)",
  ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { path, fullPath } = parse(req);

  const user = await getUserViaToken(req);

  // if there's no user and the path isn't /login or /signup, redirect to /login
  if (!user && path !== "/login" && path !== "/signup") {
    return NextResponse.redirect(
      new URL(
        `/login${path === "/" ? "" : `?next=${encodeURIComponent(fullPath)}`}`,
        req.url
      )
    );
  }

  // otherwise, rewrite the path to /
  return NextResponse.rewrite(new URL(`/${fullPath}`, req.url));
}
