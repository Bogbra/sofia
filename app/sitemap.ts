import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/contact", "/impressum", "/datenschutz"];

  // No lastModified: none of these routes have real per-page change
  // tracking, and stamping every route with the build time on every deploy
  // is a false signal to crawlers (it claims every page changed every time).
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
  }));
}
