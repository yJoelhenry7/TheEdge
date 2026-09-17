import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Links",
  description:
    "All The Edge and VVR Industries links in one place — business lines, social channels, careers, and ways to connect.",
  alternates: { canonical: "https://vvrindustries.com/links" },
  openGraph: {
    title: "Links — The Edge · VVR Industries",
    description:
      "Explore The Edge solutions, social channels, and contact options from VVR Industries.",
    url: "https://vvrindustries.com/links",
  },
}

type LinkItem = {
  label: string
  href: string
  description?: string
  external?: boolean
}

type LinkGroup = {
  title: string
  items: LinkItem[]
}

const linkGroups: LinkGroup[] = [
  {
    title: "The Edge",
    items: [
      {
        label: "The Edge Solutions",
        href: "/business/the-edge-solutions",
        description: "Overview of the full suite",
      },
      {
        label: "eConsulting",
        href: "/business/e-consulting",
        description: "Digital strategy & consulting",
      },
      {
        label: "eConnect",
        href: "/business/e-connect",
        description: "Platform connectivity",
      },
      {
        label: "eMedia Works",
        href: "/business/e-media-works",
        description: "Content & creative production",
      },
      {
        label: "eInvestors",
        href: "/business/e-investors",
        description: "Investor relations",
      },
      {
        label: "eMarketing Services",
        href: "/business/e-marketing-services",
        description: "Brand & growth campaigns",
      },
      {
        label: "Edge Entertainments",
        href: "/business/edge-entertainments",
        description: "Entertainment & productions",
      },
      {
        label: "Blog",
        href: "/business/blog",
        description: "Insights & perspectives",
      },
    ],
  },
  {
    title: "Company",
    items: [
      {
        label: "About",
        href: "/about",
        description: "VVR Industries & co-founders",
      },
      {
        label: "Locations",
        href: "/locations",
        description: "Offices & presence",
      },
      {
        label: "Careers",
        href: "/careers",
        description: "Join the team",
      },
      {
        label: "Connect your business",
        href: "/business/connect-your-platform",
        description: "Integrate with ePlatform",
      },
    ],
  },
  {
    title: "Social",
    items: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/theedgesolutionss?igsh=MWIwZXc1cnNjemVicg%3D%3D&utm_source=qr",
        description: "@theedgesolutionss",
        external: true,
      },
      {
        label: "YouTube",
        href: "https://youtube.com/@vvrtheedge?si=7QeteMngWxCSzVxo",
        description: "@vvrtheedge",
        external: true,
      },
      {
        label: "X",
        href: "https://x.com/vvrtheedge?s=11",
        description: "@vvrtheedge",
        external: true,
      },
      {
        label: "WhatsApp",
        href: "https://wa.me/message/GNHWVOWXXKHOE1",
        description: "Message the team",
        external: true,
      },
    ],
  },
  {
    title: "Contact",
    items: [
      {
        label: "Call",
        href: "tel:9182891252",
        description: "+91 82891 252",
        external: true,
      },
      {
        label: "Email",
        href: "mailto:info@vvrindustries.com",
        description: "info@vvrindustries.com",
        external: true,
      },
    ],
  },
]

function LinkRow({ item }: { item: LinkItem }) {
  return (
    <Link
      href={item.href}
      {...(item.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="group flex items-center justify-between gap-4 border-b border-black/10 py-5 transition-opacity hover:opacity-70"
    >
      <span className="min-w-0">
        <span className="block font-sans text-sm font-medium text-foreground">
          {item.label}
        </span>
        {item.description ? (
          <span className="mt-1 block font-sans text-xs text-muted-foreground">
            {item.description}
          </span>
        ) : null}
      </span>
      <ArrowUpRight
        strokeWidth={1}
        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  )
}

export default function LinksPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <section className="border-b border-black/10 px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-xl text-center">
          <div className="relative mx-auto h-14 w-[10rem] sm:h-16 sm:w-[11.5rem]">
            <Image
              src="/logo.png"
              alt="VVR"
              fill
              className="object-contain object-center"
              priority
              sizes="184px"
            />
          </div>
          <p className="type-rolex-overline mt-10 text-muted-foreground">
            The Edge
          </p>
          <h1 className="mt-4 font-sans text-3xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Links
          </h1>
          <p className="mt-5 font-sans text-sm leading-relaxed text-muted-foreground">
            Business lines, social channels, and ways to reach VVR Industries —
            all in one place.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto flex max-w-xl flex-col gap-14">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <p className="type-rolex-overline text-muted-foreground">
                {group.title}
              </p>
              <ul className="mt-2 border-t border-black/10">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <LinkRow item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
