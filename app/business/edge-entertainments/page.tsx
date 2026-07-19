import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Edge Entertainments",
  description:
    "Edge Entertainments — creative content, original productions, and media experiences from The Edge. Watch the latest videos and stay updated on upcoming releases.",
  alternates: { canonical: "https://vvrindustries.com/business/edge-entertainments" },
  openGraph: {
    title: "Edge Entertainments — VVR Industries",
    description:
      "Creative content, productions, and entertainment experiences from The Edge. Original media built for audiences who expect more.",
    url: "https://vvrindustries.com/business/edge-entertainments",
  },
}

export default function EdgeEntertainmentsPage() {
  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6">
      <p className="type-rolex-overline text-muted-foreground">Business</p>
      <h1 className="mt-4 font-sans text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
        Edge Entertainments
      </h1>
      <p className="mt-6 max-w-2xl text-pretty font-sans text-base leading-[1.9] text-muted-foreground">
        Creative content, productions, and media experiences from The Edge — built
        for audiences who expect more.
      </p>

      {/* ── Featured video ──────────────────────────────────────────── */}
      <div className="mt-12">
        <p className="type-rolex-overline text-muted-foreground">Featured</p>
        <div className="mt-5 overflow-hidden border border-black/10">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/8vtuZCN99xU"
              title="Edge Entertainments — featured video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* ── Placeholder content ─────────────────────────────────────── */}
      <div className="mt-16 space-y-8 border-t border-black/10 pt-12">
        <p className="type-rolex-overline text-muted-foreground">Coming soon</p>
        <p className="font-sans text-base leading-[1.9] text-muted-foreground">
          More content, productions, and entertainment experiences from The Edge
          are on their way. Check back soon or follow us on social media to stay
          updated.
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-px w-4 shrink-0 bg-black/30" />
            Original productions and short-form content
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-px w-4 shrink-0 bg-black/30" />
            Brand storytelling and creative campaigns
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-px w-4 shrink-0 bg-black/30" />
            Live events and media coverage
          </li>
        </ul>
      </div>
    </div>
  )
}
