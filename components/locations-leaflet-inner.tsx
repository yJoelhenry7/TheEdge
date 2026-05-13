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

/* Custom red marker icon */
function redIcon() {
  return L.divIcon({
    className: "",
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path
          d="M12 0C5.372 0 0 5.372 0 12c0 8.4 12 24 12 24s12-15.6 12-24C24 5.372 18.628 0 12 0z"
          fill="#dc2626"
          stroke="#fff"
          stroke-width="1.5"
        />
        <circle cx="12" cy="12" r="4.5" fill="#fff" />
      </svg>`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -38],
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
  const icon = React.useMemo(() => redIcon(), [])

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
