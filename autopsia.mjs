import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'fallo_url';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallo_key';

const supabase = createClient(url, key);

async function autopsiaSupabase() {
  console.log("=== INICIO AUTOPSIA DE SUPABASE (SERVICE ROLE) ===");
  
  // 1. Verificar si podemos leer leads y cuáles son las columnas
  const { data: leads, error: errorSelect } = await supabase.from('leads').select('*').limit(1);
  if (errorSelect) {
    console.error("❌ ERROR CRÍTICO LEYENDO LEADS:", errorSelect);
  } else {
    console.log("✅ Lectura de Leads exitosa. Columnas detectadas:");
    if (leads && leads.length > 0) {
      console.log(Object.keys(leads[0]));
    } else {
      console.log("⚠️ La tabla leads está vacía.");
    }
  }

  // 2. Intentar inyectar el payload exacto que el API route envía
  const payloadIntentoA = {
    terapeuta_id: 1, // asumiendo int
    name: "Autopsia Test",
    phone: "123123123",
    email: "test@autopsia.com",
    status: 'Pendiente',
    theme: "Lead inyectado por script forense"
  };

  console.log("\nIntentando inserción A (terapeuta_id)...");
  const { error: errA } = await supabase.from('leads').insert([payloadIntentoA]);
  if (errA) {
    console.error("❌ Fallo iteración A:", errA.message || errA);
  } else {
    console.log("✅ Inserción A exitosa");
  }

  const payloadIntentoB = {
    therapist_id: 1, // asumiendo int
    name: "Autopsia Test",
    phone: "123123123",
    email: "test@autopsia.com",
    status: 'Pendiente',
    theme: "Lead inyectado por script forense"
  };

  console.log("\nIntentando inserción B (therapist_id)...");
  const { error: errB } = await supabase.from('leads').insert([payloadIntentoB]);
  if (errB) {
    console.error("❌ Fallo iteración B:", errB.message || errB);
  } else {
    console.log("✅ Inserción B exitosa");
  }
}

autopsiaSupabase().catch(console.error);
