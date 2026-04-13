import { Metadata } from 'next';
import { calculateTherapistScore } from "@/lib/scoring";
import TerapeutasGrid from "./TerapeutasGrid";
import { getTerapeutasList } from "./data";

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

export const revalidate = 60;

export default async function Terapeutas() {
    const terapeutasList = await getTerapeutasList();

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
