-- Créez ces tables dans le SQL Editor de votre projet Supabase

CREATE TABLE public.itinerary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  flight_details TEXT,
  visa_required BOOLEAN DEFAULT false,
  visa_info TEXT,
  user_id UUID REFERENCES auth.users(id)
);

CREATE TABLE public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  paid_by TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  user_id UUID REFERENCES auth.users(id)
);

CREATE TABLE public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  file_url TEXT,
  user_id UUID REFERENCES auth.users(id)
);

-- Activation de la sécurité RLS (Row Level Security)
ALTER TABLE public.itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Ajout de règles par défaut (Permissions globales pour l'MVP, à durcir en prod)
CREATE POLICY "Acces lecture Itineraire" ON public.itinerary FOR SELECT TO authenticated USING (true);
CREATE POLICY "Acces insert Itineraire" ON public.itinerary FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Acces lecture Depenses" ON public.expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Acces insert Depenses" ON public.expenses FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Acces lecture Documents" ON public.documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Acces insert Documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (true);
