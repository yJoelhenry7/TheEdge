"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, Heart, MapPin, Search } from "lucide-react"

import { sitePages } from "@/lib/site-pages"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
  {
    label: "Connect your platform with eConnect?",
    href: "/business/connect-your-platform",
  },
] as const

function navLinkClass(indent = false) {
  return cn(
    "block rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted",
    indent && "pl-4"
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
  const router = useRouter()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  const grouped = React.useMemo(() => {
    const map = new Map<string, typeof sitePages>()
    for (const p of sitePages) {
      const g = p.group ?? "General"
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(p)
    }
    return map
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white">
        <div className="mx-auto flex h-[3.25rem] max-w-[1400px] items-center px-5 sm:h-14 sm:px-8 lg:px-12">
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
                      {businessLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={navLinkClass(true)}
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
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
              className="relative block h-7 w-[6.5rem] shrink-0 sm:h-8 sm:w-[7.5rem]"
            >
              <Image
                src="/logo.png"
                alt="TheEdge"
                fill
                className="object-contain object-center"
                priority
                sizes="120px"
              />
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-none hover:bg-transparent hover:opacity-70"
              aria-label="Search pages"
              onClick={() => setSearchOpen(true)}
            >
              <Search {...iconProps} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-none hover:bg-transparent hover:opacity-70"
              aria-label="Locations"
              nativeButton={false}
              render={<Link href="/about#presence" />}
            >
              <MapPin {...iconProps} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-none hover:bg-transparent hover:opacity-70"
              aria-label="Saved"
              nativeButton={false}
              render={<Link href="/#discover" />}
            >
              <Heart {...iconProps} />
            </Button>
          </div>
        </div>
      </header>

      <CommandDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title="Search pages"
        description="Find a page on TheEdge"
        showCloseButton
      >
        <CommandInput placeholder="Search pages…" />
        <CommandList>
          <CommandEmpty>No pages found.</CommandEmpty>
          {[...grouped.entries()].map(([group, pages]) => (
            <CommandGroup key={group} heading={group}>
              {pages.map((page) => (
                <CommandItem
                  key={page.href}
                  value={`${page.title} ${page.keywords?.join(" ") ?? ""}`}
                  onSelect={() => {
                    setSearchOpen(false)
                    router.push(page.href)
                  }}
                >
                  {page.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
