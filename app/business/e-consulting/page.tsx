import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "eConsulting",
}

export default function EConsultingPage() {
  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-16">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground">
        Business
      </p>
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
