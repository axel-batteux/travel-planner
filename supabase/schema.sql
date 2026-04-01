-- Le Compagnon de Voyage Ultime : Schéma SQL Complet (Phase 2 & 3)

-- 1. Table Itinéraires (Ligne de temps)
CREATE TABLE IF NOT EXISTS public.itinerary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'Etape', -- ex: 'Vol', 'Train', 'Hotel', 'Etape', 'Activité'
  title TEXT NOT NULL,
  location_name TEXT,
  maps_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Table Dépenses (Le "Tricount")
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  paid_by TEXT NOT NULL, -- ex: 'Axel', 'Copine' (ou l'ID de l'utilisateur)
  split_type TEXT NOT NULL DEFAULT 'equally', -- ex: 'equally', 'paid_by_me_only', 'paid_by_other_only'
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 3. Table des Documents (Coffre-fort Cloud)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 4. NOUVEAU : Table Checklist (Bagages & Tâches collaboratives)
CREATE TABLE IF NOT EXISTS public.checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  category TEXT NOT NULL DEFAULT 'Général', -- ex: 'Documents', 'Vêtements', 'À Faire'
  assigned_to TEXT, -- ex 'Axel'
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 5. NOUVEAU : Table Bucketlist & Idées (Restaurants, Spots)
CREATE TABLE IF NOT EXISTS public.bucketlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  maps_url TEXT,
  category TEXT NOT NULL DEFAULT 'Envie', -- ex: 'Restaurant', 'Vue', 'Musée'
  is_visited BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Activation de la sécurité RLS (Row Level Security)
ALTER TABLE public.itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bucketlist ENABLE ROW LEVEL SECURITY;

-- Ajout de règles par défaut (Permissions globales lâchent un peu de leste pour faciliter le MVP du couple, à durcir en multi-tenants strict)
-- Dans ce modèle "Couple", tous les utilisateurs connectés peuvent voir et modifier le voyage
CREATE POLICY "Acces global Itineraire" ON public.itinerary FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acces global Depenses" ON public.expenses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acces global Documents" ON public.documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acces global Checklists" ON public.checklists FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acces global Bucketlist" ON public.bucketlist FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Astuce : Vous devez aussi créer un 'Bucket' dans "Storage" sur Supabase, nommé 'documents_vault' et le rendre 'Public' pour lire facilement les fichiers (sinon il faut générer des URLs signées).
