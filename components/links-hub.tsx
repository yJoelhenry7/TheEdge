"use client"

import Image from "next/image"
import Link from "next/link"
import type { ComponentType, ReactNode } from "react"
import {
  Briefcase,
  Handshake,
  Headphones,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react"

import { LinksSpaceBg } from "@/components/links-space-bg"
import { cn } from "@/lib/utils"

const WHATSAPP_HREF = "https://wa.me/message/GNHWVOWXXKHOE1"

const marketplace = [
  {
    label: "Buyer",
    href: "/business/connect-your-platform?party=buyer",
    description: "Connect & procure",
    icon: ShoppingBag,
  },
  {
    label: "Seller",
    href: "/business/connect-your-platform?party=seller",
    description: "List your platform",
    icon: Store,
  },
] as const

const careers = [
  {
    label: "Freelancers",
    href: "/careers?track=freelancer",
    description: "Project-based",
    icon: Briefcase,
  },
  {
    label: "Volunteers",
    href: "/careers?track=volunteer",
    description: "Contribute",
    icon: Handshake,
  },
  {
    label: "Full-time",
    href: "/careers?track=employment",
    description: "Permanent",
    icon: Users,
  },
] as const

const edgeSolutions = [
  { label: "Overview", href: "/business/the-edge-solutions" },
  { label: "eConsulting", href: "/business/e-consulting" },
  { label: "eConnect", href: "/business/e-connect" },
  { label: "eMedia Works", href: "/business/e-media-works" },
  { label: "eInvestors", href: "/business/e-investors" },
  { label: "eMarketing Services", href: "/business/e-marketing-services" },
  { label: "Edge Entertainments", href: "/business/edge-entertainments" },
  { label: "Blog", href: "/business/blog" },
] as const

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/theedgesolutionss?igsh=MWIwZXc1cnNjemVicg%3D%3D&utm_source=qr",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@vvrtheedge?si=7QeteMngWxCSzVxo",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/vvrtheedge?s=11",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_HREF,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
] as const

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <p className="type-rolex-overline text-white/55">{children}</p>
  )
}

function Stagger({
  children,
  delayMs,
  className,
}: {
  children: ReactNode
  delayMs: number
  className?: string
}) {
  return (
    <div
      className={cn("links-animate-in", className)}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}

function IconTile({
  href,
  label,
  description,
  icon: Icon,
  external,
  className,
}: {
  href: string
  label: string
  description?: string
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  external?: boolean
  className?: string
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "links-tile group flex min-w-0 flex-col items-center gap-2 border px-2 py-4 text-center sm:gap-2.5 sm:px-3 sm:py-5",
        className
      )}
    >
      <span className="links-icon-badge flex size-10 shrink-0 items-center justify-center rounded-full sm:size-12">
        <Icon className="size-4 sm:size-[1.15rem]" strokeWidth={1.15} />
      </span>
      <span className="min-w-0 w-full">
        <span className="block font-sans text-[0.8125rem] font-medium leading-snug tracking-normal text-white sm:text-sm">
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block font-sans text-[0.625rem] leading-snug tracking-normal text-white/55 sm:text-[0.6875rem]">
            {description}
          </span>
        ) : null}
      </span>
    </Link>
  )
}

export function LinksHub() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col text-white">
      <LinksSpaceBg />

      {/* PDF-style composition: links left, portrait right (stacked on small phones) */}
      <section className="relative z-10">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 sm:grid-cols-[minmax(0,1.05fr)_minmax(220px,0.95fr)]">
          {/* LEFT — all link panels stacked as in the PDF */}
          <div className="flex min-w-0 flex-col border-white/10 px-4 py-8 sm:border-r sm:px-8 sm:py-12 lg:px-10 lg:py-14">
            <div className="links-intro">
              <div
                className="links-classic-line relative h-20 w-[7.5rem] sm:h-28 sm:w-[10.5rem]"
                style={{ animationDelay: "80ms" }}
              >
                <Image
                  src="/logo.png"
                  alt="VVR"
                  fill
                  className="links-logo-light object-contain object-left"
                  priority
                  sizes="(max-width: 640px) 120px, 168px"
                />
              </div>
              <p
                className="links-classic-overline type-rolex-overline mt-7 text-white/55"
                style={{ animationDelay: "280ms" }}
              >
                Precision for a connected world.
              </p>
              <h1
                className="links-classic-line mt-4 font-sans text-2xl font-medium tracking-tight text-white sm:text-4xl"
                style={{ animationDelay: "520ms" }}
              >
                The Man Behind VVR!
              </h1>
              <p
                className="links-classic-line mt-5 font-sans text-sm tracking-normal text-white/60 sm:text-base"
                style={{ animationDelay: "760ms" }}
              >
                Meet,
              </p>
              <p
                className="links-classic-line mt-1 font-sans text-xl font-medium tracking-tight text-white sm:text-2xl"
                style={{ animationDelay: "980ms" }}
              >
                K K Ravi Vara
              </p>
              <p
                className="links-classic-line mt-4 font-sans text-[0.625rem] font-normal uppercase tracking-[0.28em] text-white/55"
                style={{ animationDelay: "1100ms" }}
              >
                Marketing Director
              </p>
              <p
                className="links-classic-line mt-2 font-sans text-[0.625rem] font-normal uppercase tracking-[0.28em] text-white/55"
                style={{ animationDelay: "1220ms" }}
              >
                V V R I Limited.
              </p>
              <span
                className="links-classic-rule mt-6 text-white/70"
                style={{ animationDelay: "1360ms" }}
                aria-hidden
              />
            </div>

            {/* Portrait on mobile — sits under intro, not squeezing the buttons */}
            <Stagger delayMs={1300} className="mt-8 sm:hidden">
              <div className="links-animate-portrait relative mx-auto h-[280px] w-full max-w-[200px]">
                <Image
                  src="/ravi_image.png"
                  alt="The Edge — VVR Industries"
                  fill
                  className="object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
                  priority
                  sizes="200px"
                />
              </div>
            </Stagger>

            <Stagger delayMs={1400} className="mt-8 sm:mt-10">
              <SectionHeading>Buyer &amp; Seller</SectionHeading>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                {marketplace.map((item) => (
                  <IconTile key={item.href} {...item} />
                ))}
              </div>
            </Stagger>

            <Stagger delayMs={1550} className="mt-8 sm:mt-10">
              <SectionHeading>24/7 Support Team</SectionHeading>
              <div className="mt-4">
                <IconTile
                  href={WHATSAPP_HREF}
                  label="WhatsApp Business"
                  description="Message us any time"
                  icon={Headphones}
                  external
                />
              </div>
            </Stagger>

            <Stagger delayMs={1700} className="mt-8 sm:mt-10">
              <SectionHeading>Careers</SectionHeading>
              <div className="mt-4 grid grid-cols-1 gap-2 min-[400px]:grid-cols-3 sm:gap-3">
                {careers.map((item) => (
                  <IconTile key={item.href} {...item} />
                ))}
              </div>
            </Stagger>

            <Stagger delayMs={1850} className="mt-8 sm:mt-10">
              <SectionHeading>Edge Solutions</SectionHeading>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {edgeSolutions.map((item) => (
                  <li key={item.href} className="min-w-0">
                    <Link
                      href={item.href}
                      className="links-tile group flex min-w-0 items-center justify-between gap-3 border px-3 py-2.5 font-sans text-xs leading-snug tracking-normal text-white sm:px-3.5 sm:py-3 sm:text-sm"
                    >
                      <span className="min-w-0 flex-1 break-words">{item.label}</span>
                      <span
                        aria-hidden
                        className="shrink-0 text-white/45 transition-transform duration-300 group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Stagger>

            <Stagger delayMs={2000} className="mt-8 sm:mt-10">
              <SectionHeading>Watch Us On</SectionHeading>
              <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
                {socialLinks.map((item) => (
                  <li key={item.label} className="min-w-0">
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="links-tile group flex min-w-0 flex-col items-center gap-2 border px-2 py-3.5 sm:py-4"
                    >
                      <span className="links-icon-badge flex size-10 shrink-0 items-center justify-center rounded-full sm:size-11">
                        {item.icon}
                      </span>
                      <span className="w-full truncate text-center font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-white sm:tracking-[0.12em]">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Stagger>
          </div>

          {/* RIGHT — portrait stays vertically centered + sticky while links scroll */}
          <aside className="relative hidden self-stretch sm:block">
            <div className="sticky top-0 z-20 flex h-dvh w-full items-center justify-center self-start px-3 lg:px-6">
              <div className="links-animate-portrait relative h-[min(78dvh,640px)] w-full max-w-[420px] will-change-auto">
                <Image
                  src="/ravi_image.png"
                  alt="The Edge — VVR Industries"
                  fill
                  className="object-contain object-center drop-shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
                  priority
                  sizes="(max-width: 1024px) 40vw, 420px"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
