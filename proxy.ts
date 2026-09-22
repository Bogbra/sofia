import { NextRequest, NextResponse } from "next/server";

// script-src and style-src keep 'unsafe-inline' rather than a nonce or hash.
// A nonce needs Next to inject it into every request-specific inline
// script it generates (the RSC payload chunks it streams inline are
// different on every build/page, so they can't be hash-allow-listed), and
// nonces only work with dynamic rendering — this site is fully static, and
// forcing per-request rendering site-wide is a worse tradeoff than
// 'unsafe-inline' for a static portfolio with no user-generated content.
// style-src additionally can't use a nonce/hash at all here: GSAP animates
// via element.style.* on every frame, and that has no allow-listing
// mechanism (only <style> tags do, not the style="" attribute).
export function proxy(_request: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
    font-src 'self';
    connect-src 'self' https://api.web3forms.com${isDev ? " ws:" : ""};
    form-action 'self' https://api.web3forms.com;
    frame-ancestors 'none';
    object-src 'none';
    base-uri 'self';
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", cspHeader);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
