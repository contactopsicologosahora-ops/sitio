"use client";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, Home } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function GraciasContent() {
    const searchParams = useSearchParams();
    const therapistId = searchParams.get("therapistId");

    return (
        <div className="animate-fade" style={{ backgroundColor: 'var(--bg-serene)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-morphism" style={{ maxWidth: '700px', width: '100%', padding: '5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                    <CheckCircle2 size={48} color="#27ae60" />
                </div>

                <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>¡Solicitud Recibida!</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-soft)', marginBottom: '3.5rem', lineHeight: '1.6' }}>
                    Hemos enviado tus datos al especialista. Recibirás un contacto a la brevedad para confirmar tu primera sesión.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    <button className="premium-btn" style={{ padding: '1.5rem', justifyContent: 'center', gap: '1rem', fontSize: '1.1rem' }}>
                        <Calendar size={24} /> Agendar directamente en el calendario
                    </button>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                        <Link href="/" className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Home size={18} /> Volver al Inicio
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

export default function Gracias() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <GraciasContent />
        </Suspense>
    );
}
