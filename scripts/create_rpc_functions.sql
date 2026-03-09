-- Funciones para contar clics, impresiones y visitas en tiempo real.
-- Ejecutar este archivo en el Editor de SQL de Supabase (SQL Editor).

-- 1. Función para incrementar el contador de "clics" de un terapeuta (Botón Reservar)
CREATE OR REPLACE FUNCTION public.increment_clics(therapist_id INT)
RETURNS void AS $$
BEGIN
  UPDATE public.terapeutas
  SET clics = clics + 1
  WHERE id = therapist_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Función para incrementar el contador de "impresiones" para un solo terapeuta (Visita a perfil)
CREATE OR REPLACE FUNCTION public.increment_impresiones(therapist_id INT)
RETURNS void AS $$
BEGIN
  UPDATE public.terapeutas
  SET impresiones = impresiones + 1
  WHERE id = therapist_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Función para incrementar el contador de "impresiones" para múltiples terapeutas a la vez (Pantalla /terapeutas)
CREATE OR REPLACE FUNCTION public.increment_impresiones_batch(therapist_ids INT[])
RETURNS void AS $$
BEGIN
  UPDATE public.terapeutas
  SET impresiones = impresiones + 1
  WHERE id = ANY(therapist_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
