import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "The Edge Solutions",
  description:
    "The Edge is VVR's integrated suite of business capabilities — eConsulting, eConnect, eMedia Works, eInvestors, and eMarketing Services — each designed to operate independently or together.",
  alternates: { canonical: "https://vvrindustries.com/business/the-edge-solutions" },
  openGraph: {
    title: "The Edge Solutions — VVR Industries",
    description:
      "Consulting, connectivity, media, investor relations, and marketing — The Edge solutions from VVR Industries.",
    url: "https://vvrindustries.com/business/the-edge-solutions",
  },
}

const offerings = [
  { label: "eConsulting", href: "/business/e-consulting" },
  { label: "eConnect", href: "/business/e-connect" },
  { label: "eMedia Works", href: "/business/e-media-works" },
  { label: "eInvestors", href: "/business/e-investors" },
  { label: "eMarketing Services", href: "/business/e-marketing-services" },
  {
    label: "Connect your bussiness with ePlatform?",
    href: "/business/connect-your-platform",
  },
] as const

export default function TheEdgeSolutionsPage() {
  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-16">
      <p className="type-rolex-overline text-muted-foreground">Business</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        The Edge solutions
      </h1>
      <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
        The Edge solutions is the umbrella for VVR&apos;s consulting, connectivity,
        media, investor relations, and marketing capabilities — each offered as a
        focused line of business you can engage on its own or in combination.
      </p>
      <nav className="mt-10 border-t border-black/10 pt-8">
        <p className="type-rolex-overline text-muted-foreground">Lines of business</p>
        <ul className="mt-4 space-y-1">
          {offerings.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-md py-2.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
