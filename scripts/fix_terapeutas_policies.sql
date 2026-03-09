-- =====================================================
-- SCRIPT: Corregir Políticas de la tabla 'terapeutas'
-- INSTRUCCIONES: Ejecutar en Supabase > SQL Editor
-- =====================================================

-- 1. Eliminar políticas existentes (para evitar duplicados)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.terapeutas;
DROP POLICY IF EXISTS "Therapists can update their own profile." ON public.terapeutas;
DROP POLICY IF EXISTS "Allow All for Seeding" ON public.terapeutas;

-- 2. Permitir Lectura Pública
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.terapeutas FOR SELECT 
USING ( true );

-- 3. Permitir Inserción para Seeding (Temporalmente abierto)
-- Nota: En producción real, esto debería estar más restringido
CREATE POLICY "Allow Insert for Seeding" 
ON public.terapeutas FOR INSERT 
WITH CHECK ( true );

-- 4. Permitir Actualización basado en JWT (Sin consultar auth.users directamente)
CREATE POLICY "Therapists can update their own profile." 
ON public.terapeutas FOR UPDATE 
USING ( auth.jwt() ->> 'email' = email );

-- 5. Asegurarse de que RLS está activo
ALTER TABLE public.terapeutas ENABLE ROW LEVEL SECURITY;
