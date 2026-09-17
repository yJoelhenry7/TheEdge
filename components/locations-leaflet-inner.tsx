"use client"

import * as React from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"

import { LOCATIONS, type LocationId } from "./locations-leaflet-map"

/* Fix Leaflet's broken default icon paths when bundled by webpack/turbopack */
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

/* VVR lion logo pin — white circle + tip, logo centered inside */
function logoPinIcon() {
  return L.divIcon({
    className: "leaflet-vvr-logo-pin",
    html: `
      <div class="leaflet-vvr-logo-pin__wrap">
        <svg
          class="leaflet-vvr-logo-pin__shape"
          width="52"
          height="64"
          viewBox="0 0 52 64"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          aria-hidden="true"
        >
          <circle cx="26" cy="24" r="22" fill="#ffffff"/>
          <path d="M26 60 L16 42 L36 42 Z" fill="#ffffff"/>
          <image
            href="/logo.png"
            xlink:href="/logo.png"
            x="9"
            y="7"
            width="34"
            height="34"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>`,
    iconSize: [52, 64],
    iconAnchor: [26, 60],
    popupAnchor: [0, -58],
  })
}

/* Helper component: flies to the selected location */
function FlyToSelected({ selectedId }: { selectedId: LocationId | null }) {
  const map = useMap()

  React.useEffect(() => {
    if (!selectedId) return
    const loc = LOCATIONS.find((l) => l.id === selectedId)
    if (!loc) return
    map.flyTo([loc.lat, loc.lon], 10, { duration: 1.4 })
  }, [selectedId, map])

  return null
}

export default function LocationsLeafletInner({
  selectedId,
  onSelect,
}: {
  selectedId: LocationId | null
  onSelect: (id: LocationId) => void
}) {
  const icon = React.useMemo(() => logoPinIcon(), [])

  /* Centre on India */
  const centre: [number, number] = [20.5937, 78.9629]

  return (
    <MapContainer
      center={centre}
      zoom={5}
      scrollWheelZoom={false}
      className="h-full min-h-[420px] w-full"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToSelected selectedId={selectedId} />

      {LOCATIONS.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lon]}
          icon={icon}
          eventHandlers={{
            click: () => onSelect(loc.id),
          }}
        >
          <Popup>
            <div className="font-sans">
              <p className="font-semibold">{loc.label}</p>
              <p className="text-xs text-gray-500">{loc.sub}</p>
              <p className="mt-1 text-xs">{loc.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
