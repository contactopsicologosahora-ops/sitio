import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  // Cliente admin (service_role) para saltar RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  try {
    const { therapistId, name, email, phone, status } = await request.json();

    if (!therapistId || !name) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // Insertamos el lead. Intentamos terapeuta_id primero.
    let { data, error: dbError } = await supabase.from('leads').insert([{
      terapeuta_id: therapistId,
      name: name,
      phone: phone || null,
      email: email || null,
      status: status || 'Paciente',
      theme: 'Añadido manualmente'
    }]).select();

    if (dbError) {
      console.error("Fallo insertando con terapeuta_id, intentando con therapist_id:", dbError);
      // Fallback a therapist_id
      const fallbackResult = await supabase.from('leads').insert([{
        therapist_id: therapistId,
        name: name,
        phone: phone || null,
        email: email || null,
        status: status || 'Paciente',
        theme: 'Añadido manualmente'
      }]).select();
      
      dbError = fallbackResult.error;
      data = fallbackResult.data;
    }

    if (dbError) {
      console.error("Error insertando paciente:", dbError);
      return NextResponse.json({ error: dbError }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data ? data[0] : null });
  } catch (error) {
    console.error('Excepción añadiendo paciente:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
