import type { Metadata } from "next"

import { LocationsMapSection } from "@/components/locations-leaflet-map"

export const metadata: Metadata = {
  title: "Locations",
  description: "VVR Industries — offices in Delhi and Ravulapalem, Andhra Pradesh.",
}

export default function LocationsPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <section className="border-b border-black/10 px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="type-rolex-overline text-muted-foreground">Presence</p>
          <h1 className="mt-4 font-sans text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Locations
          </h1>
          <p className="mt-6 max-w-xl font-sans text-base leading-[1.9] text-muted-foreground">
            Our footprint spans the National Capital and coastal Andhra Pradesh — two
            anchors for delivery, partnerships, and growth across India.
          </p>
        </div>
      </section>

      <LocationsMapSection className="min-h-[min(70vh,560px)]" />
    </div>
  )
}
