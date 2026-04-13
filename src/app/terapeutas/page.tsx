import { Metadata } from 'next';
import { supabase } from "@/lib/supabase";
import { calculateTherapistScore } from "@/lib/scoring";
import TerapeutasGrid from "./TerapeutasGrid";

export const metadata: Metadata = {
  title: "Nuestros Psicólogos y Terapeutas Online | Psicólogos Ahora",
  description: "Conoce a nuestro equipo de psicólogos clínicos especializados. Reserva tu sesión con terapeutas expertos en depresión, ansiedad, estrés y más.",
  openGraph: {
    title: "Encuentra a tu Psicólogo Ideal | Psicólogos Ahora",
    description: "Terapeutas verificados con experiencia clínica. Agenda tu primera sesión online hoy.",
    url: 'https://psicologosahora.cl/terapeutas',
    siteName: 'Psicólogos Ahora',
    locale: 'es_CL',
    type: 'website',
  },
};

const TERAPEUTAS = [
    {
        id: 1,
        name: "Ps. Esteban Cancino Ancalipe",
        title: "Psicoterapia para Adultos",
        specialty: "Ansiedad, Depresión, Estrés, Angustia",
        price: "$40.000 / Individual",
        school: "Online",
        rating: 4.9,
        reviews: 124,
        image: "/terapeutas/esteban_cancino.png",
        tags: ["Ansiedad", "Depresión", "Estrés", "Duelos", "Autoestima", "Trauma"],
        metrics: { supervisionAttendance: true, weeklyAvailabilityHours: 35, seniorityMonths: 24, patientAdherence: 95 }
    },
    {
        id: 2,
        name: "Ps. Paola Arriagada",
        title: "Psicoterapia para Adultos",
        specialty: "Ansiedad, Depresión, Estrés, Angustia",
        price: "$40.000 / Individual",
        school: "Online",
        rating: 5.0,
        reviews: 86,
        image: "/terapeutas/paola_arriagada.jpg",
        tags: ["Ansiedad", "Depresión", "Autoestima", "Fobias", "Duelos"],
        metrics: { supervisionAttendance: true, weeklyAvailabilityHours: 25, seniorityMonths: 18, patientAdherence: 88 }
    },
    {
        id: 3,
        name: "Ps. Manuel Erlandsen Muscio",
        title: "Psicoterapia para Adultos",
        specialty: "Trastornos del ánimo, Neurodivergencias",
        price: "$40.000 / Individual",
        school: "Online",
        rating: 4.8,
        reviews: 64,
        image: "/terapeutas/manuel_erlandsen.jpg",
        tags: ["Depresión", "TCA", "Obsesión", "Neurodivergencias"],
        metrics: { supervisionAttendance: true, weeklyAvailabilityHours: 20, seniorityMonths: 12, patientAdherence: 80 }
    },
    {
        id: 4,
        name: "Ps. Oliver Arancibia López",
        title: "Psicoterapia para Adultos",
        specialty: "Ansiedad generalizada, Problemas de pareja",
        price: "$40.000 / Individual",
        school: "Online",
        rating: 4.9,
        reviews: 92,
        image: "/terapeutas/oliver_arancibia.png",
        tags: ["Pareja", "Duelo", "TCA", "Disfunciones sexuales"],
        metrics: { supervisionAttendance: false, weeklyAvailabilityHours: 40, seniorityMonths: 10, patientAdherence: 82 }
    },
    {
        id: 5,
        name: "Ps. Francisca Pino Aragón",
        title: "Psicoterapia para Adultos",
        specialty: "Estrés, Ansiedad social, Manejo de la ira",
        price: "$40.000 / Individual",
        school: "Online",
        rating: 4.7,
        reviews: 78,
        image: "/terapeutas/francisca_pino.png",
        tags: ["Estrés", "Ansiedad social", "Duelo", "Crianza"],
        metrics: { supervisionAttendance: true, weeklyAvailabilityHours: 15, seniorityMonths: 8, patientAdherence: 90 }
    },
    {
        id: 6,
        name: "Ps. Juan Rojas Pardo",
        title: "Psicoterapia para Adultos",
        specialty: "Depresión, Ansiedad, Relaciones conflictivas",
        price: "$55.000 / Individual",
        school: "Online",
        rating: 5.0,
        reviews: 110,
        image: "/terapeutas/juan_rojas.png",
        tags: ["Depresión", "Ansiedad", "Ideación Suicida", "Inseguridades"],
        metrics: { supervisionAttendance: true, weeklyAvailabilityHours: 20, seniorityMonths: 30, patientAdherence: 98 }
    },
    {
        id: 7,
        name: "Ps. Marlene Calvete Chavarría",
        title: "Psicoterapia para Adultos",
        specialty: "Trastornos de Conducta Alimentaria, Depresión",
        price: "$40.000 / Individual",
        school: "Online",
        rating: 4.8,
        reviews: 55,
        image: "/terapeutas/marlene_calvete.png",
        tags: ["TCA", "Depresión", "Crisis de Pánico", "Sueño"],
        metrics: { supervisionAttendance: false, weeklyAvailabilityHours: 10, seniorityMonths: 4, patientAdherence: 75 }
    },
    {
        id: 8,
        name: "Ps. Verónica Cuadra Valenzuela",
        title: "Psicoterapia para Adultos",
        specialty: "Estrés, Ansiedad social, Pareja",
        price: "$40.000 / Individual",
        school: "Online",
        rating: 4.9,
        reviews: 84,
        image: "/terapeutas/veronica_cuadra.png",
        tags: ["Estrés", "Autoestima", "Duelo", "Psicoeducación"],
        metrics: { supervisionAttendance: true, weeklyAvailabilityHours: 25, seniorityMonths: 14, patientAdherence: 85 }
    }
];

export const revalidate = 60; // Regenerar datos cada 60 segundos si cambia Supabase. SSG súper rápido.

export default async function Terapeutas() {
    let terapeutasList = [...TERAPEUTAS];
    
    try {
        const { data, error } = await supabase.from('terapeutas').select('*').order('id', { ascending: true });
        if (data && !error) {
            const mergedList = TERAPEUTAS.map(baseT => {
                const dbMatch = data.find(d => d.id === baseT.id) || {};
                return {
                    ...baseT,
                    ...dbMatch,
                    name: baseT.name,
                    price: baseT.name.includes("Juan Rojas") ? "$55.000 / Individual" : "$40.000 / Individual",
                    metrics: dbMatch.metrics || baseT.metrics || { supervisionAttendance: true, weeklyAvailabilityHours: 20, seniorityMonths: 6, patientAdherence: 80 },
                    image: dbMatch.image || baseT.image,
                    tags: dbMatch.tags || baseT.tags || [],
                    rating: typeof dbMatch.rating === 'number' ? dbMatch.rating : baseT.rating
                };
            });
            
            const newTherapists = data
                .filter(d => !TERAPEUTAS.some(baseT => baseT.id === d.id))
                .filter(d => d.name && d.name.trim() !== "");
                
            terapeutasList = [...mergedList, ...newTherapists];
        }
    } catch (error) {
        console.error("Error fetching profiles from supabase:", error);
    }

    terapeutasList.sort((a,b) => calculateTherapistScore(b) - calculateTherapistScore(a));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "MedicalClinic",
        "name": "Psicólogos Ahora",
        "url": "https://psicologosahora.cl",
        "medicalSpecialty": ["Psychiatric", "Psychological"],
        "employee": terapeutasList.map(t => ({
            "@type": "Physician",
            "name": t.name,
            "jobTitle": "Psicólogo Clínico",
            "medicalSpecialty": t.specialty,
            "image": t.image?.startsWith('http') ? t.image : `https://psicologosahora.cl${t.image || ''}`,
            "aggregateRating": t.rating ? {
                "@type": "AggregateRating",
                "ratingValue": t.rating.toFixed(1),
                "reviewCount": t.reviews || 50
            } : undefined
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="animate-fade" style={{ padding: '0 0 10rem' }}>
                {/* Elegant Header Section */}
                <section style={{ padding: '3.5rem 8% 1rem', backgroundColor: '#faf9f6', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3.2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
                        Equipo de <span style={{ color: 'var(--accent)' }}>Especialistas</span>
                    </h1>
                    <p style={{ color: 'var(--text-soft)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
                        Seleccionamos cuidadosamente a cada profesional para garantizar que tu proceso terapéutico esté en las manos más expertas del país.
                    </p>
                    <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--accent)', margin: '2.5rem auto 0', borderRadius: '4px' }}></div>
                </section>

                <TerapeutasGrid terapeutasList={terapeutasList} />
            </div>
        </>
    );
}
