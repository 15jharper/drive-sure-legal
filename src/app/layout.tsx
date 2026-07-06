import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "@/context/cart";
import { CartDrawer } from "@/components/cart-drawer";
import { Loader } from "@/components/loader";
import { Nav } from "@/components/nav";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: siteConfig.url },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          <Loader />
          <div className="film-grain animate-grain" aria-hidden="true" />
          <div className="vignette" aria-hidden="true" />
          <Nav />
          <CartDrawer />
          <main>{children}</main>
          <Analytics />
          <SpeedInsights />
        </CartProvider>
      </body>
    </html>
  );
}
