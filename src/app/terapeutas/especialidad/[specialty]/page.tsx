import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { calculateTherapistScore } from "@/lib/scoring";
import TerapeutasGrid from "../../TerapeutasGrid";
import { getTerapeutasList } from "../../data";

// Mapa de URLs a Tags reales de la base de datos
const SPECIALTIES: Record<string, { name: string, titleStr: string, description: string }> = {
    "ansiedad": {
        name: "Ansiedad",
        titleStr: "Ansiedad y Crisis de Pánico",
        description: "Terapia especializada en el manejo de la ansiedad, crisis de pánico y fobias."
    },
    "depresion": {
        name: "Depresión",
        titleStr: "Depresión y Estado de Ánimo",
        description: "Acompañamiento clínico para superar la depresión, alteraciones del ánimo y desgano."
    },
    "estres": {
        name: "Estrés",
        titleStr: "Estrés y Burnout",
        description: "Estrategias efectivas para el manejo del estrés laboral, burnout y estrés crónico."
    },
    "terapia-de-pareja": {
        name: "Pareja",
        titleStr: "Terapia de Pareja",
        description: "Terapia enfocada en resolver conflictos de convivencia, comunicación e intimidad."
    },
    "autoestima": {
        name: "Autoestima",
        titleStr: "Autoestima y Seguridad",
        description: "Psicoterapia enfocada en el fortalecimiento de la autoestima, seguridad y amor propio."
    },
    "duelo": {
        name: "Duelo",
        titleStr: "Manejo del Duelo",
        description: "Apoyo psicológico profesional para afrontar perdidas, rupturas y procesos de duelo."
    },
    "tca": {
        name: "TCA",
        titleStr: "Trastornos Alimentarios (TCA)",
        description: "Tratamiento experto en Trastornos de la Conducta Alimentaria y relación con la comida."
    }
};

type Props = {
    params: { specialty: string }
};

// Generación de metadatos dinámicos para SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const specialtyData = SPECIALTIES[params.specialty];
    if (!specialtyData) return {};

    const pageTitle = `Psicólogos especialistas en ${specialtyData.titleStr} | Psicólogos Ahora`;

    return {
        title: pageTitle,
        description: specialtyData.description,
        openGraph: {
            title: pageTitle,
            description: specialtyData.description,
            url: `https://psicologosahora.cl/terapeutas/especialidad/${params.specialty}`,
            siteName: 'Psicólogos Ahora',
            locale: 'es_CL',
            type: 'website',
        },
    };
}

// Pre-renderizar estas 7 URLs críticas en servidor (SSG) para velocidad máxima (Score 100/100)
export async function generateStaticParams() {
    return Object.keys(SPECIALTIES).map((specialty) => ({
        specialty,
    }));
}

export const revalidate = 60; // SSG dinámico

export default async function SpecialtyPage({ params }: Props) {
    const specialtyData = SPECIALTIES[params.specialty];

    // Si entra alguien a una especialidad que no existe (/especialidad/magia), arroja 404
    if (!specialtyData) {
        notFound();
    }

    const allTherapists = await getTerapeutasList();

    // Filtro estricto: Solo dejar los terapeutas que contengan el Tag o la especialidad base
    const filteredTherapists = allTherapists.filter(t => {
        const hasTag = t.tags?.includes(specialtyData.name);
        // Fallback porsi acaso la data base data lo incluye en el campo "specialty" de texto
        const hasSpecialtyText = t.specialty?.toLowerCase().includes(specialtyData.name.toLowerCase());
        return hasTag || hasSpecialtyText;
    });

    filteredTherapists.sort((a, b) => calculateTherapistScore(b) - calculateTherapistScore(a));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "MedicalClinic",
        "name": "Psicólogos Ahora",
        "url": "https://psicologosahora.cl",
        "medicalSpecialty": ["Psychiatric", "Psychological"],
        "description": specialtyData.description,
        "employee": filteredTherapists.map(t => ({
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
                <section style={{ padding: '3.5rem 8% 1rem', backgroundColor: '#faf9f6', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3.2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
                        Especialistas en <span style={{ color: 'var(--accent)' }}>{specialtyData.titleStr}</span>
                    </h1>
                    <p style={{ color: 'var(--text-soft)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
                        {specialtyData.description} Seleccionamos a los profesionales con la certificación y experiencia necesaria para tu tratamiento.
                    </p>
                    <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--accent)', margin: '2.5rem auto 0', borderRadius: '4px' }}></div>
                </section>

                {filteredTherapists.length > 0 ? (
                    <TerapeutasGrid terapeutasList={filteredTherapists} />
                ) : (
                    <div style={{ padding: '4rem 8%', textAlign: 'center', color: 'var(--text-soft)' }}>
                        <h3>Actualmente no tenemos profesionales disponibles para esta especialidad con agenda abierta.</h3>
                    </div>
                )}
            </div>
        </>
    );
}
