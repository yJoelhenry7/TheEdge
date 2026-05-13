"use client"

import * as React from "react"
import dynamic from "next/dynamic"

export type LocationId = "delhi" | "ravulapalem"

export const LOCATIONS = [
  {
    id: "delhi" as LocationId,
    label: "Delhi",
    sub: "National Capital Territory",
    lat: 28.6139,
    lon: 77.209,
    description: "VVR Industries — North India headquarters.",
  },
  {
    id: "ravulapalem" as LocationId,
    label: "Ravulapalem",
    sub: "Andhra Pradesh",
    lat: 16.7553,
    lon: 81.841,
    description: "VVR Industries — South India operations.",
  },
] as const

/* ------------------------------------------------------------------
   Inner map rendered only on the client (no SSR — Leaflet needs window)
   ------------------------------------------------------------------ */
const LeafletInner = dynamic(() => import("./locations-leaflet-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[420px] items-center justify-center bg-neutral-100 text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
})

export function LocationsListPanel({
  selectedId,
  onSelect,
  className,
}: {
  selectedId: LocationId | null
  onSelect: (id: LocationId) => void
  className?: string
}) {
  return (
    <ul className={`flex flex-col gap-0 border border-black/10 ${className ?? ""}`}>
      {LOCATIONS.map((loc) => {
        const active = selectedId === loc.id
        return (
          <li key={loc.id} className="border-b border-black/10 last:border-b-0">
            <button
              type="button"
              onClick={() => onSelect(loc.id)}
              className={[
                "flex w-full flex-col items-start gap-1 px-5 py-5 text-left transition-colors",
                active ? "bg-foreground text-background" : "bg-white hover:bg-muted/60",
              ].join(" ")}
            >
              <span className="font-sans text-base font-medium tracking-tight">
                {loc.label}
              </span>
              <span
                className={`font-sans text-sm ${active ? "text-white/80" : "text-muted-foreground"}`}
              >
                {loc.sub}
              </span>
              <span
                className={`mt-1 font-sans text-xs ${active ? "text-white/60" : "text-muted-foreground/70"}`}
              >
                {loc.description}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export function LocationsMapSection({ className }: { className?: string }) {
  const [selectedId, setSelectedId] = React.useState<LocationId | null>("delhi")

  return (
    <div
      className={[
        "grid flex-1 gap-0 lg:grid-cols-[minmax(260px,360px)_1fr] lg:items-stretch",
        className ?? "",
      ].join(" ")}
    >
      <LocationsListPanel selectedId={selectedId} onSelect={setSelectedId} />
      <div className="relative border-t border-black/10 lg:border-l lg:border-t-0">
        <LeafletInner selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  )
}
