import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { KkrvName, KkrvSpacedText } from "@/components/kkrv-name"

export const metadata: Metadata = {
  title: "About",
}

const expertise = [
  {
    label: "Entrepreneurship",
    body:
      "From an early stage in his career, KKRV demonstrated a strong passion for business and entrepreneurship. His curiosity to learn, willingness to take on challenges, and ability to adapt to changing markets helped him build a remarkable reputation in the business community.",
  },
  {
    label: "Strategy & Operations",
    body:
      "As Founder of VVR Industries Limited, KKRV has played a vital role in building the company with a clear vision for growth and innovation. His leadership style focuses on quality, customer satisfaction, and sustainable business development — continuously exploring new opportunities and strengthening the company's position.",
  },
  {
    label: "Marketing & Brand",
    body:
      "As Marketing Director of VVR Industries, KKRV brings creativity and strategic insight into business marketing and brand development. His deep understanding of market trends, customer behaviour, and business communication allows him to create impactful strategies that combine traditional values with modern techniques.",
  },
  {
    label: "Multi-Industry Experience",
    body:
      "One of the most remarkable qualities of KKRV is his diverse experience across various industries and business sectors. His broad expertise enables him to understand complex business challenges — whether it is management, marketing, operations, or business development — and find innovative solutions.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">

      {/* ── Page header ───────────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <h1 className="max-w-2xl font-sans text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            VVR Industries Limited
          </h1>
          <p className="mt-8 max-w-xl font-sans text-base leading-[1.9] text-muted-foreground">
            Recognised the world over for its expertise and the quality of its
            products and service — certified for precision, performance and
            reliability. Symbols of excellence, elegance and prestige.
          </p>
        </div>
      </section>

      {/* ── Philosophy ────────────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-16 sm:grid-cols-[1fr_2fr]">
          <div className="pt-1">
            <p className="type-rolex-overline text-muted-foreground">Philosophy</p>
          </div>
          <div className="space-y-8">
            <h2 className="font-sans text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl">
              Perpetual excellence — more than a word, a way of being.
            </h2>
            <p className="font-sans text-[0.9375rem] leading-[1.9] text-muted-foreground">
              The world continuing forever — perpetual — is more than just a
              word; it is a philosophy that embodies the company&apos;s vision and
              values. <KkrvName />, the co-founder, instilled a notion of perpetual
              excellence that would drive the company forward, inspiring every
              decision and every product that bears the VVR name.
            </p>
            <p className="font-sans text-[0.9375rem] leading-[1.9] text-muted-foreground">
              VVR&apos;s reputation is rooted in a history driven by a passion for
              innovation and a constant quest for excellence — a succession of
              pioneering achievements encompassing articles making, industrial
              and human adventure.
            </p>
            <p className="font-sans text-[0.9375rem] leading-[1.9] text-muted-foreground">
              Today, <KkrvName />
              &apos;s personality and his work continue to inspire the company and
              permeate its corporate culture. The entrepreneur&apos;s influence is
              evident in the aesthetics and principal characteristics of the
              industry that remain faithful to the original brand — as well as in
              VVR&apos;s ability to draw on its heritage to continuously advance
              towards new horizons.
            </p>
          </div>
        </div>
      </section>

      {/* ── Founder profile ───────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="type-rolex-overline text-muted-foreground">Co-Founder</p>

          <div className="mt-12 grid gap-14 sm:grid-cols-[5fr_7fr] sm:gap-16">
            {/* Photo */}
            <div className="relative">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5">
                <Image
                  src="/founder.jpeg"
                  alt="KKRV — Co-Founder, VVR Industries Limited"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, 40vw"
                />
              </div>
              {/* Subtle caption bar */}
              <div className="mt-4 flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-foreground">
                  <KkrvName />
                </span>
                <span className="font-sans text-xs text-muted-foreground">
                  Co-Founder
                </span>
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center">
              <h2 className="font-sans text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
                <KkrvName />
              </h2>
              <p className="mt-2 font-sans text-sm uppercase tracking-[0.22em] text-muted-foreground">
                Founder · VVR Industries Limited
                <br />
                Marketing Director · VVR Industries
              </p>

              <p className="mt-8 font-sans text-[0.9375rem] leading-[1.9] text-muted-foreground">
                <KkrvSpacedText text="A visionary entrepreneur driving innovation and business excellence. KKRV is a dynamic business leader known for his dedication, strategic thinking, and extensive experience across multiple industries." />
              </p>
              <p className="mt-5 font-sans text-[0.9375rem] leading-[1.9] text-muted-foreground">
                <KkrvSpacedText text="The success of VVR is inextricably linked to the spirit of enterprise of its co-founder. Through his visionary genius and adeptness in all fields related to industrial development — technology, communication, organisation and distribution — KKRV set the course for an adventure which has given rise to exceptional articles and an unparalleled brand." />
              </p>
              <p className="mt-5 font-sans text-[0.9375rem] leading-[1.9] text-muted-foreground">
                His passion for business, belief in continuous learning, and
                unwavering commitment to excellence continue to inspire many
                aspiring business professionals and young entrepreneurs. He
                constantly seeks opportunities to innovate, expand, and
                contribute to the growth of businesses and industries.
              </p>

              <blockquote className="mt-10 border-l-2 border-black pl-5">
                <p className="font-sans text-lg font-medium leading-snug text-foreground">
                  &ldquo;Success comes through continuous learning, dedication,
                  and hard work.&rdquo;
                </p>
                <footer className="mt-3 font-sans text-xs text-muted-foreground">
                  — <KkrvName />
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── Areas of expertise ────────────────────────────────────── */}
      <section className="border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="type-rolex-overline text-muted-foreground">Expertise</p>
          <h2 className="mt-6 max-w-lg font-sans text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl">
            A leader across every dimension of business.
          </h2>
          <ul className="mt-14 grid gap-10 sm:grid-cols-2">
            {expertise.map((item) => (
              <li key={item.label} className="border-t border-black/10 pt-8">
                <h3 className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-foreground">
                  {item.label}
                </h3>
                <p className="mt-4 font-sans text-sm leading-[1.85] text-muted-foreground">
                  <KkrvSpacedText text={item.body} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Presence ──────────────────────────────────────────────── */}
      <section
        id="presence"
        className="scroll-mt-20 border-b border-black/10 px-6 py-20 sm:px-10 sm:py-28"
      >
        <div className="mx-auto grid max-w-5xl gap-16 sm:grid-cols-[1fr_2fr]">
          <p className="type-rolex-overline pt-1 text-muted-foreground">Presence</p>
          <div className="space-y-4 font-sans text-[0.9375rem] leading-[1.9] text-muted-foreground">
            <p>
              VVR Industries Limited operates across multiple markets with a
              global outlook and local precision. VVR Industries extends
              that reach through digital consulting and connected platform
              services.
            </p>
            <p className="text-foreground font-medium">
              India · International markets (expanding)
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-sans text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Ready to connect with VVR?
          </p>
          <p className="mt-6 font-sans text-sm leading-relaxed text-muted-foreground">
            Whether you are a business looking for consulting, a platform
            wanting to integrate with eConnect, or a professional seeking your
            next opportunity — we welcome the conversation.
          </p>
          <Link
            href="/careers"
            className="mt-10 inline-block font-sans text-xs font-medium uppercase tracking-[0.22em] text-foreground underline-offset-[0.35rem] transition-opacity hover:opacity-60 hover:underline"
          >
            Explore careers at VVR
          </Link>
        </div>
      </section>
    </div>
  )
}
