import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "eConsulting",
  description:
    "VVR eConsulting delivers strategy, governance, and programme delivery for complex change. We diagnose problems, shape roadmaps, and embed with client teams.",
  alternates: { canonical: "https://vvrindustries.com/business/e-consulting" },
  openGraph: {
    title: "eConsulting — VVR Industries",
    description:
      "Strategy, governance, and delivery for complex change. VVR eConsulting works with leaders who need calm execution at pace.",
    url: "https://vvrindustries.com/business/e-consulting",
  },
}

export default function EConsultingPage() {
  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-16">
      <p className="type-rolex-overline text-muted-foreground">Business</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        eConsulting
      </h1>
      <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
        Placeholder page for eConsulting — describe how you diagnose
        problems, shape roadmaps, and embed with client teams. Replace this
        with case patterns, typical engagement lengths, and industries you
        serve.
      </p>
      <ul className="mt-8 list-inside list-disc space-y-2 text-sm text-muted-foreground">
        <li>Discovery and target operating model</li>
        <li>Programme design and governance</li>
        <li>Vendor selection and integration planning</li>
      </ul>
    </div>
  )
}
