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
  const [markers, setMarkers] = useState<{id: string, coords: [number, number], title: string, type: string}[]>([])

  useEffect(() => {
    let isMounted = true;
    
    const geocodeStages = async () => {
      const newMarkers: {id: string, coords: [number, number], title: string, type: string}[] = []
      
      for (const stage of stages) {
        const text = stage.location_name || stage.title || ''
        const cleaned = text.replace(/^(Vol|Train|Trajet|Bus|Avion)\s+/i, '').trim()
        
        let places = [cleaned]
        
        // Détecter si c'est un trajet (2 villes)
        if (cleaned.includes('-')) {
            places = cleaned.split('-').map((p: string) => p.trim())
        } else if (cleaned.toLowerCase().includes(' a ')) {
            places = cleaned.split(/ a /i).map((p: string) => p.trim())
        } else if (cleaned.toLowerCase().includes(' à ')) {
            places = cleaned.split(/ à /i).map((p: string) => p.trim())
        } else if (cleaned.toLowerCase().includes(' vers ')) {
            places = cleaned.split(/ vers /i).map((p: string) => p.trim())
        } else if (['Vol', 'Train', 'Bus', 'Trajet'].includes(stage.type) || /^(Vol|Train|Trajet)/i.test(text)) {
            const words = cleaned.split(/\s+/)
            if (words.length === 2) {
                places = words // Ex: "Nantes Madrid" -> ["Nantes", "Madrid"]
            } else if (words.length > 2 && words.includes('Paris')) {
                // Heuristic pour noms plus longs ex: "Paris CDG Tokyo" ? Pas parfait mais c'est un bonus
            }
        }
        
        for (const [idx, place] of places.entries()) {
          if (!place || place.length < 2) continue
          
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1`)
            const data = await res.json()
            if (data && data.length > 0) {
              newMarkers.push({
                 id: `${stage.id}-${idx}`,
                 coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
                 title: place.charAt(0).toUpperCase() + place.slice(1),
                 type: stage.type
              })
            }
          } catch (e) {
            console.error("Geocoding failed for", place)
          }
          await new Promise(r => setTimeout(r, 1000))
        }
      }
      
      if (isMounted) {
        setMarkers(newMarkers)
      }
    }

    if (stages.length > 0) {
      geocodeStages()
    } else {
      setMarkers([])
    }
    
    return () => { isMounted = false }
  }, [stages])

  if (stages.length > 0 && markers.length === 0) {
     return <div className="w-full h-full rounded-2xl border border-border/50 bg-muted flex items-center justify-center text-muted-foreground animate-pulse">Cartographie en cours...</div>
  }

  const positions = markers.map(m => m.coords)

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
        
        {markers.map((marker, i) => (
            <Marker key={marker.id} position={marker.coords} icon={customIcon}>
              <Popup>
                <div className="font-sans">
                  <p className="font-bold mb-1">{marker.title}</p>
                  <p className="text-sm opacity-80">{marker.type}</p>
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
