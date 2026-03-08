"use client";
import { useState } from "react";
import { ArrowLeft, Star, ShieldCheck, Mail, MapPin, Award, BookOpen, Quote, X } from "lucide-react";
import BookingFlow from "@/components/BookingFlow";
import Link from "next/link";

const TERAPEUTAS = [
    {
        id: 1,
        name: "Ps. Esteban Cancino Ancalipe",
        email: "esteban.cancino@psicologosahora.cl",
        title: "Psicoterapia para Adultos",
        specialty: "Ansiedad, Depresión, Estrés, Angustia",
        price: "$35.000 / Individual",
        school: "Universidad de Chile",
        bio: "Especialista en el tratamiento de trastornos del ánimo y ansiedad con un enfoque empático y centrado en el paciente. Mi objetivo es proporcionar un espacio seguro donde puedas explorar tus desafíos y desarrollar herramientas para una vida más equilibrada.",
        quote: "La salud mental no es una meta, sino un proceso constante de autocuidado.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Esteban"
    },
    {
        id: 2,
        name: "Ps. Paola Arriagada",
        email: "paola.arriagada@psicologosahora.cl",
        title: "Psicoterapia para Adultos",
        specialty: "Ansiedad, Depresión, Estrés, Angustia",
        price: "$35.000 / Individual - $45.000 / Pareja",
        school: "Universidad Diego Portales",
        bio: "Experta en terapia individual y de pareja, con amplia trayectoria en el manejo de crisis y duelos. Utilizo técnicas de vanguardia para ayudar a mis pacientes a recuperar su bienestar emocional.",
        quote: "El primer paso para el cambio es la aceptación consciente.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paola"
    },
    {
        id: 3,
        name: "Ps. Manuel Erlandsen Muscio",
        email: "manuel.erlandsen@psicologosahora.cl",
        title: "Psicoterapia para Adultos",
        specialty: "Trastornos del ánimo, Neurodivergencias",
        price: "$35.000 / Individual",
        school: "Pontificia Universidad Católica",
        bio: "Dedicado al acompañamiento de pacientes con neurodivergencias y trastornos complejos del ánimo. Mi enfoque es integrativo y adaptado a las necesidades únicas de cada persona.",
        quote: "Cada mente es un universo con sus propias leyes y ritmos.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manuel"
    },
    {
        id: 4,
        name: "Ps. Oliver Arancibia López",
        email: "oliver.arancibia@psicologosahora.cl",
        title: "Psicoterapia para Adultos",
        specialty: "Ansiedad generalizada, Problemas de pareja",
        price: "$40.000 / Individual",
        school: "Universidad Adolfo Ibáñez",
        bio: "Especializado en dinámicas de pareja y trastornos de ansiedad. Ayudo a las personas a mejorar su comunicación y resolver conflictos desde una perspectiva sistémica.",
        quote: "Las relaciones son el espejo donde mejor nos conocemos.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver"
    },
    {
        id: 5,
        name: "Ps. Francisca Pino Aragón",
        email: "francisca.pino@psicologosahora.cl",
        title: "Psicoterapia para Adultos",
        specialty: "Estrés, Ansiedad social, Manejo de la ira",
        price: "$35.000 / Individual",
        school: "Universidad Central",
        bio: "Enfocada en el manejo del estrés moderno y la ansiedad social. Proporciono estrategias prácticas para el control de impulsos y la mejora de la inteligencia emocional.",
        quote: "La calma es una habilidad que se entrena día a día.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Francisca"
    },
    {
        id: 6,
        name: "Ps. Juan Rojas Pardo",
        email: "juan.rojas@psicologosahora.cl",
        title: "Psicoterapia para Adultos",
        specialty: "Depresión, Ansiedad, Relaciones conflictivas",
        price: "$45.000 / Individual - $55.000 / Pareja",
        school: "Universidad de Santiago",
        bio: "Terapeuta con vasta experiencia en casos de depresión severa e ideación suicida. Mi compromiso es el acompañamiento profundo para encontrar nuevamente el sentido y la esperanza.",
        quote: "Incluso en el invierno más oscuro, existe un sol interno.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan"
    },
    {
        id: 7,
        name: "Ps. Marlene Calvete Chavarría",
        email: "marlene.calvete@psicologosahora.cl",
        title: "Psicoterapia para Adultos",
        specialty: "Trastornos de Conducta Alimentaria, Depresión",
        price: "$35.000 / Individual",
        school: "Universidad Mayor",
        bio: "Especialista en TCA y trastornos de la personalidad. Mi trabajo se centra en la reconciliación con la imagen corporal y el fortalecimiento del autoestima.",
        quote: "Amarse a uno mismo es el inicio de un romance que dura toda la vida.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marlene"
    },
    {
        id: 8,
        name: "Ps. Verónica Cuadra Valenzuela",
        email: "veronica.cuadra@psicologosahora.cl",
        title: "Psicoterapia para Adultos",
        specialty: "Estrés, Ansiedad social, Pareja",
        price: "$35.000 / Individual",
        school: "Universidad de Concepción",
        bio: "Psicoterapeuta dedicada a la salud mental integral con énfasis en el equilibrio entre vida laboral y personal. Experta en manejo de crisis de pareja.",
        quote: "El bienestar es el resultado de nuestras decisiones conscientes.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Veronica"
    }
];

export default function TerapeutaProfile({ params }: { params: { id: string } }) {
    const [showBooking, setShowBooking] = useState(false);

    // Find the real therapist by ID
    const t = TERAPEUTAS.find(item => item.id === parseInt(params.id)) || TERAPEUTAS[0];

    return (
        <div className="animate-fade" style={{ backgroundColor: 'var(--bg-serene)', minHeight: '100vh' }}>
            <header style={{ padding: '2rem 8%', display: 'flex', alignItems: 'center' }}>
                <Link href="/terapeutas" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-soft)', fontWeight: '500' }}>
                    <ArrowLeft size={18} /> Volver al equipo
                </Link>
            </header>

            <div style={{ padding: '0 8% 8rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6rem' }}>
                {/* Left Content */}
                <div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Perfil Especialista</span>
                    <h1 style={{ fontSize: '3.5rem', margin: '1rem 0', fontWeight: '400' }}>{t.name}</h1>
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
                        <p style={{ color: 'var(--text-soft)', marginBottom: '2rem' }}>Reserva tu primera sesión de evaluación con {t.name.split(" ")[1]} hoy mismo.</p>
                        <button onClick={() => setShowBooking(true)} className="premium-btn" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem' }}>
                            Consultar Disponibilidad
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Reserva */}
            {showBooking && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(45, 62, 64, 0.6)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(8px)'
                }}>
                    <BookingFlow
                        therapist={t}
                        onClose={() => setShowBooking(false)}
                    />
                </div>
            )}
        </div>
    );
}

