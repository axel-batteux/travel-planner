import { createClient } from '@/utils/supabase/server'
import { Plane, Calendar, MapPin, Award } from 'lucide-react'

const MOCK_ITINERARY = [
  { id: '1', country: 'Japon', start_date: '2026-05-10', end_date: '2026-05-24', flight_details: 'AF276: CDG -> HND (Escale Dubai)', visa_required: false, visa_info: 'Exempté pour < 90 jours' },
  { id: '2', country: 'Corée du Sud', start_date: '2026-05-24', end_date: '2026-06-05', flight_details: 'KE704: HND -> ICN', visa_required: true, visa_info: 'K-ETA obligatoire' },
  { id: '3', country: 'Vietnam', start_date: '2026-06-05', end_date: '2026-06-25', flight_details: 'VN417: ICN -> HAN', visa_required: true, visa_info: 'E-Visa vietnamien' },
]

export default async function ItineraryPage() {
  const supabase = await createClient()
  let itinerary = MOCK_ITINERARY

  if (supabase) {
    const { data } = await supabase.from('itinerary').select('*').order('start_date', { ascending: true })
    if (data && data.length > 0) {
      itinerary = data
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Itinéraire</h1>
        <p className="text-muted-foreground mt-2">Votre parcours chronologique des pays visités.</p>
      </header>

      <div className="relative border-l-2 border-primary/20 ml-3 md:ml-6 mt-8 space-y-12 pb-16">
        {itinerary.map((step) => (
          <div key={step.id} className="relative pl-8 md:pl-10">
            {/* Timeline Dot */}
            <div className="absolute w-6 h-6 bg-primary rounded-full -left-[13px] md:-left-[13px] top-1 border-4 border-background shadow-sm"></div>
            
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="text-primary" /> {step.country}
                </h2>
                <div className="flex items-center gap-2 text-sm font-medium bg-muted px-3 py-1.5 rounded-full w-fit">
                  <Calendar size={16} />
                  <span>{new Date(step.start_date).toLocaleDateString('fr-FR')} - {new Date(step.end_date).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {step.flight_details && (
                  <div className="flex gap-3 items-start bg-accent/30 p-4 rounded-xl">
                    <Plane className="text-primary mt-0.5" size={20} />
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Détails du Vol</h3>
                      <p className="text-sm text-muted-foreground">{step.flight_details}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 items-start bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/50">
                   <Award className={step.visa_required ? "text-orange-600" : "text-emerald-600"} size={20} />
                   <div>
                      <h3 className="font-semibold text-sm mb-1">{step.visa_required ? "Visa Requis" : "Pas de visa"}</h3>
                      <p className="text-sm text-muted-foreground">{step.visa_info}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
