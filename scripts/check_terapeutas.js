const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase.from('terapeutas').select('*').limit(1);
    if (data && data.length > 0) {
        console.log("Columnas de terapeutas:", Object.keys(data[0]));
        console.log("Ejemplo de datos:", data[0]);
    } else {
        console.log("No hay datos en terapeutas o error:", error);
    }
}

check();
