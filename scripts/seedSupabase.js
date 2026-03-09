const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// For creating users, we'd ideally need the SERVICE_ROLE_KEY, but we can try 
// a workaround to create auth users via sign up if we don't have it.
// However, direct DB inserts into 'terapeutas' works with anon key if RLS allows.

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const terapeutasData = [
    {
        name: "Ps. Esteban Cancino",
        title: "Psicólogo Clínico para Jóvenes y Adultos",
        bio: "Especialista en ansiedad y depresión. Mi enfoque se centra en crear un espacio seguro donde puedas explorar tus desafíos actuales. Trabajo con técnicas basadas en evidencia para ayudarte a desarrollar herramientas prácticas de afrontamiento.",
        image: "/terapeutas/esteban_cancino.png",
        price: "$25.000",
        specialty: "Ansiedad · Depresión · Autoestima",
        tags: ["Terapia Adultos", "Enfoque Cognitivo", "Crisis Vitales"],
        availability: "Alta",
        rating: 4.9,
        reviews: 124,
        email: "ca.esteban53@gmail.com",
    },
    {
        name: "Ps. Paola Arriagada",
        title: "Psicoterapeuta Especializada Adultos",
        bio: "Acompañamiento terapéutico profundo y empático. Creo firmemente en la capacidad de transformación de cada persona. Mi objetivo es acompañarte en tu proceso de autoconocimiento y sanación emocional de forma cálida y profesional.",
        image: "/terapeutas/paola_arriagada.jpg",
        price: "$25.000",
        specialty: "Trauma · Estrés · Desarrollo Personal",
        tags: ["Terapia Sistémica", "Regulación Emocional", "Adultos"],
        availability: "Alta",
        rating: 4.8,
        reviews: 98,
        email: "paolaelianaad@gmail.com",
    },
    {
        name: "Ps. Manuel Erlandsen",
        title: "Psicólogo Clínico Integrativo",
        bio: "Terapia compasiva para el desarrollo integral. Trabajo desde una perspectiva integrativa, combinando herramientas que mejor se adapten a tu situación particular. Nos enfocaremos en comprender la raíz de tus dificultades.",
        image: "/terapeutas/manuel_erlandsen.jpg",
        price: "$25.000",
        specialty: "Dependencia Emocional · Ansiedad · Duelo",
        tags: ["Terapia Integrativa", "Mindfulness", "Desarrollo Personal"],
        availability: "Media",
        rating: 5.0,
        reviews: 156,
        email: "manuel.erlandsen.muscio@gmail.com",
    },
    {
        name: "Ps. Oliver Arancibia",
        title: "Psicoterapeuta Clínico Adutos / Parejas",
        bio: "Especialista en dinámicas relacionales y crecimiento personal. Trabajo orientado a resultados concretos. Te ayudaré a identificar patrones limitantes y a construir formas más saludables de relacionarte contigo mismo y con tu entorno.",
        image: "/terapeutas/oliver_arancibia.png",
        price: "$25.000",
        specialty: "Terapia de Pareja · Conflictos Relacionales · Estrés",
        tags: ["Terapia de Pareja", "Resolución de Conflictos", "Ansiedad"],
        availability: "Media",
        rating: 4.9,
        reviews: 112,
        email: "oarancibial@gmail.com",
    },
    {
        name: "Ps. Francisca Pino",
        title: "Psicóloga Clínica Enfoque Sistémico",
        bio: "Acompañamiento respetuoso y centrado en tus recursos. Mi enfoque terapéutico se basa en comprender tu historia y contexto. Trabajaremos juntos para encontrar soluciones sostenibles que mejoren tu bienestar emocional diario.",
        image: "/terapeutas/francisca_pino.png",
        price: "$25.000",
        specialty: "Regulación Emocional · Crisis de Pánico · Autoestima",
        tags: ["Enfoque Sistémico", "Crisis de Pánico", "Terapia Mujeres"],
        availability: "Alta",
        rating: 4.8,
        reviews: 87,
        email: "francisca.pino.a@gmail.com",
    },
    {
        name: "Ps. Juan Rojas",
        title: "Psicólogo Clínico Especialista en Trauma",
        bio: "Espacio seguro para sanar heridas profundas. Especializado en el procesamiento de experiencias difíciles y trauma. Mi compromiso es brindarte un acompañamiento cuidadoso y validante durante tu proceso de recuperación.",
        image: "/terapeutas/juan_rojas.png",
        price: "$25.000",
        specialty: "Trauma Complejo · EMDR · Depresión Severa",
        tags: ["Especialista Trauma", "Terapia Focalizada", "Duelo"],
        availability: "Baja",
        rating: 5.0,
        reviews: 201,
        email: "juanrojaspardo@gmail.com",
    },
    {
        name: "Ps. Marlene Calvete",
        title: "Psicóloga Clínica y Supervisora",
        bio: "Experiencia significativa en procesos clínicos complejos. Ofrezco un espacio de escucha atenta y reflexión profunda. Juntos exploraremos nuevas perspectivas que te permitan enfrentar tus dificultades con mayor resiliencia.",
        image: "/terapeutas/marlene_calvete.png",
        price: "$25.000",
        specialty: "Trastornos del Ánimo · Ansiedad Generalizada · Estrés Laboral",
        tags: ["Psicoanálisis", "Estrés Laboral", "Adultos Jóvenes"],
        availability: "Alta",
        rating: 4.9,
        reviews: 143,
        email: "marlenecalvete3@gmail.com",
    },
    {
        name: "Ps. Verónica Cuadra",
        title: "Psicoterapeuta Especializada Psicoanálisis",
        bio: "Profundizando en las raíces de tus síntomas. Mi trabajo se orienta a comprender el origen inconsciente de tu malestar. A través del autoconocimiento profundo, buscamos lograr cambios duraderos y una vida más plena.",
        image: "/terapeutas/veronica_cuadra.png",
        price: "$25.000",
        specialty: "Dificultades Relacionales · Angustia · Identidad",
        tags: ["Terpia Psicoanalítica", "Autoconocimiento", "Angustia"],
        availability: "Alta",
        rating: 4.8,
        reviews: 105,
        email: "vcuadra9@gmail.com",
    }
];

async function seed() {
    console.log("Creando Auth Users...");
    for (const d of terapeutasData) {
        const firstName = d.name.replace("Ps. ", "").split(" ")[0];
        const pwd = `${firstName}2026!`;

        console.log(`Intentando crear auth user para: ${d.email}`);

        // Supabase SignUp para crear el usuario en Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: d.email,
            password: pwd,
            options: {
                data: {
                    name: d.name,
                    role: 'terapeuta'
                }
            }
        });

        if (authError) {
            console.error(`Error en auth para ${d.name}:`, authError.message);
            // Si el user ya existe, lo ignoramos y seguimos para insertar en public.terapeutas
            if (!authError.message.includes("already registered")) {
                continue;
            }
        } else {
            console.log(`✅ Auth creado: ${d.name} (${d.email})`);
        }

    }

    console.log("\nInsertando en la tabla 'terapeutas'...");

    const { data: tableData, error: tableError } = await supabase
        .from('terapeutas')
        .upsert(
            terapeutasData.map(t => ({
                id: terapeutasData.findIndex(x => x.name === t.name) + 1,
                name: t.name,
                title: t.title,
                bio: t.bio,
                image: t.image,
                price: t.price,
                specialty: t.specialty,
                tags: t.tags,
                availability: t.availability,
                rating: t.rating,
                reviews: t.reviews,
                email: t.email,
                impresiones: 0,
                clics: 0
            }))
        );

    if (tableError) {
        console.error("Error insertando terapeutas:", tableError);
    } else {
        console.log("✅ Tabla terapeutas poblada con éxito.");
    }

}

seed();
