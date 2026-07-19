"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const businessLinks = [
  { label: "eConsulting", href: "/business/e-consulting" },
  { label: "eConnect", href: "/business/e-connect" },
  { label: "eMedia Works", href: "/business/e-media-works" },
  { label: "eInvestors", href: "/business/e-investors" },
  { label: "eMarketing Services", href: "/business/e-marketing-services" },
  {
    label: "Connect your bussiness with ePlatform?",
    href: "/business/connect-your-platform",
  },
  { label: "Blog", href: "/business/blog" },
] as const

function navLinkClass(depth: 0 | 1 | 2 = 0) {
  return cn(
    "block rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted",
    depth === 1 && "pl-4",
    depth === 2 && "pl-7"
  )
}

function ThinMenuGlyph({ className }: { className?: string }) {
  return (
    <span
      className={cn("flex w-[1.125rem] flex-col justify-center gap-[5px]", className)}
      aria-hidden
    >
      <span className="h-px w-full bg-foreground" />
      <span className="h-px w-full bg-foreground" />
    </span>
  )
}

const iconProps = {
  strokeWidth: 1,
  className: "size-[1.15rem] text-foreground",
} as const

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white">
      <div className="mx-auto flex h-[3.5rem] max-w-[1400px] items-center px-5 sm:h-16 sm:px-8 lg:px-12">
        <div className="flex min-w-0 flex-1 justify-start">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              className={cn(
                "inline-flex size-10 shrink-0 items-center justify-center rounded-none border-0 bg-transparent text-foreground outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              )}
              aria-label="Open menu"
            >
              <ThinMenuGlyph />
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(100%,20rem)] gap-0">
              <SheetHeader className="border-b border-black/10 px-4 py-4 text-left">
                <SheetTitle className="font-sans text-sm font-medium tracking-wide">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                <Link
                  href="/about"
                  className={navLinkClass()}
                  onClick={() => setMenuOpen(false)}
                >
                  About
                </Link>

                <Link
                  href="/locations"
                  className={navLinkClass()}
                  onClick={() => setMenuOpen(false)}
                >
                  Locations
                </Link>

                <Collapsible className="space-y-1">
                  <CollapsibleTrigger
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm font-medium hover:bg-muted",
                      "[&[data-panel-open]_svg]:rotate-180"
                    )}
                  >
                    Business
                    <ChevronDown className="size-4 shrink-0 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col gap-1">
                    <Collapsible className="space-y-1" defaultOpen>
                      <CollapsibleTrigger
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm font-medium hover:bg-muted",
                          "pl-4",
                          "[&[data-panel-open]_svg]:rotate-180"
                        )}
                      >
                        The Edge solutions
                        <ChevronDown className="size-4 shrink-0 transition-transform" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="flex flex-col gap-1">
                        <Link
                          href="/business/the-edge-solutions"
                          className={navLinkClass(2)}
                          onClick={() => setMenuOpen(false)}
                        >
                          Overview
                        </Link>
                        {businessLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={navLinkClass(2)}
                            onClick={() => setMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="my-2 bg-black/15" />

                <Link
                  href="/careers"
                  className={navLinkClass()}
                  onClick={() => setMenuOpen(false)}
                >
                  Careers
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 justify-center px-2">
          <Link
            href="/"
            className="relative block h-10 w-[9rem] shrink-0 sm:h-12 sm:w-[10.5rem]"
          >
            <Image
              src="/logo.png"
              alt="VVR"
              fill
              className="object-contain object-center"
              priority
              sizes="(max-width: 640px) 144px, 168px"
            />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-1">
          {/* Connect with team — WhatsApp */}
          <Link
            href="https://wa.me/message/GNHWVOWXXKHOE1"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-9 rounded-none hover:bg-transparent hover:opacity-70"
            )}
            aria-label="Connect with team on WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-[1.15rem] text-foreground">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </Link>

          <Link
            href="/locations"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-9 rounded-none hover:bg-transparent hover:opacity-70"
            )}
            aria-label="Locations"
          >
            <MapPin {...iconProps} />
          </Link>
        </div>
      </div>
    </header>
  )
}
