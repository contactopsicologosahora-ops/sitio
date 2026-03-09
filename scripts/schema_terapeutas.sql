CREATE TABLE IF NOT EXISTS public.terapeutas (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    image TEXT,
    price TEXT,
    specialty TEXT,
    tags JSONB,
    availability TEXT,
    rating NUMERIC(3, 1),
    reviews INTEGER,
    email TEXT UNIQUE NOT NULL,
    impresiones INTEGER DEFAULT 0,
    clics INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security) (Opcional por ahora, lo dejaremos público para lectura)
ALTER TABLE public.terapeutas ENABLE ROW LEVEL SECURITY;

-- Politicas
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.terapeutas FOR SELECT 
USING ( true );

CREATE POLICY "Therapists can update their own profile." 
ON public.terapeutas FOR UPDATE 
USING ( auth.uid() IN (SELECT id FROM auth.users WHERE email = terapeutas.email) );

-- Add email column to pacientes table
ALTER TABLE public.pacientes
ADD COLUMN IF NOT EXISTS email TEXT;
