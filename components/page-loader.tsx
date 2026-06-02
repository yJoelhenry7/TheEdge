"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type LoaderPhase = "playing" | "waiting" | "hidden"

function isInternalNavigation(href: string | null) {
  if (!href) return false
  if (
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false
  }

  if (href.startsWith("http")) {
    try {
      return new URL(href).origin === window.location.origin
    } catch {
      return false
    }
  }

  return href.startsWith("/")
}

function resolvePath(href: string) {
  if (href.startsWith("/")) {
    return href.split("#")[0] ?? href
  }

  const url = new URL(href)
  return `${url.pathname}${url.search}`
}

type LoaderOverlayProps = {
  phase: Exclude<LoaderPhase, "hidden">
  animKey: number
  onAnimationEnd?: () => void
}

function LoaderOverlay({ phase, animKey, onAnimationEnd }: LoaderOverlayProps) {
  return (
    <div
      key={phase === "playing" ? animKey : "waiting"}
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-background",
        phase === "playing" && "page-loader-overlay--playing"
      )}
      onAnimationEnd={onAnimationEnd}
      aria-busy="true"
      aria-label="Loading page"
      role="status"
    >
      <Image
        src="/logo.png"
        alt=""
        width={128}
        height={128}
        priority
        className={cn(
          "h-auto w-28 object-contain sm:w-32",
          phase === "playing" && "page-loader-logo--playing",
          phase === "waiting" && "page-loader-logo--waiting"
        )}
      />
    </div>
  )
}

export function PageLoader() {
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)
  const [phase, setPhase] = React.useState<LoaderPhase>("playing")
  const [animKey, setAnimKey] = React.useState(0)
  const isFirstPathname = React.useRef(true)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (phase === "hidden") return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [phase])

  React.useEffect(() => {
    if (isFirstPathname.current) {
      isFirstPathname.current = false
      return
    }

    setPhase("playing")
    setAnimKey((key) => key + 1)
  }, [pathname])

  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      const anchor = (event.target as Element).closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!isInternalNavigation(href)) return
      if (anchor.getAttribute("target") === "_blank") return

      const nextPath = resolvePath(href!)
      const currentPath = `${pathname}${window.location.search}`

      if (nextPath === currentPath || nextPath === pathname) return

      setPhase("waiting")
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [pathname])

  if (!mounted || phase === "hidden") return null

  return createPortal(
    <LoaderOverlay
      phase={phase}
      animKey={animKey}
      onAnimationEnd={
        phase === "playing" ? () => setPhase("hidden") : undefined
      }
    />,
    document.body
  )
}
