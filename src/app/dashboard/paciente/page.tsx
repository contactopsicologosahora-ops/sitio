"use client";
import { useState } from "react";
import { Calendar, Clock, Activity, Video, Info, Sparkles, Frown, Meh, Smile } from "lucide-react";
import Link from "next/link";

export default function PacienteDashboard() {
    const [mood, setMood] = useState<string | null>(null);

    return (
        <div className="animate-fade" style={{ padding: '6rem 8% 10rem', backgroundColor: 'var(--bg-serene)', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Micro-Onboarding Emocional (Check-in) */}
                {!mood ? (
                    <div className="glass-morphism" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Hola Claudio, ¿Cómo está tu energía hoy?</h2>
                        <p style={{ color: 'var(--text-soft)', marginBottom: '2rem' }}>Tómate un segundo para reconocer cómo te sientes antes de continuar.</p>

                        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                            <button onClick={() => setMood("low")} className="expert-card" style={{ padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #eee', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <Frown size={48} color="#e74c3c" />
                                <span style={{ fontWeight: '500', color: 'var(--text-soft)' }}>Baja</span>
                            </button>
                            <button onClick={() => setMood("neutral")} className="expert-card" style={{ padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #eee', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <Meh size={48} color="#f1c40f" />
                                <span style={{ fontWeight: '500', color: 'var(--text-soft)' }}>Regular</span>
                            </button>
                            <button onClick={() => setMood("good")} className="expert-card" style={{ padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #eee', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <Smile size={48} color="#2ecc71" />
                                <span style={{ fontWeight: '500', color: 'var(--text-soft)' }}>Buena</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade" style={{ padding: '1.5rem 2rem', backgroundColor: '#e8f5e9', borderRadius: 'var(--radius-md)', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Info size={24} color="#2ecc71" />
                        <p style={{ color: '#27ae60', margin: 0, fontWeight: '500' }}>Gracias por registrarte. Es completamente válido sentirte así. Aquí tienes tu espacio seguro.</p>
                    </div>
                )}

                <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem' }}>
                    {/* Main Content Area */}
                    <div>

                        {/* 5. Post-Session Cross-Sell */}
                        <div style={{ marginBottom: '3rem', backgroundColor: '#fff', borderLeft: '4px solid var(--primary)', padding: '1.5rem', borderRadius: '0 var(--radius-md) var(--radius-md) 0', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ padding: '0.5rem', backgroundColor: '#f0f4f8', borderRadius: '50%' }}>
                                    <Info size={24} color="var(--primary)" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Sobre tu última sesión...</h3>
                                    <p style={{ color: 'var(--text-soft)', marginBottom: '1rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                        Tu terapeuta sugirió que trabajar en la <strong>comunicación asertiva</strong> será clave para esta semana. Hemos desbloqueado un módulo especial para ti.
                                    </p>
                                    <button className="secondary-btn" style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}>
                                        Leer Módulo Recomendado
                                    </button>
                                </div>
                            </div>
                        </div>

                        <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: 'var(--primary)' }}>Tu Próxima Sesión</h2>

                        <div className="glass-morphism" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', backgroundImage: 'url(https://api.dicebear.com/7.x/avataaars/svg?seed=Esteban)', backgroundSize: 'cover' }}></div>
                                <div>
                                    <h3 style={{ fontSize: '1.4rem' }}>Ps. Esteban Cancino</h3>
                                    <p style={{ color: 'var(--text-soft)' }}>Psicoterapia Individual</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ padding: '1rem', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Calendar size={20} color="var(--accent)" />
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', margin: 0 }}>Fecha</p>
                                        <p style={{ fontWeight: '600', margin: 0 }}>Martes, 15 de Marzo</p>
                                    </div>
                                </div>
                                <div style={{ padding: '1rem', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Clock size={20} color="var(--accent)" />
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', margin: 0 }}>Hora</p>
                                        <p style={{ fontWeight: '600', margin: 0 }}>18:00 hrs</p>
                                    </div>
                                </div>
                            </div>

                            <button className="premium-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                <Video size={20} /> Ingresar al Box Virtual
                            </button>
                        </div>
                    </div>

                    {/* Sidebar / Marketplace Orgánico */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Botiquín Emocional</h3>

                        {/* Freemium Tool 1 */}
                        <div className="expert-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--accent)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                                <div style={{ padding: '0.5rem', backgroundColor: 'var(--accent-light)', borderRadius: '8px' }}>
                                    <Sparkles size={18} color="var(--accent)" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1rem' }}>Simulador de Diálogos</h4>
                                    <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: '700' }}>Recomendado por tu terapeuta</span>
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                Practica esa conversación difícil con nuestra IA adaptativa antes de tenerla.
                            </p>

                            <div style={{ backgroundColor: '#f0efeb', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>🎁 Tienes 1 prueba gratuita disponible</span>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="premium-btn" style={{ flex: 2, padding: '0.8rem', fontSize: '0.85rem', justifyContent: 'center' }}>Probar Gratis</button>
                            </div>
                        </div>

                        {/* Freemium Tool 2 (Locked/Subscribed) */}
                        <div className="expert-card" style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', opacity: 0.9 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                                <div style={{ padding: '0.5rem', backgroundColor: '#eee', borderRadius: '8px' }}>
                                    <Activity size={18} color="var(--text-soft)" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1rem', color: 'var(--text-soft)' }}>Santuario Cognitivo</h4>
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                Diario guiado por IA para identificar pensamientos automáticos (Requiere suscripción).
                            </p>
                            <button style={{
                                width: '100%', padding: '0.8rem', backgroundColor: '#fff', border: '1px solid #ddd',
                                borderRadius: '50px', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem'
                            }}>
                                Desbloquear (Mensualidad)
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
