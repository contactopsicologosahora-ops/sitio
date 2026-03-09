const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLeads() {
    const { data, error } = await supabase.from('pacientes').select('*');
    if (error) {
        console.error("Error fetching patients:", error);
        return;
    }
    console.log("Total records in pacientes:", data.length);
    if (data.length > 0) {
        console.log("First record:", data[0]);
        console.log("Statuses found:", [...new Set(data.map(p => p.status))]);
    }

    const { data: tData, error: tError } = await supabase.from('terapeutas').select('id, name, leads');
    if (tError) {
        console.error("Error fetching therapists:", tError);
    } else {
        console.log("Therapist leads counts:", tData.map(t => ({ name: t.name, leads: t.leads })));
    }
}

checkLeads();
