"use client"

import dynamic from "next/dynamic"

const EarthScene = dynamic(() => import("@/components/earth-scene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
})

export function EarthHero() {
  return <EarthScene />
}
