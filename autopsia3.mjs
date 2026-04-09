import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'fallo_url';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallo_key';
const supabase = createClient(url, key);

async function autopsiaFase3() {
  console.log("=== AUTOPSIA FASE 3: Mapeo Ocular de Inserción Replicada ===");
  
  // 1. Validar exactamente qué llaves existen AHORA en la base de datos
  const { data: cols } = await supabase.from('leads').select('*').limit(1);
  if (cols) {
    if (cols.length > 0) console.log("COLUMNAS ACTUALES DETECTADAS:", Object.keys(cols[0]));
    else console.log("⚠️ TABLA LEADS SIGUE VACÍA. Trataremos de inferir forzando error.");
  }

  // 2. Ejecutar inserción idéntica a /api/send-booking-emails
  console.log("\nIntentando grabar Lead con terapeuta_id...");
  const payload1 = {
    terapeuta_id: 1,
    name: 'TEST AUTOPSIA',
    email: 'test@autopsia.com',
    status: 'Pendiente',
    theme: 'Prueba Local'
  };
  
  const res1 = await supabase.from('leads').insert([payload1]);
  if (res1.error) {
    console.error("❌ FALLÓ terapeuta_id:", res1.error.message);
    
    console.log("\nIntentando grabar Lead con therapist_id...");
    const payload2 = {
      therapist_id: 1,
      name: 'TEST AUTOPSIA',
      email: 'test@autopsia.com',
      status: 'Pendiente',
      theme: 'Prueba Local'
    };
    const res2 = await supabase.from('leads').insert([payload2]);
    
    if (res2.error) {
       console.error("❌ FALLÓ therapist_id:", res2.error.message);
       console.log("\n>>> DEDUCCIÓN: AMBAS COLUMNAS ESTÁN AUSENTES EN EL ESQUEMA. EL USUARIO NO EJECUTÓ EL CÓDIGO SQL O HUBO OTRO ERROR.");
    } else {
       console.log("✅ ÉXITO con therapist_id. La estructura es correcta ahora.");
       // rollback
       await supabase.from('leads').delete().eq('name', 'TEST AUTOPSIA');
    }

  } else {
    console.log("✅ ÉXITO con terapeuta_id.");
    await supabase.from('leads').delete().eq('name', 'TEST AUTOPSIA');
  }
}

autopsiaFase3().catch(console.error);
