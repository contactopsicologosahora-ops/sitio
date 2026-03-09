"use client";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, Home } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function GraciasContent() {
    const searchParams = useSearchParams();
    const therapistId = searchParams.get("therapistId");

    return (
        <div className="animate-fade" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8rem 2rem 4rem',
            backgroundImage: 'url("/gracias-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <div className="glass-morphism" style={{
                maxWidth: '800px',
                width: '100%',
                padding: '5rem 3rem',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid rgba(255,255,255,0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#e8f5e9',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 2.5rem',
                    boxShadow: '0 4px 12px rgba(39, 174, 96, 0.15)'
                }}>
                    <CheckCircle2 size={56} color="#27ae60" />
                </div>

                <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '1.5rem', fontWeight: '400' }}>¡Solicitud Recibida!</h1>

                <div style={{ maxWidth: '600px', margin: '0 auto 4rem' }}>
                    <p style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '1rem', lineHeight: '1.6' }}>
                        Tu camino hacia el bienestar ha comenzado.
                    </p>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-soft)', lineHeight: '1.6' }}>
                        Hemos enviado tus datos al especialista. Recibirás un contacto a la brevedad para confirmar tu primera sesión de evaluación.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '450px', margin: '0 auto' }}>
                    <button className="premium-btn" style={{ padding: '1.3rem', justifyContent: 'center', gap: '1rem', fontSize: '1.1rem', width: '100%' }}>
                        <Calendar size={24} /> Agendar directamente en el calendario
                    </button>

                    <Link href="/" className="secondary-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '1.2rem', textDecoration: 'none' }}>
                        <Home size={20} /> Volver al Inicio
                    </Link>
                </div>

                <div style={{ marginTop: '5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <p style={{ color: 'var(--text-soft)', fontSize: '1rem' }}>
                        ¿Tienes alguna duda urgente? <a href="#" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline' }}>Contáctanos por WhatsApp</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Gracias() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <GraciasContent />
        </Suspense>
    );
}
