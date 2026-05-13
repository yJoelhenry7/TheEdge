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
    label: "Connect your platform with eConnect?",
    href: "/business/connect-your-platform",
  },
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

        <div className="flex flex-1 items-center justify-end">
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
