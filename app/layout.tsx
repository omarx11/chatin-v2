import "./globals.scss";
import { Metadata } from "next";
import { Link } from "@nextui-org/link";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import { meta } from "@/data/config";
import { Recursive } from "next/font/google";

const recursive = Recursive({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(meta.siteUrl),
  title: {
    default: meta.title,
    template: `%s - ${meta.title}`,
  },
  description: meta.descriptionFull,
  keywords: meta.keywords,
  authors: { name: meta.author },
  creator: meta.author,
  icons: {
    icon: ["/favicon.ico"],
  },
  openGraph: {
    title: meta.description,
    description: meta.descriptionFull,
    url: meta.siteUrl,
    siteName: meta.title,
    images: [
      {
        url: meta.ogImage,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: meta.description,
    description: meta.descriptionFull,
    images: ["https://chatin2.vercel.app/og.png"],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={cn(
          "sm:ring-x-8 min-h-screen bg-background pt-6 text-foreground antialiased ring-secondary-800 light sm:pt-20",
          recursive.className,
        )}
      >
        <Providers>
          <main>{children}</main>
          <footer className="flex w-full items-center justify-center py-3">
            <Link
              isExternal
              href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
              className="flex items-center gap-1 text-current"
              title="nextui.org homepage"
            >
              <span className="text-default-600">Designed by</span>
              <p className="text-secondary">NextUI</p>
            </Link>
          </footer>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
