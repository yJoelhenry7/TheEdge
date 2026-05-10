import Image from "next/image"
import Link from "next/link"

/** Full-bleed hero; swap for your own `/public/hero.jpg` when ready. */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=85&w=2400"

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
      <section className="relative min-h-[min(92svh,56rem)] w-full">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-black/45"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/55" />

        <div className="relative flex min-h-[min(92svh,56rem)] flex-col items-center justify-center px-6 pb-16 pt-10 text-center sm:px-10">
          <p className="max-w-lg font-sans text-[0.65rem] font-normal uppercase leading-relaxed tracking-[0.38em] text-white sm:text-xs">
            Where the next chapter begins
          </p>
          <h1 className="mt-7 max-w-4xl font-serif text-[2.125rem] font-medium leading-[1.12] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl lg:text-[3.5rem]">
            Precision for a connected world
          </h1>
        </div>
      </section>

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
            workshop ends. This is placeholder copy — shape it to your voice,
            proof points, and markets.
          </p>

          <Link
            href="/about"
            className="mt-12 font-sans text-xs font-medium uppercase tracking-[0.22em] text-foreground underline-offset-[0.35rem] transition-opacity hover:opacity-60 hover:underline"
          >
            Discover TheEdge
          </Link>
        </div>
      </section>

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
