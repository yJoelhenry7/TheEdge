"use client"

import { usePathname } from "next/navigation"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { WhatsAppFab } from "@/components/whatsapp-fab"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLinksPage = pathname === "/links" || pathname.startsWith("/links/")

  if (isLinksPage) {
    return (
      <main className="site-content flex min-h-full flex-1 flex-col bg-[#03050c]">
        {children}
      </main>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="site-content flex flex-1 flex-col">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  )
}
