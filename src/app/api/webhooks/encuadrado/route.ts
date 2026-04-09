import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SECRET_TOKEN = process.env.ENCUADRADO_WEBHOOK_SECRET || "psicologos_ahora_encuadrado_secret_123";

export async function POST(req: Request) {
  // Cliente admin (service_role) para saltar las RLS en el webhook
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // ── 1. Verificación de Seguridad ──
  const authHeader = req.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${SECRET_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let data: any;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    encuadrado_patient_name,
    encuadrado_patient_email,
    amount,
    date,
    service_date,
    therapist_name,  // ← El nombre exacto que viene del cuerpo del correo
  } = data;

  console.log('[Encuadrado Webhook] Pago recibido:', { encuadrado_patient_name, amount, therapist_name });

  // ── 2. Buscar al Terapeuta por nombre ──
  // El campo "name" en la tabla terapeutas debe coincidir con lo que manda Encuadrado.
  // Encuadrado manda "Marlene Calvete Chavarría" → la tabla debe tener "Marlene Calvete Chavarría" o "Ps. Marlene Calvete Chavarría"
  let therapistId: number | null = null;

  if (therapist_name) {
    // Primero intentamos match exacto
    const { data: therapist } = await supabase
      .from('terapeutas')
      .select('id, name')
      .ilike('name', `%${therapist_name}%`) // ilike = case-insensitive LIKE
      .limit(1)
      .single();

    if (therapist) {
      therapistId = therapist.id;
      console.log('[Encuadrado Webhook] Terapeuta encontrado:', therapist.name, '→ ID:', therapistId);
    } else {
      console.warn('[Encuadrado Webhook] No se encontró terapeuta con nombre:', therapist_name);
    }
  }

  // ── 3. Intentar auto-asignar el Paciente (La Magia) ──
  let patientId: number | null = null;
  let status = 'pending_match';

  // Primero buscamos por correo (más preciso)
  if (encuadrado_patient_email) {
    const { data: patientByEmail } = await supabase
      .from('leads')
      .select('id, sessions')
      .eq('encuadrado_identifier', encuadrado_patient_email)
      .limit(1)
      .single();

    if (patientByEmail) {
      patientId = patientByEmail.id;
      status = 'matched';
      console.log('[Encuadrado Webhook] Auto-match por email → patient_id:', patientId);
    }
  }

  // Si no, buscamos por nombre
  if (!patientId && encuadrado_patient_name) {
    const { data: patientByName } = await supabase
      .from('leads')
      .select('id, sessions')
      .eq('encuadrado_identifier', encuadrado_patient_name)
      .limit(1)
      .single();

    if (patientByName) {
      patientId = patientByName.id;
      status = 'matched';
      console.log('[Encuadrado Webhook] Auto-match por nombre → patient_id:', patientId);
    }
  }

  // ── 4. Guardar el Pago en la tabla `payments` ──
  const { data: insertedPayment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      amount,
      payment_date: service_date || date,
      encuadrado_patient_name,
      encuadrado_patient_email,
      therapist_id: therapistId,   // ← Asignamos el terapeuta real
      patient_id: patientId,
      status,
    })
    .select()
    .single();

  if (paymentError) {
    console.error('[Encuadrado Webhook] Error insertando pago:', paymentError);
    return NextResponse.json({ error: 'Error saving payment' }, { status: 500 });
  }

  // ── 5. Si hizo auto-match, sumar sesión al paciente ──
  if (status === 'matched' && patientId) {
    const { data: patient } = await supabase
      .from('leads')
      .select('sessions')
      .eq('id', patientId)
      .single();

    await supabase
      .from('leads')
      .update({ sessions: (patient?.sessions || 0) + 1 })
      .eq('id', patientId);

    console.log('[Encuadrado Webhook] Sesión sumada al paciente:', patientId);
  }

  return NextResponse.json({
    success: true,
    status,
    therapist_id: therapistId,
    payment_id: insertedPayment.id,
  });
}
