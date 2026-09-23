import type { Metadata } from "next";
import { ogImage } from "@/lib/site";
import ContactContent from "./ContactContent";

const description = "Get in touch for collaborations, portrait sessions or a simple hello.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact — Sofia", description, url: "/contact", images: [ogImage], type: "website" },
  twitter: { title: "Contact — Sofia", description, images: [ogImage.url] },
};

export default function ContactPage() {
  return <ContactContent />;
}
