import "./globals.scss";
import { Recursive } from "next/font/google";
import Providers from "@/app/components/Providers";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata = {
  title: "Chatin App",
  description: "Chat with Bella",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="tracking min-h-screen overflow-x-hidden scroll-smooth antialiased"
    >
      <body
        className={`${recursive.className} min-h-screen bg-gradient-to-b from-gray-700 via-gray-900 to-black`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
