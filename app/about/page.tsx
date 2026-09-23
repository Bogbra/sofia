import type { Metadata } from "next";
import { ogImage } from "@/lib/site";
import AboutContent from "./AboutContent";

const description =
  "Sofia's visual archive is a personal portfolio created as a space for quiet observations, visual experiments and selected stories.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About — Sofia", description, url: "/about", images: [ogImage], type: "website" },
  twitter: { title: "About — Sofia", description, images: [ogImage.url] },
};

export default function AboutPage() {
  return <AboutContent />;
}
