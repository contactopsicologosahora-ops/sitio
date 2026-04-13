"use client";
import { useState, useEffect } from "react";
import { Star, ShieldCheck, Clock, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import BookingFlow from "@/components/BookingFlow";
import { supabase } from "@/lib/supabase";

import { calculateTherapistScore } from "@/lib/scoring";
import { therapistsData } from "@/lib/therapists";

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

function TherapistCard({ t, handleBookNow }: { t: any, handleBookNow: any }) {
    const fullData = therapistsData[t.id.toString()];
    const testimonials = fullData?.testimonials || [];
    const [testiIndex, setTestiIndex] = useState(0);

    useEffect(() => {
        if (testimonials.length > 1) {
            const interval = setInterval(() => {
                setTestiIndex((prev) => (prev + 1) % testimonials.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [testimonials.length]);

    return (
        <div className="ultra-card group" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="ultra-img-wrapper" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.05) 100%)', zIndex: 1 }}></div>
                <img src={t.image} alt={t.name} className="ultra-img" style={{ position: 'relative', zIndex: 2 }} />
                
                <div className="badge-verified" style={{ zIndex: 3 }}>
                    <ShieldCheck size={14} className="badge-icon" /> Verificado
                </div>
                
                <div style={{ position: 'absolute', bottom: '-15px', left: '2rem', background: 'white', padding: '0.4rem 1rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 4, fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary)' }}>
                    <Star size={16} fill="#f39c12" color="#f39c12" /> {t.rating?.toFixed(1) || "5.0"}
                </div>
            </div>

            <div style={{ padding: '2.5rem 2rem 2rem', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'white', borderRadius: '0 0 24px 24px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.3rem', lineHeight: '1.2', color: 'var(--primary)', fontWeight: '700', transition: 'color 0.3s' }} className="card-title">
                            {t.name}
                        </h3>
                        <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', fontWeight: '500', marginBottom: '1rem' }}>{t.title}</p>
                    </div>
                </div>

                <div style={{ padding: '0.8rem 1rem', background: '#faf9f6', borderRadius: '12px', marginBottom: '1.5rem', borderLeft: '3px solid var(--accent)' }}>
                    <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>
                        {t.specialty}...
                    </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 'auto' }}>
                    {Array.isArray(t.tags) && t.tags.map((tag: string) => (
                        <span key={tag} className="tag-pill">
                            {tag}
                        </span>
                    ))}
                </div>

                {testimonials.length > 0 && (
                    <div style={{ marginTop: '1.5rem', padding: '1.2rem', borderRadius: '12px', backgroundColor: '#fcfbf9', border: '1px solid #f0efeb', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex' }}>
                                {[...Array(testimonials[testiIndex].rating)].map((_, i) => (
                                    <Star key={i} size={10} fill="#f39c12" color="#f39c12" />
                                ))}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-soft)', fontWeight: '600' }}>
                                {testimonials[testiIndex].author}
                            </span>
                        </div>
                        <p key={testiIndex} className="testimonial-text" style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--primary)', lineHeight: '1.4', margin: 0 }}>
                            "{testimonials[testiIndex].content}"
                        </p>
                        
                        <div style={{ display: 'flex', gap: '6px', marginTop: '1rem', justifyContent: 'center' }}>
                            {testimonials.map((_: any, idx: number) => (
                                <div key={idx} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: idx === testiIndex ? 'var(--accent)' : '#ddd', transition: 'all 0.3s' }} />
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f0efeb' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginBottom: '0.2rem' }}>Valor Sesión</span>
                        <span style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '1.2rem' }}>
                            {typeof t.price === 'number' ? `$${t.price.toLocaleString('es-CL')}` : t.price}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-soft)', fontSize: '0.85rem', fontWeight: '500' }}>
                        <Clock size={15} /> 50 min
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button onClick={() => handleBookNow(t)} className="btn-reserve">
                        RESERVAR AHORA <ArrowRight size={16} />
                    </button>
                    <Link href={`/terapeutas/${t.id}`} className="btn-profile" title="Ver perfil completo">
                        <User size={20} className="icon-grow" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Terapeutas() {
    const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
    const [terapeutasList, setTerapeutasList] = useState<any[]>(TERAPEUTAS);

    useEffect(() => {
        const fetchTerapeutas = async () => {
            try {
                const { data, error } = await supabase.from('terapeutas').select('*').order('id', { ascending: true });
                if (data && !error) {
                    // Fusionamos los datos de Supabase con nuestro objeto base TERAPEUTAS
                    // Esto evita que perdamos las imágenes, métricas para cálculo de rating, y tags visuales
                    const mergedList = TERAPEUTAS.map(baseT => {
                        const dbMatch = data.find(d => d.id === baseT.id) || {};
                        return {
                            ...baseT,
                            ...dbMatch,
                            name: baseT.name, // El nombre base siempre manda para consistencia visual
                            price: baseT.name.includes("Juan Rojas") ? "$55.000 / Individual" : "$40.000 / Individual",
                            metrics: dbMatch.metrics || baseT.metrics || { supervisionAttendance: true, weeklyAvailabilityHours: 20, seniorityMonths: 6, patientAdherence: 80 },
                            image: dbMatch.image || baseT.image,
                            tags: dbMatch.tags || baseT.tags || [],
                            rating: typeof dbMatch.rating === 'number' ? dbMatch.rating : baseT.rating
                        };
                    });
                    
                    // Añadimos también cualquier terapeuta nuevo exclusivo de DB, pero filtrando los que no tengan nombre
                    const newTherapists = data
                        .filter(d => !TERAPEUTAS.some(baseT => baseT.id === d.id))
                        .filter(d => d.name && d.name.trim() !== ""); // SEGURIDAD: Filtrar si no hay nombre
                        
                    setTerapeutasList([...mergedList, ...newTherapists]);
                }
            } catch (error) {
                console.error("Error fetching profiles from supabase:", error);
            }
        };
        fetchTerapeutas();
    }, []);

    const handleBookNow = (therapist: any) => {
        setSelectedTherapist(therapist);
    };

    const closeModal = () => setSelectedTherapist(null);

    return (
        <>
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

            <div style={{ padding: '4rem 8%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '3rem' }}>
                {[...terapeutasList].sort((a,b) => calculateTherapistScore(b) - calculateTherapistScore(a)).map(t => {
                    return (
                    <TherapistCard key={t.id} t={t} handleBookNow={handleBookNow} />
                    );
                })}
            </div>

            </div>

            {/* Advanced Booking Flow modificado al final fuera de containers animados */}
            {selectedTherapist && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(45, 62, 64, 0.4)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(8px)'
                }}>
                    <BookingFlow
                        therapist={selectedTherapist}
                        onClose={closeModal}
                    />
                </div>
            )}
        </>
    );
}
