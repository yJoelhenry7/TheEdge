import Link from "next/link"

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
    title: "Your platform, connected",
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
            className="animate-fade-up font-sans text-[0.6rem] font-light uppercase tracking-[0.42em] text-white/60 sm:text-[0.65rem]"
            style={{ animationDelay: "3.5s", animationFillMode: "both" }}
          >
            Where the next chapter begins
          </p>
          <h1
            className="animate-fade-up max-w-2xl font-serif text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl"
            style={{ animationDelay: "4s", animationFillMode: "both" }}
          >
            Precision for a connected world
          </h1>
          <Link
            href="#discover"
            className="animate-fade-up pointer-events-auto mt-2 font-sans text-[0.6rem] uppercase tracking-[0.3em] text-white/50 transition-opacity hover:text-white/80 sm:text-[0.65rem]"
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
            className="flex size-[4.5rem] items-center justify-center rounded-full border border-black"
            aria-hidden
          >
            <span className="font-serif text-lg font-medium tracking-[0.2em]">
              TE
            </span>
          </div>

          <h2 className="mt-12 font-serif text-[1.65rem] font-medium leading-snug tracking-[-0.02em] text-foreground sm:text-3xl md:text-[2.125rem]">
            TheEdge brings composure to ambition — consulting that clarifies,
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
            Discover TheEdge
          </Link>
        </div>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────── */}
      <section className="border-t border-black/10 bg-white px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center font-sans text-[0.65rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Capabilities
          </p>
          <ul className="mt-14 grid gap-14 sm:grid-cols-3 sm:gap-0">
            {offerings.map((item) => (
              <li
                key={item.href}
                className="flex flex-col items-center text-center sm:items-start sm:border-l sm:border-black/10 sm:pl-10 sm:text-left sm:first:border-l-0 sm:first:pl-0"
              >
                <h3 className="font-serif text-xl font-medium tracking-tight text-foreground">
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
          <p className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Join us
          </p>
          <p className="mt-6 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            We are always interested in people who care about craft.
          </p>
          <Link
            href="/careers"
            className="mt-8 inline-block font-sans text-xs font-medium uppercase tracking-[0.22em] text-foreground underline-offset-[0.35rem] transition-opacity hover:opacity-60 hover:underline"
          >
            Careers at TheEdge
          </Link>
        </div>
      </section>
    </div>
  )
}
