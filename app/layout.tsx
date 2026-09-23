import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { ogImage, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const description =
  "Sofia's visual archive is a personal portfolio for visual stories, quiet observations and selected work.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s — Sofia",
  },
  description,
  alternates: { canonical: "/" },
  icons: {
    icon: "/fav-icon.svg",
  },
  openGraph: {
    title: siteName,
    description,
    url: siteUrl,
    siteName,
    images: [ogImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: [ogImage.url],
  },
};

const themeInitScript = `try{if(localStorage.getItem('theme')==='dark'){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
