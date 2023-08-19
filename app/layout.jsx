import "./globals.scss";
import { Recursive } from "next/font/google";
import Providers from "@/app/components/Providers";
import { meta } from "./data/config";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata = {
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
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
    images: ["https://test.omar11.sa/og.png"],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="tracking min-h-screen overflow-x-hidden scroll-smooth antialiased"
    >
      <body
        className={`${recursive.className} flex min-h-screen flex-row items-start justify-center bg-[rgb(17,24,39)] pt-12 md:pt-24`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
