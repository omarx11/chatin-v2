import "./globals.css";
import { Recursive } from "next/font/google";
import Providers from "@/app/components/Providers";
import { config } from "./data/config";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(config.siteUrl),
  title: config.title,
  description: config.descriptionFull,
  keywords: config.keywords,
  authors: { name: config.author },
  creator: config.author,
  icons: {
    icon: ["/favicon.ico"],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    title: config.description,
    description: config.descriptionFull,
    url: config.siteUrl,
    siteName: config.title,
    images: [
      {
        url: config.ogImage,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: config.description,
    description: config.descriptionFull,
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
        className={`${recursive.className} flex flex-col items-center mx-2 min-h-screen bg-[rgb(17,24,39)]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
