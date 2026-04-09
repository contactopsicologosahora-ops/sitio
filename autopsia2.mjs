import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'fallo_url';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallo_key';
const supabase = createClient(url, key);

async function autopsiaFase2() {
  console.log("=== AUTOPSIA FASE 2: Forzando Inserción Mínima ===");
  const { data, error } = await supabase.from('leads').insert([{ 
    name: 'TEST_INSERT'
  }]).select('*');
  
  if (error) {
    console.error("Fallo por constraint (esperado, nos da pistas):", error);
  } else {
    console.log("¡Inserción exitosa!");
    console.log("COLUMNAS EXTRAIDAS DEL OBJETO CREADO:", Object.keys(data[0]));
    // Limpiamos
    await supabase.from('leads').delete().eq('name', 'TEST_INSERT');
  }
}

autopsiaFase2().catch(console.error);
