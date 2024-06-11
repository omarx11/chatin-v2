import Pagination from "./Pagination";
import { meta } from "@/data/config";

// header metadata informations.
export const metadata = {
  title: "History",
  description: `history of ${meta.description}`,
  openGraph: {
    title: "History",
    description: meta.description,
    url: `${meta.siteUrl}/history`,
    images: [
      {
        url: meta.ogImage,
      },
    ],
    type: "website",
  },
};

export default function HistoryPage() {
  return <Pagination />;
}
