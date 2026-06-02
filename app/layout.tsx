import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { PageLoader } from "@/components/page-loader"
import { SiteHeader } from "@/components/site-header"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "VVR",
    template: "%s · VVR",
  },
  description:
    "VVR Industries Limited — consulting, connectivity, and careers. Precision, performance and reliability.",
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
        <SiteHeader />
        <main className="site-content flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  )
}
