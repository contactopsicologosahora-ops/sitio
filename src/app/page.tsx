import { ArrowRight, Leaf, Heart, Wind, Star } from "lucide-react";
import MatchingQuiz from "@/components/MatchingQuiz";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
    return (
        <div className="animate-fade" style={{ backgroundColor: 'var(--bg-serene)' }}>
            {/* Immersive Hero Section */}
            <section style={{
                padding: '10rem 8% 8rem',
                background: 'radial-gradient(circle at 10% 20%, rgba(125, 143, 105, 0.05) 0%, rgba(255, 255, 255, 0) 50%), radial-gradient(circle at 90% 80%, rgba(139, 125, 107, 0.05) 0%, rgba(255, 255, 255, 0) 50%)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Subtle decorative elements */}
                <div style={{ position: 'absolute', top: '10%', right: '5%', opacity: 0.1, color: 'var(--primary-muted)' }}><Wind size={120} /></div>
                <div style={{ position: 'absolute', bottom: '10%', left: '5%', opacity: 0.1, color: 'var(--primary-muted)' }}><Leaf size={100} /></div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <span style={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'var(--accent)',
                        marginBottom: '1.5rem',
                        display: 'block'
                    }}>Excelencia en Salud Mental</span>

                    <h1 style={{ fontSize: '4.2rem', maxWidth: '900px', margin: '0 auto 2rem', fontWeight: '400' }}>
                        Un espacio de <span className="serif-font" style={{ fontStyle: 'italic', fontWeight: '400' }}>paz</span> para tu <span className="text-gradient">bienestar emocional</span>.
                    </h1>

                    <p style={{ fontSize: '1.25rem', color: 'var(--text-soft)', maxWidth: '650px', margin: '0 auto 3.5rem', fontWeight: '300' }}>
                        Acompañamiento psicoterapéutico de alta especialidad. Encontramos juntos la claridad y el equilibrio que buscas en un entorno seguro y profesional.
                    </p>

                    <div className="mobile-stack" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', marginBottom: '6rem' }}>
                        <a href="#quiz" className="premium-btn" style={{ padding: '1.2rem 3rem', fontSize: '1rem' }}>
                            Encontrar mi especialista <ArrowRight size={20} />
                        </a>
                        <a href="/terapeutas" className="secondary-btn" style={{ padding: '1.2rem 3rem' }}>Directorio completo</a>
                    </div>
                </div>
            </section>

            {/* Interactive Quiz Section */}
            <section id="quiz" style={{ padding: '4rem 8% 8rem' }}>
                <MatchingQuiz />
            </section>

            {/* How it Works Journey */}
            <HowItWorks />

            {/* Expert Values / Philosophy */}
            <section style={{ padding: '8rem 8%', backgroundColor: 'var(--bg-serene)' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Por qué elegir Psicólogos <span style={{ fontStyle: 'italic' }}>Ahora</span></h2>
                    <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--accent)', margin: '0 auto' }}></div>
                </div>

                <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                    <div className="animate-fade" style={{ textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <Heart style={{ color: 'var(--accent)' }} size={28} />
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Cuidado Personalizado</h3>
                        <p style={{ color: 'var(--text-soft)' }}>Cada proceso es único. Diseñamos un camino terapéutico adaptado exclusivamente a tu historia y necesidades.</p>
                    </div>

                    <div className="animate-fade" style={{ textAlign: 'center', animationDelay: '0.2s' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <Star style={{ color: 'var(--accent)' }} size={28} />
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Autoridad Clínica</h3>
                        <p style={{ color: 'var(--text-soft)' }}>Contamos con un equipo de especialistas con formación continua y años de trayectoria en diversas escuelas clínicas.</p>
                    </div>

                    <div className="animate-fade" style={{ textAlign: 'center', animationDelay: '0.4s' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <Leaf style={{ color: 'var(--accent)' }} size={28} />
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Entorno de Paz</h3>
                        <p style={{ color: 'var(--text-soft)' }}>Nuestra plataforma está diseñada para ser un refugio digital donde la tecnología facilita la conexión humana profunda.</p>
                    </div>
                </div>
            </section>

            {/* Narrative Section */}
            <section className="mobile-grid-1" style={{ padding: '8rem 8%', background: 'var(--accent-light)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '3rem', marginBottom: '2rem', lineHeight: '1.2' }}>Ciencia y Empatía en <span style={{ fontStyle: 'italic' }}>armonía</span>.</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-soft)', marginBottom: '2rem' }}>
                        Creemos que la terapia efectiva nace de la unión entre el rigor científico y la calidez humana. En Psicólogos Ahora, no solo encuentras un terapeuta, encuentras un guía experto en el laberinto de la mente.
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '20px', height: '1px', backgroundColor: 'var(--primary)' }}></div>
                            <span>Protocolos éticos de estándar internacional</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '20px', height: '1px', backgroundColor: 'var(--primary)' }}></div>
                            <span>Sesiones seguras y privadas de alta fidelidad</span>
                        </li>
                    </ul>
                    <a href="/terapeutas" className="premium-btn">Conoce a nuestro equipo</a>
                </div>
                <div className="hide-on-mobile" style={{
                    position: 'relative',
                    height: '500px',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)',
                    background: 'linear-gradient(45deg, #e8e2d6, #f5f2ed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        border: '1px solid rgba(45, 62, 64, 0.1)',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            width: '240px',
                            height: '240px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(125, 143, 105, 0.1)',
                            animation: 'pulse 4s infinite ease-in-out'
                        }}></div>
                    </div>
                </div>
            </section>
        </div>
    );
}
