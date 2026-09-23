export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sofias-visual-archive.vercel.app";

export const siteName = "Sofia's Visual Archive";

// Shared with every page's `openGraph`/`twitter` metadata: Next.js replaces
// a parent's whole `openGraph` object rather than merging it field-by-field
// when a page sets its own, so each page spreads this in rather than
// silently losing the image.
export const ogImage = { url: "/og-image.jpg", width: 1200, height: 630, alt: siteName };
