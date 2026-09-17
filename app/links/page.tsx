import type { Metadata } from "next"

import { LinksHub } from "@/components/links-hub"

export const metadata: Metadata = {
  title: "Links",
  description:
    "The Edge link hub — buyers, sellers, 24/7 support, careers, Edge solutions, social channels, and agent locations.",
  alternates: { canonical: "https://vvrindustries.com/links" },
  openGraph: {
    title: "Links — The Edge · VVR Industries",
    description:
      "Connect as a buyer or seller, reach 24/7 support, explore Edge solutions, careers, and find our agents.",
    url: "https://vvrindustries.com/links",
  },
}

export default function LinksPage() {
  return <LinksHub />
}
