"use client"

import * as React from "react"

import { INDIA_MAP_BOUNDS, INDIA_OUTLINE_LON_LAT } from "@/lib/india-outline-lonlat"
import { cn } from "@/lib/utils"

const W = 360
const H = 400

export type LocationId = "delhi" | "ravulapalem"

export const LOCATIONS: ReadonlyArray<{
  id: LocationId
  label: string
  sub: string
  lon: number
  lat: number
}> = [
  {
    id: "delhi",
    label: "Delhi",
    sub: "National Capital Territory",
    lon: 77.209,
    lat: 28.6139,
  },
  {
    id: "ravulapalem",
    label: "Ravulapalem",
    sub: "Andhra Pradesh",
    lon: 81.841,
    lat: 16.7553,
  },
]

function toXY(lon: number, lat: number) {
  const { minLon, maxLon, minLat, maxLat } = INDIA_MAP_BOUNDS
  const x = ((lon - minLon) / (maxLon - minLon)) * W
  const y = ((maxLat - lat) / (maxLat - minLat)) * H
  return { x, y }
}

function buildPathD() {
  const pts = INDIA_OUTLINE_LON_LAT.map(([lon, lat]) => toXY(lon, lat))
  if (pts.length === 0) return ""
  const first = pts[0]!
  let d = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i]!
    d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`
  }
  d += " Z"
  return d
}

const outlineD = buildPathD()

export function IndiaLocationsMap({
  selectedId,
  onSelect,
  className,
}: {
  selectedId: LocationId | null
  onSelect: (id: LocationId) => void
  className?: string
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full max-h-[min(70vh,520px)] border border-black/15 bg-muted/30"
        role="img"
        aria-label="Map of India with office locations"
      >
        <title>India — Delhi and Ravulapalem</title>
        <path
          d={outlineD}
          strokeWidth={1.2}
          vectorEffect="non-scaling-stroke"
          className="fill-neutral-200 stroke-foreground"
        />
        {LOCATIONS.map((loc) => {
          const { x, y } = toXY(loc.lon, loc.lat)
          const active = selectedId === loc.id
          return (
            <g key={loc.id}>
              <circle
                cx={x}
                cy={y}
                r={active ? 14 : 10}
                fill="none"
                stroke="#b91c1c"
                strokeWidth={active ? 3 : 2}
                className="pointer-events-none transition-all duration-300"
                opacity={active ? 1 : 0.35}
              />
              <circle
                cx={x}
                cy={y}
                r={5}
                fill="#dc2626"
                stroke="#fff"
                strokeWidth={1.5}
                className="pointer-events-auto cursor-pointer"
                onClick={() => onSelect(loc.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onSelect(loc.id)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${loc.label}, ${loc.sub}`}
              />
            </g>
          )
        })}
      </svg>
      <p className="type-rolex-overline mt-4 text-muted-foreground">
        Tap a marker to highlight the location in the list.
      </p>
    </div>
  )
}

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
    <ul className={cn("flex flex-col gap-0 border border-black/10", className)}>
      {LOCATIONS.map((loc) => {
        const active = selectedId === loc.id
        return (
          <li key={loc.id} className="border-b border-black/10 last:border-b-0">
            <button
              type="button"
              onClick={() => onSelect(loc.id)}
              className={cn(
                "flex w-full flex-col items-start gap-1 px-5 py-5 text-left transition-colors",
                active ? "bg-foreground text-background" : "bg-white hover:bg-muted/60"
              )}
            >
              <span className="font-sans text-base font-medium tracking-tight">{loc.label}</span>
              <span
                className={cn(
                  "font-sans text-sm",
                  active ? "text-white/80" : "text-muted-foreground"
                )}
              >
                {loc.sub}
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
      className={cn(
        "grid flex-1 gap-0 lg:grid-cols-[minmax(260px,360px)_1fr] lg:items-stretch",
        className
      )}
    >
      <LocationsListPanel selectedId={selectedId} onSelect={setSelectedId} />
      <div className="border-t border-black/10 p-6 sm:p-10 lg:border-l lg:border-t-0">
        <IndiaLocationsMap selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  )
}
