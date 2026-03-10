-- Add appointment tracking to pacientes table
ALTER TABLE public.pacientes 
ADD COLUMN IF NOT EXISTS appointment_date DATE,
ADD COLUMN IF NOT EXISTS appointment_time TEXT;

-- Index for faster lookup in calendar
CREATE INDEX IF NOT EXISTS idx_pacientes_appointment ON public.pacientes (therapist_id, appointment_date, appointment_time);
