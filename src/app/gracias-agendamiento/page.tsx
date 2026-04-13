"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Home } from "lucide-react";
import Link from "next/link";

export default function GraciasAgendamiento() {
    return (
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem' }}>Cargando confirmación...</div>}>
            <GraciasAgendamientoContent />
        </Suspense>
    );
}

function GraciasAgendamientoContent() {
    const searchParams = useSearchParams();
    const therapistId = searchParams.get("therapistId");

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: 'conversion_success',
                conversion_type: 'appointment',
                therapist_id: therapistId,
                timestamp: new Date().toISOString()
            });
        }
    }, [therapistId]);

    return (
        <div className="animate-fade" style={{ backgroundColor: 'var(--bg-serene)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-morphism" style={{ maxWidth: '700px', width: '100%', padding: '5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                    <CheckCircle2 size={48} color="#27ae60" />
                </div>

                <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>¡Reserva Confirmada!</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-soft)', marginBottom: '3.5rem', lineHeight: '1.6' }}>
                    Tu sesión ha sido agendada con éxito. Hemos enviado los detalles a tu correo electrónico y pronto el especialista se pondrá en contacto contigo para tu primera sesión.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                        <Link href="/" className="premium-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.2rem 2rem' }}>
                            <Home size={20} /> Volver al Inicio
                        </Link>
                    </div>
                </div>

                <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
                    <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>
                        ¿Tienes alguna duda urgente? <a href="#" style={{ color: 'var(--accent)', fontWeight: '600' }}>Contáctanos por WhatsApp</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
