const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkJoin() {
    const { data, error } = await supabase.from('pacientes').select('*, terapeutas(name)');
    if (error) {
        console.error("Join Error:", error);
    } else {
        console.log("Join Success! Data count:", data.length);
        if (data.length > 0) {
            console.log("First record with join:", data[0]);
        }
    }
}

checkJoin();
