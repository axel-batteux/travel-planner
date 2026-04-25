'use client'

import React, { useEffect, useState } from 'react'
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
  const [positions, setPositions] = useState<[number, number][]>([])

  useEffect(() => {
    let isMounted = true;
    
    const geocodeStages = async () => {
      const newPositions: [number, number][] = []
      
      for (const stage of stages) {
        let coords: [number, number] | null = null
        
        // On essaie d'abord avec le nom exact
        const queries = [
          stage.location_name || stage.title,
          // Fallback : on coupe au premier tiret ou au mot clé pour "Nantes Madrid" -> "Nantes"
          (stage.location_name || stage.title).replace(/^(Vol|Train|Trajet|Bus)\s+/i, '').split(/[\s-]/)[0]
        ]
        
        for (const query of queries) {
          if (!query || query.length < 2) continue
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
            const data = await res.json()
            if (data && data.length > 0) {
              coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
              break
            }
          } catch (e) {
            console.error("Geocoding failed for", query)
          }
          // Respecter la limite de Nominatim (1 requête/seconde)
          await new Promise(r => setTimeout(r, 1000))
        }
        
        newPositions.push(coords || defaultCenter)
      }
      
      if (isMounted) {
        setPositions(newPositions)
      }
    }

    if (stages.length > 0) {
      geocodeStages()
    } else {
      setPositions([])
    }
    
    return () => { isMounted = false }
  }, [stages])

  if (stages.length > 0 && positions.length === 0) {
     // Loading state for geocoding
     return <div className="w-full h-full rounded-2xl border border-border/50 bg-muted flex items-center justify-center text-muted-foreground animate-pulse">Cartographie en cours...</div>
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-border/50 shadow-sm relative z-0">
      <MapContainer 
        center={positions.length > 0 ? positions[0] : defaultCenter} 
        zoom={5} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <AdjustBounds positions={positions} />
        
        {stages.map((stage, i) => (
          positions[i] && (
            <Marker key={stage.id} position={positions[i]} icon={customIcon}>
              <Popup>
                <div className="font-sans">
                  <p className="font-bold mb-1">{stage.title}</p>
                  <p className="text-sm opacity-80">{stage.type}</p>
                </div>
              </Popup>
            </Marker>
          )
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
