import type { Metadata } from "next"
import Link from "next/link"

import { KkrvName } from "@/components/kkrv-name"

export const metadata: Metadata = {
  title: "eMarketing Services",
}

const offerings = [
  {
    title: "Brand Strategy",
    body: "Defining your brand position, audience, messaging hierarchy, and competitive differentiation — the strategic foundation on which every campaign is built.",
  },
  {
    title: "Digital Marketing",
    body: "Performance-driven campaigns across search, social, display, and programmatic channels. Data-informed targeting, continuous optimisation, and clear attribution.",
  },
  {
    title: "Market Research",
    body: "Quantitative and qualitative research that surfaces real customer insights — market sizing, competitor analysis, customer segmentation, and demand mapping.",
  },
  {
    title: "Growth & Demand",
    body: "End-to-end demand generation: from awareness through to conversion and retention. Funnel design, lead nurturing, and lifecycle marketing that compounds over time.",
  },
  {
    title: "Creative Services",
    body: "Campaign creative — copywriting, design, video, and interactive — built to brand and produced to perform across every touchpoint and channel.",
  },
  {
    title: "Analytics & Reporting",
    body: "Marketing intelligence that connects spend to outcomes. Custom dashboards, attribution modelling, and insight-led optimisation cycles for continuous improvement.",
  },
]

export default function EMarketingServicesPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">

      {/* ── Header ───────────────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="type-rolex-overline text-muted-foreground">
            Business · VVR Industries
          </p>
          <h1 className="mt-6 font-sans text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            eMarketing Services
          </h1>
          <p className="mt-8 max-w-xl font-sans text-base leading-[1.9] text-muted-foreground">
            Strategic marketing and demand generation for ambitious businesses.
            VVR&apos;s eMarketing Services combines creative excellence, market
            intelligence, and performance discipline to grow brands that endure.
          </p>
        </div>
      </section>

      {/* ── Approach ─────────────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-16 sm:grid-cols-[1fr_2fr]">
          <p className="type-rolex-overline text-muted-foreground pt-1">
            Our approach
          </p>
          <div className="space-y-6">
            <h2 className="font-sans text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl">
              Marketing built on intelligence, executed with precision.
            </h2>
            <p className="font-sans text-[0.9375rem] leading-[1.9] text-muted-foreground">
              Under the leadership of <KkrvName /> — Marketing Director of VVR
              Industries — our eMarketing Services practice combines deep
              market insight with modern execution capabilities. We do not
              separate strategy from delivery: the same team that sets the
              direction runs the campaigns.
            </p>
            <p className="font-sans text-[0.9375rem] leading-[1.9] text-muted-foreground">
              Our philosophy mirrors VVR&apos;s founding principle of perpetual
              excellence — every campaign is an opportunity to learn, improve,
              and compound the advantage of those who came before it.
            </p>
          </div>
        </div>
      </section>

      {/* ── Services grid ────────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="type-rolex-overline text-muted-foreground">
            Services
          </p>
          <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((o) => (
              <li key={o.title} className="border-t border-black/10 pt-8">
                <h3 className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-foreground">
                  {o.title}
                </h3>
                <p className="mt-4 font-sans text-sm leading-[1.85] text-muted-foreground">
                  {o.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── How we engage ────────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="type-rolex-overline text-muted-foreground">
            Engagement models
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { model: "Project", detail: "One-time or campaign-based engagements with a defined scope, timeline, and deliverables." },
              { model: "Retainer", detail: "Ongoing strategic partnership — a dedicated team embedded in your marketing function month after month." },
              { model: "Advisory", detail: "Senior marketing leadership on a fractional basis — for organisations that need the thinking without the full headcount." },
            ].map((item) => (
              <li key={item.model} className="border border-black/10 p-6">
                <p className="font-sans text-lg font-medium text-foreground">{item.model}</p>
                <p className="mt-3 font-sans text-sm leading-[1.85] text-muted-foreground">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-sans text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Let&apos;s grow your business together.
          </p>
          <p className="mt-6 font-sans text-sm leading-relaxed text-muted-foreground">
            Tell us about your marketing challenge. We will respond with a
            clear point of view and a plan.
          </p>
          <Link
            href="/business/connect-your-platform"
            className="mt-10 inline-block font-sans text-xs font-medium uppercase tracking-[0.22em] text-foreground underline-offset-[0.35rem] transition-opacity hover:opacity-60 hover:underline"
          >
            Start the conversation
          </Link>
        </div>
      </section>
    </div>
  )
}
