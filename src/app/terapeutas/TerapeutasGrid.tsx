"use client";
import { useState, useEffect } from "react";
import { Star, ShieldCheck, Clock, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { therapistsData } from "@/lib/therapists";

// Dynamic import with custom loading state for better UX and First Load JS optimization
const BookingFlow = dynamic(() => import("@/components/BookingFlow"), {
    ssr: false, // El modal de reserva es 100% cliente
    loading: () => <div style={{ color: 'white', fontWeight: 600 }}>Cargando sistema de reservas...</div>
});

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

    const isExternal = t.image && t.image.startsWith('http');

    return (
        <div className="ultra-card group" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="ultra-img-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.05) 100%)', zIndex: 1 }}></div>
                
                <Image 
                    src={t.image || "/placeholder.png"} 
                    alt={t.name} 
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'bottom center', zIndex: 0 }} 
                    className="ultra-img"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={isExternal}
                />
                
                <div className="badge-verified" style={{ zIndex: 3, position: 'absolute' }}>
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
                    {/* <Link href={`/terapeutas/${t.id}`} className="btn-profile" title="Ver perfil completo">
                        <User size={20} className="icon-grow" />
                    </Link> */}
                </div>
            </div>
        </div>
    );
}

export default function TerapeutasGrid({ terapeutasList }: { terapeutasList: any[] }) {
    const [selectedTherapist, setSelectedTherapist] = useState<any>(null);

    const handleBookNow = (therapist: any) => {
        setSelectedTherapist(therapist);
    };

    const closeModal = () => setSelectedTherapist(null);

    return (
        <>
            <div style={{ padding: '4rem 8%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '3rem', boxSizing: 'border-box', overflowX: 'hidden' }}>
                {terapeutasList.map(t => (
                    <TherapistCard key={t.id} t={t} handleBookNow={handleBookNow} />
                ))}
            </div>

            {selectedTherapist && typeof document !== 'undefined' && createPortal(
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(45, 62, 64, 0.4)', zIndex: 99999, backdropFilter: 'blur(8px)',
                    overflowY: 'auto', display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ margin: 'auto', padding: '2rem 1rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <BookingFlow
                            therapist={selectedTherapist}
                            onClose={closeModal}
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
