import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "eInvestors",
}

const pillars = [
  {
    title: "Investor Relations",
    body: "Structured, transparent communication between VVR Industries and its investors — performance reporting, strategic updates, and governance documentation delivered with precision.",
  },
  {
    title: "Investment Opportunities",
    body: "Access to curated business and sector opportunities within the VVR ecosystem — vetted, structured, and presented for informed decision-making.",
  },
  {
    title: "Due Diligence Support",
    body: "Expert guidance through the due diligence process — financial, operational, and commercial assessments that protect investor interests and expedite sound decisions.",
  },
  {
    title: "Portfolio Management",
    body: "Ongoing monitoring, reporting, and strategic advisory for investment portfolios — ensuring value creation is tracked and maximised at every stage.",
  },
]

export default function EInvestorsPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">

      {/* ── Header ───────────────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Business · VVR Industries
          </p>
          <h1 className="mt-6 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            eInvestors
          </h1>
          <p className="mt-8 max-w-xl font-sans text-base leading-[1.9] text-muted-foreground">
            The investor intelligence and relations platform of VVR Industries
            Limited — built for transparency, performance, and long-term value
            creation between the company and its stakeholders.
          </p>
        </div>
      </section>

      {/* ── Philosophy ───────────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-16 sm:grid-cols-[1fr_2fr]">
          <p className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.32em] text-muted-foreground pt-1">
            Our commitment
          </p>
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl">
              Perpetual growth through principled investment.
            </h2>
            <p className="font-sans text-[0.9375rem] leading-[1.9] text-muted-foreground">
              At VVR Industries, we believe that strong investor relationships
              are built on three foundations: clarity of purpose, consistency
              of communication, and a demonstrable track record of delivering
              on commitments.
            </p>
            <p className="font-sans text-[0.9375rem] leading-[1.9] text-muted-foreground">
              eInvestors exists to make those foundations visible — giving our
              investors the information, access, and confidence they need to
              partner with us for the long term.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pillars ──────────────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            What eInvestors provides
          </p>
          <ul className="mt-14 grid gap-10 sm:grid-cols-2">
            {pillars.map((p) => (
              <li key={p.title} className="border-t border-black/10 pt-8">
                <h3 className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-foreground">
                  {p.title}
                </h3>
                <p className="mt-4 font-sans text-sm leading-[1.85] text-muted-foreground">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Key metrics placeholder ───────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            At a glance
          </p>
          <ul className="mt-10 grid gap-0 divide-y divide-black/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { stat: "Multi-sector", label: "Industry exposure across key growth verticals" },
              { stat: "Long-term", label: "Investment philosophy built on sustainable returns" },
              { stat: "Transparent", label: "Regular reporting and open stakeholder communication" },
            ].map((item) => (
              <li key={item.stat} className="flex flex-col gap-2 py-10 sm:px-10 sm:py-0 sm:first:pl-0 sm:last:pr-0">
                <span className="font-serif text-3xl font-medium text-foreground">{item.stat}</span>
                <span className="font-sans text-sm leading-relaxed text-muted-foreground">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Interested in partnering with VVR?
          </p>
          <p className="mt-6 font-sans text-sm leading-relaxed text-muted-foreground">
            We welcome conversations with investors who share our commitment to
            quality, innovation, and principled long-term growth.
          </p>
          <Link
            href="/about"
            className="mt-10 inline-block font-sans text-xs font-medium uppercase tracking-[0.22em] text-foreground underline-offset-[0.35rem] transition-opacity hover:opacity-60 hover:underline"
          >
            Learn about VVR Industries
          </Link>
        </div>
      </section>
    </div>
  )
}
