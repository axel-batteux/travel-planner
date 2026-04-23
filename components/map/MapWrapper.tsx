'use client'

import dynamic from 'next/dynamic'

// Importer dynamiquement la carte avec SSR désactivé.
// Ceci doit être fait dans un composant "use client" et non pas dans la page serveur.
const ItineraryMap = dynamic(() => import('./ItineraryMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center text-muted-foreground">Chargement de la carte...</div>
})

export default function MapWrapper({ stages }: { stages: any[] }) {
  return <ItineraryMap stages={stages} />
}
