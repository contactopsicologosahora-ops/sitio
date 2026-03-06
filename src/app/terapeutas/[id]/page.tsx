"use client";
import { ArrowLeft, Star, ShieldCheck, Mail, MapPin, Award, BookOpen, Quote } from "lucide-react";

export default function TerapeutaProfile({ params }: { params: { id: string } }) {
    // Mock data for the specific expert
    const t = {
        id: 1,
        name: "Dr. Roberto Bolton",
        title: "Psicoterapeuta Clínico Senior",
        specialty: "Terapia Cognitivo-Conductual",
        school: "Harvard Medical School",
        bio: "Con más de 15 años de experiencia, mi enfoque se centra en proporcionar herramientas prácticas y basadas en evidencia para superar la ansiedad y el estrés crónico. Creo firmemente que la salud mental es el pilar de una vida plena.",
        quote: "La claridad mental no es la ausencia de pensamientos, sino la habilidad de observar el flujo sin perderse en él.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert"
    };

    return (
        <div className="animate-fade" style={{ backgroundColor: 'var(--bg-serene)', minHeight: '100vh' }}>
            <header style={{ padding: '2rem 8%', display: 'flex', alignItems: 'center' }}>
                <a href="/terapeutas" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-soft)', fontWeight: '500' }}>
                    <ArrowLeft size={18} /> Volver al equipo
                </a>
            </header>

            <div style={{ padding: '0 8% 8rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6rem' }}>
                {/* Left Content */}
                <div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Perfil Especialista</span>
                    <h1 style={{ fontSize: '4rem', margin: '1rem 0', fontWeight: '400' }}>{t.name}</h1>
                    <p style={{ fontSize: '1.4rem', color: 'var(--primary-muted)', marginBottom: '3rem', fontWeight: '300' }}>{t.title}</p>

                    <div style={{ backgroundColor: 'var(--white)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '3rem' }}>
                        <Quote size={40} style={{ color: 'var(--accent)', opacity: 0.3, marginBottom: '1.5rem' }} />
                        <p className="serif-font" style={{ fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--primary)', lineHeight: '1.6' }}>
                            "{t.quote}"
                        </p>
                    </div>

                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Acompañamiento Clínico</h3>
                    <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem', marginBottom: '3rem' }}>{t.bio}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <Award size={24} style={{ color: 'var(--accent)' }} />
                            <div>
                                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--primary)' }}>Formación</h4>
                                <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>{t.school}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <ShieldCheck size={24} style={{ color: 'var(--accent)' }} />
                            <div>
                                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--primary)' }}>Certificación</h4>
                                <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>Registro Nacional de Salud</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Profile Photo & Action Box */}
                <div style={{ paddingTop: '2rem' }}>
                    <div style={{
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)',
                        background: 'var(--accent-light)',
                        height: '450px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        marginBottom: '3rem'
                    }}>
                        <img src={t.image} alt={t.name} style={{ width: '320px', height: '320px' }} />
                    </div>

                    <div className="glass-morphism" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', color: '#f39c12', marginBottom: '1rem' }}>
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="#f39c12" />)}
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>¿Iniciamos el proceso?</h3>
                        <p style={{ color: 'var(--text-soft)', marginBottom: '2rem' }}>Reserva tu primera sesión de evaluación con el Dr. Bolton hoy mismo.</p>
                        <button className="premium-btn" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem' }}>
                            Consultar Disponibilidad
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
