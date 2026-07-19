import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "eConnect",
  description:
    "VVR eConnect is a disciplined connectivity layer that integrates people, data, and platforms. Sellers and buyers connect through a structured, scalable infrastructure.",
  alternates: { canonical: "https://vvrindustries.com/business/e-connect" },
  openGraph: {
    title: "eConnect — VVR Industries",
    description:
      "A disciplined connectivity layer that keeps people, data, and tools aligned. Platform integration through eConnect.",
    url: "https://vvrindustries.com/business/e-connect",
  },
}

export default function EConnectPage() {
  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-16">
      <p className="type-rolex-overline text-muted-foreground">Business</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        eConnect
      </h1>
      <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
        Placeholder page for eConnect — explain the product or service
        surface: who it is for, the core workflows it supports, and how it
        differs from a one-off integration project.
      </p>
      <ul className="mt-8 list-inside list-disc space-y-2 text-sm text-muted-foreground">
        <li>Unified visibility across tools and teams</li>
        <li>Event-driven updates instead of brittle point-to-point glue</li>
        <li>Security and access patterns that scale with the org chart</li>
      </ul>
    </div>
  )
}
