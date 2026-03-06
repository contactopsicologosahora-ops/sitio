"use client";
import { useState } from "react";
import { Search, X, CheckCircle, Star, ShieldCheck, Award, Clock, ArrowRight, User, MousePointer2 } from "lucide-react";
import Link from "next/link";
import BookingFlow from "@/components/BookingFlow";

const TERAPEUTAS = [
    {
        id: 1,
        name: "Ps. Esteban Cancino Ancalipe",
        title: "Psicoterapia para Adultos",
        specialty: "Ansiedad, Depresión, Estrés, Angustia",
        price: "$35.000 / Individual",
        school: "Online",
        rating: 4.9,
        reviews: 124,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Esteban",
        tags: ["Ansiedad", "Depresión", "Estrés", "Duelos", "Autoestima", "Trauma"]
    },
    {
        id: 2,
        name: "Ps. Paola Arriagada",
        title: "Psicoterapia para Adultos",
        specialty: "Ansiedad, Depresión, Estrés, Angustia",
        price: "$35.000 / Individual - $45.000 / Pareja",
        school: "Online",
        rating: 5.0,
        reviews: 86,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paola",
        tags: ["Ansiedad", "Depresión", "Autoestima", "Fobias", "Duelos"]
    },
    {
        id: 3,
        name: "Ps. Manuel Erlandsen Muscio",
        title: "Psicoterapia para Adultos",
        specialty: "Trastornos del ánimo, Neurodivergencias",
        price: "$35.000 / Individual",
        school: "Online",
        rating: 4.8,
        reviews: 64,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manuel",
        tags: ["Depresión", "TCA", "Obsesión", "Neurodivergencias"]
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
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
        tags: ["Pareja", "Duelo", "TCA", "Disfunciones sexuales"]
    },
    {
        id: 5,
        name: "Ps. Francisca Pino Aragón",
        title: "Psicoterapia para Adultos",
        specialty: "Estrés, Ansiedad social, Manejo de la ira",
        price: "$35.000 / Individual",
        school: "Online",
        rating: 4.7,
        reviews: 78,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Francisca",
        tags: ["Estrés", "Ansiedad social", "Duelo", "Crianza"]
    },
    {
        id: 6,
        name: "Ps. Juan Rojas Pardo",
        title: "Psicoterapia para Adultos",
        specialty: "Depresión, Ansiedad, Relaciones conflictivas",
        price: "$45.000 / Individual - $55.000 / Pareja",
        school: "Online",
        rating: 5.0,
        reviews: 110,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
        tags: ["Depresión", "Ansiedad", "Ideación Suicida", "Inseguridades"]
    },
    {
        id: 7,
        name: "Ps. Marlene Calvete Chavarría",
        title: "Psicoterapia para Adultos",
        specialty: "Trastornos de Conducta Alimentaria, Depresión",
        price: "$35.000 / Individual",
        school: "Online",
        rating: 4.8,
        reviews: 55,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marlene",
        tags: ["TCA", "Depresión", "Crisis de Pánico", "Sueño"]
    },
    {
        id: 8,
        name: "Ps. Verónica Cuadra Valenzuela",
        title: "Psicoterapia para Adultos",
        specialty: "Estrés, Ansiedad social, Pareja",
        price: "$35.000 / Individual",
        school: "Online",
        rating: 4.9,
        reviews: 84,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Veronica",
        tags: ["Estrés", "Autoestima", "Duelo", "Psicoeducación"]
    }
];

export default function Terapeutas() {
    const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
    const [step, setStep] = useState(1);

    const handleBookNow = (therapist: any) => {
        setSelectedTherapist(therapist);
        setStep(1);
    };

    const closeModal = () => setSelectedTherapist(null);

    return (
        <>
            <div className="animate-fade" style={{ padding: '0 0 10rem' }}>
                {/* Search Header Section */}
                <section style={{ padding: '3rem 8% 1.5rem', backgroundColor: '#faf9f6', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Equipo de Especialistas</h1>
                    <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
                        Seleccionamos cuidadosamente a cada profesional para garantizar que tu proceso terapéutico esté en las manos más expertas del país.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '500', fontSize: '0.9rem' }}>
                            <CheckCircle size={18} color="var(--accent)" /> Valores transparentes
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '500', fontSize: '0.9rem' }}>
                            <CheckCircle size={18} color="var(--accent)" /> Emitimos boleta para reembolso en tu sistema de salud
                        </div>
                    </div>
                </section>

                <div style={{ padding: '2rem 8%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '3rem' }}>
                    {TERAPEUTAS.map(t => (
                        <div key={t.id} className="expert-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ position: 'relative', height: '240px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
                                <img src={t.image} alt={t.name} style={{ width: '180px', height: '180px' }} />
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', backgroundColor: 'var(--white)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <ShieldCheck size={14} color="#27ae60" /> Especialista Verificado
                                </div>
                            </div>

                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.2rem', lineHeight: '1.2' }}>{t.name}</h3>
                                        <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem', fontWeight: '500' }}>{t.title}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#f39c12', fontWeight: '700' }}>
                                        <Star size={16} fill="#f39c12" /> {t.rating}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', color: 'var(--accent)', fontWeight: '600', fontSize: '1rem' }}>
                                    {t.price}
                                </div>

                                <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '1rem', minHeight: '3rem' }}>{t.specialty}...</p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '2rem' }}>
                                    {t.tags.map(tag => (
                                        <span key={tag} style={{ padding: '0.25rem 0.6rem', backgroundColor: '#f0efeb', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-soft)', fontWeight: '500' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #f0efeb', paddingTop: '1.5rem' }}>
                                    <button onClick={() => handleBookNow(t)} className="premium-btn" style={{ flex: 1, justifyContent: 'center', gap: '0.5rem' }}>
                                        Reservar Ahora
                                    </button>
                                    <Link href={`/terapeutas/${t.id}`} style={{ width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer', backgroundColor: 'var(--white)' }}>
                                        <User size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Advanced Booking Flow */}
            {selectedTherapist && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(45, 62, 64, 0.6)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(8px)'
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
