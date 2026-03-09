-- 1. Agregar columnas necesarias a la tabla terapeutas
ALTER TABLE public.terapeutas 
ADD COLUMN IF NOT EXISTS leads INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS calendar_url TEXT;

-- 2. Función para incrementar el contador de "leads"
CREATE OR REPLACE FUNCTION public.increment_leads(therapist_id INT)
RETURNS void AS $$
BEGIN
  UPDATE public.terapeutas
  SET leads = leads + 1
  WHERE id = therapist_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
