import Image from "next/image"
import Link from "next/link"

import { KkrvName, KkrvSpacedText } from "@/components/kkrv-name"
import { EarthHero } from "@/components/earth-hero"

const offerings = [
  {
    title: "eConsulting",
    line: "Strategy, governance, and delivery for complex change.",
    href: "/business/e-consulting",
  },
  {
    title: "eConnect",
    line: "A disciplined layer that keeps people, data, and tools aligned.",
    href: "/business/e-connect",
  },
  {
    title: "eMedia Works",
    line: "Full-spectrum media production and publishing for ambitious brands.",
    href: "/business/e-media-works",
  },
  {
    title: "eInvestors",
    line: "Investor intelligence, relations, and opportunity — built on transparency.",
    href: "/business/e-investors",
  },
  {
    title: "eMarketing Services",
    line: "Creative excellence and performance discipline to grow brands that endure.",
    href: "/business/e-marketing-services",
  },
  {
    title: "Platform Integration",
    line: "A structured path to bring your stack into eConnect.",
    href: "/business/connect-your-platform",
  },
] as const

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* ── Hero: full-viewport Earth ─────────────────────────────── */}
      <section className="relative h-[100svh] w-full overflow-hidden bg-black">
        <EarthHero />

        {/* ── Sun glow — warm corona bleeding from upper-right ─── */}
        {/* Outer ambient warmth — wide, very soft */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 96% 2%, rgba(255,232,140,0.13) 0%, rgba(255,210,90,0.06) 40%, transparent 70%)",
          }}
          aria-hidden
        />
        {/* Inner bright corona — tighter, more intense */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 35% 30% at 97% 1%, rgba(255,248,210,0.18) 0%, rgba(255,230,130,0.08) 50%, transparent 75%)",
          }}
          aria-hidden
        />

        {/* Very subtle bottom vignette so page content bleeds in */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent"
          aria-hidden
        />

        {/* Text overlay — centred, fades in with CSS animation */}
        <div className="pointer-events-none absolute inset-x-0 bottom-16 flex flex-col items-center gap-4 px-6 text-center sm:bottom-20">
          <p
            className="animate-fade-up font-sans text-[0.6rem] font-light uppercase tracking-[0.35em] text-white/60 sm:text-[0.625rem]"
            style={{ animationDelay: "3.5s", animationFillMode: "both" }}
          >
            Where the next chapter begins
          </p>
          <h1
            className="animate-fade-up max-w-2xl font-sans text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl"
            style={{ animationDelay: "4s", animationFillMode: "both" }}
          >
            Precision for a connected world
          </h1>
          <Link
            href="#discover"
            className="animate-fade-up pointer-events-auto mt-2 font-sans text-[0.6rem] font-normal uppercase tracking-[0.35em] text-white/50 transition-opacity hover:text-white/80 sm:text-[0.625rem]"
            style={{ animationDelay: "4.6s", animationFillMode: "both" }}
          >
            Scroll to discover ↓
          </Link>
        </div>
      </section>

      {/* ── Editorial section ─────────────────────────────────────── */}
      <section
        id="discover"
        className="border-t border-black/10 bg-white px-6 py-20 sm:px-10 sm:py-28"
      >
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div
            className="flex size-[5.25rem] items-center justify-center rounded-full border border-black sm:size-[5.5rem]"
            aria-hidden
          >
            <span className="font-sans text-base font-medium tracking-[0.28em] sm:text-lg">
              VVR
            </span>
          </div>

          <h2 className="mt-12 font-sans text-[1.65rem] font-medium leading-snug tracking-tight text-foreground sm:text-3xl md:text-[2.125rem]">
            VVR brings composure to ambition — consulting that clarifies,
            and platforms that endure.
          </h2>

          <p className="mt-10 max-w-md text-pretty font-sans text-[0.9375rem] font-normal leading-[1.9] text-muted-foreground sm:max-w-lg sm:text-base">
            We work with leaders who need calm execution at pace: operating
            models that hold under pressure, integrations that do not become
            liabilities, and teams who can sustain the change after the
            workshop ends.
          </p>

          <Link
            href="/about"
            className="mt-12 font-sans text-xs font-medium uppercase tracking-[0.22em] text-foreground underline-offset-[0.35rem] transition-opacity hover:opacity-60 hover:underline"
          >
            Discover VVR
          </Link>
        </div>
      </section>

      {/* ── Founder teaser ───────────────────────────────────────── */}
      <section className="border-t border-black/10 bg-white px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-10 sm:grid-cols-[auto_1fr] sm:gap-16">
            {/* Photo — small, square crop */}
            <div className="mx-auto sm:mx-0">
              <div className="relative size-32 overflow-hidden rounded-full border border-black/10 sm:size-36">
                <Image
                  src="/founder.jpeg"
                  alt="KKRV — Co-Founder"
                  fill
                  className="object-cover object-top"
                  sizes="144px"
                />
              </div>
            </div>

            {/* Text */}
            <div className="text-center sm:text-left">
              <p className="type-rolex-overline text-muted-foreground">Co-Founder</p>
              <p className="mt-3 font-sans text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                <KkrvName />
              </p>
              <p className="mt-1 font-sans text-xs text-muted-foreground">
                Founder, VVR Industries Limited · Marketing Director, VVR Industries
              </p>
              <p className="mt-5 max-w-2xl font-sans text-sm leading-[1.85] text-muted-foreground">
                <KkrvSpacedText text="A visionary entrepreneur known for dedication, strategic thinking, and extensive experience across multiple industries. Through his visionary genius, KKRV set the course for an adventure which has given rise to exceptional products and an unparalleled brand built on perpetual excellence." />
              </p>
              <Link
                href="/about"
                className="mt-6 inline-block font-sans text-xs font-medium uppercase tracking-[0.22em] text-foreground underline-offset-4 transition-opacity hover:opacity-60 hover:underline"
              >
                Read the full story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────── */}
      <section className="border-t border-black/10 bg-white px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center type-rolex-overline text-muted-foreground">
            Capabilities
          </p>
          <ul className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((item) => (
              <li
                key={item.href}
                className="flex flex-col border-t border-black/10 pt-8"
              >
                <h3 className="font-sans text-xl font-medium tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-4 font-sans text-sm font-normal leading-[1.85] text-muted-foreground">
                  {item.line}
                </p>
                <Link
                  href={item.href}
                  className="mt-6 inline-block font-sans text-xs font-medium uppercase tracking-[0.18em] text-foreground underline-offset-4 transition-opacity hover:opacity-60 hover:underline"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Careers teaser ───────────────────────────────────────── */}
      <section className="border-t border-black/10 bg-white px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-xl text-center">
          <p className="type-rolex-overline text-muted-foreground">Join us</p>
          <p className="mt-6 font-sans text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            We are always interested in people who care about craft.
          </p>
          <Link
            href="/careers"
            className="mt-8 inline-block font-sans text-xs font-medium uppercase tracking-[0.22em] text-foreground underline-offset-[0.35rem] transition-opacity hover:opacity-60 hover:underline"
          >
            Careers at VVR
          </Link>
        </div>
      </section>
    </div>
  )
}
