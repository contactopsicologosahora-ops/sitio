-- =====================================================
-- SCRIPT: Agregar columna 'email' a la tabla 'pacientes'
-- INSTRUCCIONES: Ejecutar en Supabase > SQL Editor
-- =====================================================

-- 1. Agregar columna email a la tabla pacientes (si no existe)
ALTER TABLE pacientes 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Verificar que se agregó correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pacientes' 
AND column_name = 'email';
