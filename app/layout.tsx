import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { PageLoader } from "@/components/page-loader"
import { SiteShell } from "@/components/site-shell"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const BASE_URL = "https://vvrindustries.com"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "VVR Industries",
    template: "%s · VVR Industries",
  },
  description:
    "VVR Industries Limited — consulting, connectivity, and careers. Precision, performance and reliability across eConsulting, eConnect, eMedia Works, eInvestors, and eMarketing Services.",
  keywords: [
    "VVR Industries",
    "VVR",
    "The Edge",
    "eConsulting",
    "eConnect",
    "eMedia Works",
    "eInvestors",
    "eMarketing Services",
    "Edge Entertainments",
    "consulting",
    "India",
    "business",
    "platform integration",
  ],
  authors: [{ name: "VVR Industries Limited", url: BASE_URL }],
  creator: "VVR Industries Limited",
  publisher: "VVR Industries Limited",
  category: "business",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "VVR Industries",
    title: "VVR Industries — Precision for a connected world",
    description:
      "VVR Industries Limited — consulting, connectivity, and careers. Precision, performance and reliability.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VVR Industries — Precision for a connected world",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vvrtheedge",
    creator: "@vvrtheedge",
    title: "VVR Industries — Precision for a connected world",
    description:
      "VVR Industries Limited — consulting, connectivity, and careers. Precision, performance and reliability.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <PageLoader />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
