import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "eMedia Works",
}

const services = [
  {
    title: "Content Production",
    body: "End-to-end content creation — from scripting and storyboarding to high-quality video, photography, and graphic assets that communicate your brand with precision.",
  },
  {
    title: "Digital Publishing",
    body: "Multi-channel publishing strategies that place your content where it matters most — web, social, streaming, and owned media platforms — at scale and on schedule.",
  },
  {
    title: "Brand Storytelling",
    body: "Crafting narratives that resonate. We build editorial frameworks, tone-of-voice guidelines, and campaign content that builds lasting brand recognition.",
  },
  {
    title: "Media Analytics",
    body: "Data-driven insights into how your media performs. Audience reach, engagement quality, and content ROI — measured, reported, and actioned continuously.",
  },
]

export default function EMediaWorksPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">

      {/* ── Header ───────────────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="type-rolex-overline text-muted-foreground">
            Business · VVR Industries
          </p>
          <h1 className="mt-6 font-sans text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            eMedia Works
          </h1>
          <p className="mt-8 max-w-xl font-sans text-base leading-[1.9] text-muted-foreground">
            A full-spectrum media production and publishing arm of VVR
            Industries — built for organisations that need their story told
            with clarity, consistency, and creative ambition.
          </p>
        </div>
      </section>

      {/* ── What we do ───────────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="type-rolex-overline text-muted-foreground">
            What we do
          </p>
          <h2 className="mt-6 max-w-lg font-sans text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl">
            Media that moves people and markets.
          </h2>
          <ul className="mt-14 grid gap-10 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.title} className="border-t border-black/10 pt-8">
                <h3 className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-foreground">
                  {s.title}
                </h3>
                <p className="mt-4 font-sans text-sm leading-[1.85] text-muted-foreground">
                  {s.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="type-rolex-overline text-muted-foreground">
            Process
          </p>
          <ol className="mt-10 space-y-8">
            {[
              { n: "01", label: "Brief & Discovery", detail: "We begin with a structured brief — understanding your audience, objectives, channels, and brand voice." },
              { n: "02", label: "Strategy & Planning", detail: "Content calendar, format selection, production schedule, and distribution plan — aligned to your business goals." },
              { n: "03", label: "Production", detail: "In-house production resources and a curated network of specialists deliver assets to brief, on time." },
              { n: "04", label: "Publish & Measure", detail: "We manage publication, monitor performance, and feed insights back into the next production cycle." },
            ].map((step) => (
              <li key={step.n} className="grid gap-4 border-t border-black/10 pt-8 sm:grid-cols-[4rem_1fr]">
                <span className="font-sans text-xs text-muted-foreground">{step.n}</span>
                <div>
                  <p className="font-sans text-sm font-medium text-foreground">{step.label}</p>
                  <p className="mt-2 font-sans text-sm leading-[1.85] text-muted-foreground">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-sans text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Ready to build your media presence?
          </p>
          <p className="mt-6 font-sans text-sm leading-relaxed text-muted-foreground">
            Connect with the eMedia Works team to discuss your next campaign,
            content series, or brand publishing strategy.
          </p>
          <Link
            href="/business/connect-your-platform"
            className="mt-10 inline-block font-sans text-xs font-medium uppercase tracking-[0.22em] text-foreground underline-offset-[0.35rem] transition-opacity hover:opacity-60 hover:underline"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  )
}
