const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars");
    process.exit(1);
}

// Data matching what seedSupabase.js uses
const terapeutasData = [
    { name: "Ps. Esteban Cancino", email: "ca.esteban53@gmail.com" },
    { name: "Ps. Paola Arriagada", email: "paolaelianaad@gmail.com" },
    { name: "Ps. Manuel Erlandsen", email: "manuel.erlandsen.muscio@gmail.com" },
    { name: "Ps. Oliver Arancibia", email: "oarancibial@gmail.com" },
    { name: "Ps. Francisca Pino", email: "francisca.pino.a@gmail.com" },
    { name: "Ps. Juan Rojas", email: "juanrojaspardo@gmail.com" },
    { name: "Ps. Marlene Calvete", email: "marlenecalvete3@gmail.com" },
    { name: "Ps. Verónica Cuadra", email: "vcuadra9@gmail.com" },
];

async function updatePrices() {
    console.log("Updating prices...");

    for (const d of terapeutasData) {
        // Authenticate as the therapist
        const firstName = d.name.replace("Ps. ", "").split(" ")[0];
        const pwd = `${firstName}2026!`;

        // Create a dedicated client for this user session
        const client = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false }
        });

        const { data: authData, error: authError } = await client.auth.signInWithPassword({
            email: d.email,
            password: pwd,
        });

        if (authError) {
            console.error(`Login failed for ${d.name}:`, authError.message);
            continue;
        }

        console.log(`Logged in as ${d.name}`);

        const newPrice = d.name === "Ps. Juan Rojas" ? "$55.000" : "$40.000";

        const { data, error } = await client
            .from('terapeutas')
            .update({ price: newPrice })
            .eq('email', d.email)
            .select();

        if (error) {
            console.error(`Error updating ${d.name}:`, error.message);
        } else {
            console.log(`Updated ${d.name} -> ${newPrice}`);
        }
    }

    console.log("Done.");
}

updatePrices();
