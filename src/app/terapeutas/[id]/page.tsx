"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Star, Shield, Clock, Users, GraduationCap, Quote, Mail, MapPin, CalendarCheck, CheckCircle2 } from "lucide-react";
import BookingFlow from "@/components/BookingFlow";
import { therapistsData } from "@/lib/therapists";

export default function TerapeutaProfile({ params }: { params: { id: string } }) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fallback asegurado
    const t = therapistsData[params.id as keyof typeof therapistsData] || therapistsData["1"] || { 
        name: "Especialista Clínico", 
        title: "Psicoterapeuta",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback",
        specialty:"Especialista",
        bio: "Bio no disponible",
        areas: [],
        testimonials: []
    };

    if (!mounted) return null; // Prevents hydration mismatch

    const hasTestimonials = t.testimonials && t.testimonials.length > 0;
    const ratingDisplay = t.rating ? t.rating.toFixed(1) : "5.0";

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#1E293B', overflowX: 'hidden' }}>
            
            {/* Soft Ambient Glow Elements */}
            <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '70vw', height: '70vw', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
            <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>

            {/* Navigation Header */}
            <header style={{ position: 'relative', zIndex: 10, padding: '2rem 5%', display: 'flex', alignItems: 'center' }}>
                <a href="/terapeutas" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', color: '#64748B', fontWeight: '500', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '50px', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', transition: 'all 0.3s ease' }} 
                   onMouseEnter={(e) => { e.currentTarget.style.color = '#0F172A'; e.currentTarget.style.transform = 'translateX(-3px)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                    <ArrowLeft size={18} /> <span>Regresar a Especialistas</span>
                </a>
            </header>

            <main style={{ position: 'relative', zIndex: 10, maxWidth: '1440px', margin: '0 auto', padding: '1rem 5% 6rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr)', gap: '6rem', alignItems: 'start' }}>
                
                {/* Left Column: Huge Sticky Avatar & Main CTA */}
                <div style={{ position: 'sticky', top: '3rem', animation: 'fadeInUp 0.8s ease-out' }}>
                    
                    {/* The Avatar Container */}
                    <div style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', padding: '1rem', background: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(255,255,255,0.6)' }}>
                        <div style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', aspectRatio: '4/5', backgroundColor: '#F1F5F9' }}>
                            <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            
                            {/* Inner gradient overlay for depth */}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.7) 0%, rgba(0,0,0,0) 40%)' }}></div>
                            
                            {/* Live Badge */}
                            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)', padding: '0.4rem 0.8rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                                <div style={{ width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%' }}></div>
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Disponible</span>
                            </div>

                            {/* Floating Stats on Image */}
                            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div style={{ color: 'white' }}>
                                    <h4 style={{ fontSize: '1.8rem', margin: '0 0 0.2rem 0', fontWeight: '500' }}>{t.experience || "10+ Años"}</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>De Experiencia</p>
                                </div>
                                <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '0.8rem 1.2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <Star fill="#FBBF24" color="#FBBF24" size={24} />
                                    <div>
                                        <div style={{ color: 'white', fontWeight: '600', fontSize: '1.2rem', lineHeight: '1' }}>{ratingDisplay}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', marginTop: '2px' }}>Valoración</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Direct Call to Action Container */}
                        <div style={{ marginTop: '1.5rem', padding: '0.5rem' }}>
                            <button 
                                onClick={() => setIsBookingOpen(true)}
                                style={{ 
                                    width: '100%', padding: '1.2rem', borderRadius: '16px', 
                                    backgroundColor: '#0F172A', color: 'white', border: 'none', 
                                    fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem',
                                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)', transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(15, 23, 42, 0.4)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(15, 23, 42, 0.3)'; }}
                            >
                                <CalendarCheck size={22} />
                                Agendar Evaluación de Ingreso
                            </button>
                            <p style={{ textAlign: 'center', margin: '1rem 0 0 0', fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                <Shield size={14} color="#10B981" /> Pago y reserva 100% seguros
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Information Flow */}
                <div style={{ paddingTop: '2rem', animation: 'fadeInUp 0.8s ease-out 0.2s', animationFillMode: 'both' }}>
                    
                    {/* Header Info */}
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1.2rem', backgroundColor: '#E0E7FF', color: '#4338CA', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                            {t.specialty || "Especialidad Clínica"}
                        </div>
                        <h1 style={{ fontSize: '3.8rem', color: '#0F172A', fontWeight: '800', lineHeight: '1.1', margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>
                            {t.name}
                        </h1>
                        <h2 style={{ fontSize: '1.5rem', color: '#64748B', fontWeight: '400', margin: '0', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <GraduationCap size={24} color="#64748B" /> {t.title}
                        </h2>
                    </div>

                    {/* About Section */}
                    <div style={{ marginBottom: '4rem' }}>
                        <h3 style={{ fontSize: '1.8rem', color: '#0F172A', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.8rem' }}>
                            Mi enfoque clínico
                        </h3>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#334155', margin: '0 0 2rem 0', fontWeight: '300' }}>
                            {t.bio}
                        </p>
                        
                        {t.quote && t.quote !== "" && (
                            <div style={{ position: 'relative', padding: '2rem 3rem', backgroundColor: '#F8FAFC', borderLeft: '4px solid #6366F1', borderRadius: '0 24px 24px 0' }}>
                                <Quote size={48} style={{ color: '#E2E8F0', position: 'absolute', top: '-1rem', left: '-1rem', transform: 'rotate(180deg)' }} />
                                <p style={{ fontSize: '1.3rem', fontStyle: 'italic', fontWeight: '500', color: '#1E293B', margin: 0, lineHeight: '1.6' }}>
                                    "{t.quote}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Specialized Areas Badges */}
                    {t.areas && t.areas.length > 0 && (
                        <div style={{ marginBottom: '4rem' }}>
                            <h3 style={{ fontSize: '1.4rem', color: '#0F172A', fontWeight: '600', marginBottom: '1.5rem' }}>Especialista en resolver:</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                {t.areas.map((area: string, i: number) => (
                                    <div key={i} style={{ padding: '0.8rem 1.4rem', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '1rem', color: '#334155', fontWeight: '500', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckCircle2 size={16} color="#10B981" /> {area}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Credentials Matrix */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '5rem', backgroundColor: 'white', padding: '3rem', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#6366F1', marginBottom: '1rem' }}>
                                <div style={{ padding: '0.8rem', backgroundColor: '#EEF2FF', borderRadius: '12px' }}>
                                    <GraduationCap size={24} />
                                </div>
                                <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#0F172A', fontWeight: '700' }}>Formación base</h4>
                            </div>
                            <p style={{ color: '#475569', margin: 0, fontSize: '1rem', lineHeight: '1.5' }}>{t.school || "Acreditación Nacional"}</p>
                        </div>
                        
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#10B981', marginBottom: '1rem' }}>
                                <div style={{ padding: '0.8rem', backgroundColor: '#ECFDF5', borderRadius: '12px' }}>
                                    <Users size={24} />
                                </div>
                                <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#0F172A', fontWeight: '700' }}>Impacto Clínico</h4>
                            </div>
                            <p style={{ color: '#475569', margin: 0, fontSize: '1rem', lineHeight: '1.5' }}>Más de {t.patients || "1.000+"} procesos terapéuticos dirigidos.</p>
                        </div>

                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid #F1F5F9' }}>
                            <h4 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: '#0F172A', fontWeight: '700' }}>Mi Metodología</h4>
                            <p style={{ color: '#475569', margin: 0, fontSize: '1.05rem', lineHeight: '1.6' }}>{t.methodology || "Basado en metas y objetivos medibles a corto y largo plazo para asegurar un alta médica definitiva."}</p>
                        </div>
                    </div>

                    {/* Highly Styled Testimonials */}
                    {hasTestimonials && (
                        <div>
                            <h3 style={{ fontSize: '1.8rem', color: '#0F172A', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                Voces de pacientes reales
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {t.testimonials.slice(0, 4).map((testimonio: any, idx: number) => (
                                    <div key={idx} style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '40px', height: '40px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#64748B' }}>
                                                    {testimonio.author.charAt(0)}
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: '600', color: '#0F172A' }}>{testimonio.author}</p>
                                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>{testimonio.date}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={16} fill={i < (testimonio.rating || 5) ? "#FBBF24" : "#E2E8F0"} color={i < (testimonio.rating || 5) ? "#FBBF24" : "#E2E8F0"} />
                                                ))}
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, color: '#334155', fontSize: '1.05rem', lineHeight: '1.6', fontStyle: 'italic' }}>"{testimonio.content}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Booking Modal Overlay */}
            {isBookingOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', animation: 'zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <BookingFlow therapist={t} onClose={() => setIsBookingOpen(false)} />
                    </div>
                </div>
            )}

            {/* Add base animations dynamically to bypass jsx style issues */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}} />
        </div>
    );
}
