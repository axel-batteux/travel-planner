'use client'

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix missing leaf icons (handled via customIcon)
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl


// Custom Icon for stages
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
})

// Component to auto-fit map bounds
function AdjustBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap()
  
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions)
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 })
    }
  }, [map, positions])

  return null
}

const defaultCenter: [number, number] = [48.8566, 2.3522] // Paris par défaut

// Composant Map
export default function ItineraryMap({
  stages = []
}: {
  stages: any[]
}) {
  // Extract simple lat/lng logic. For a real app, you'd need geolocation.
  // For now, we'll assign random spread out positions just to demonstrate, or check if location_name is something we can roughly geocode?
  // We can just hardcode a set of coordinates or use a simple hack if no coordinates are stored (since DB just has location_name text).
  // Ideally, the user should provide coordinates. Since we don't have them, we will try to place them neatly or fall back.
  
  // Here we'll simulate coordinates if they don't exist, just so the map works visually.
  // We'll generate deterministic pseudo-random coordinates based on the title string to show points on the map.
  
  const getCoordinatesForStage = (stage: any, index: number): [number, number] => {
    // Si on a l'intention d'ajouter des coordonnées en DB plus tard, 
    // pour l'instant on fait un petit offset depuis Paris pour illustrer The Map!
    let hash = 0;
    const str = stage.title + stage.location_name;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    
    // Create some variation to spread pins around the world roughly based on hash
    const lat = 20 + (hash % 40)
    const lng = (hash % 100) * 1.5 - 50
    return [lat, lng]
  }

  const positions: [number, number][] = stages.map((stage, i) => getCoordinatesForStage(stage, i))

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-border/50 shadow-sm relative z-0">
      <MapContainer 
        center={positions.length > 0 ? positions[0] : defaultCenter} 
        zoom={3} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <AdjustBounds positions={positions} />
        
        {stages.map((stage, i) => (
          <Marker key={stage.id} position={positions[i]} icon={customIcon}>
            <Popup>
              <div className="font-sans">
                <p className="font-bold mb-1">{stage.title}</p>
                <p className="text-sm opacity-80">{stage.type}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {positions.length > 1 && (
          <Polyline 
            positions={positions} 
            color="#ec4899" 
            weight={3} 
            dashArray="5, 10" 
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  )
}
