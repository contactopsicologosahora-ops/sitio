"use client";
import { useState } from "react";
import { ShieldAlert, BarChart3, PieChart, Users, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
    const [authorized, setAuthorized] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "BoltonPardo26") {
            setAuthorized(true);
            setError(false);
        } else {
            setError(true);
        }
    };

    if (!authorized) {
        return (
            <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="premium-card" style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                    <ShieldAlert size={48} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
                    <h2>Acceso Administrativo</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-light)' }}>Este panel contiene métricas sensibles del centro.</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', border: `1px solid ${error ? '#e74c3c' : '#ddd'}` }}
                        />
                        {error && <p style={{ color: '#e74c3c', fontSize: '0.8rem', marginBottom: '1rem' }}>Contraseña incorrecta</p>}
                        <button className="premium-btn" style={{ width: '100%' }}>Entrar al Panel</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '3rem 5%', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Panel de Control Global</h1>
                <p style={{ color: 'var(--text-light)' }}>Métricas de rendimiento y conversión del centro.</p>
            </header>

            {/* Global Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="premium-card" style={{ borderLeft: '5px solid var(--accent)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Visitas Totales</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <h2 style={{ margin: 0 }}>45,280</h2>
                        <span style={{ color: '#27ae60', fontSize: '0.8rem', fontWeight: 'bold' }}>+12% <ArrowUpRight size={14} /></span>
                    </div>
                </div>
                <div className="premium-card" style={{ borderLeft: '5px solid #3498db' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Visitas Únicas (Terapeutas)</p>
                    <h2 style={{ margin: 0 }}>12,450</h2>
                </div>
                <div className="premium-card" style={{ borderLeft: '5px solid #2ecc71' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Leads Capturados</p>
                    <h2 style={{ margin: 0 }}>842</h2>
                </div>
                <div className="premium-card" style={{ borderLeft: '5px solid #f1c40f' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Pacientes Reales</p>
                    <h2 style={{ margin: 0 }}>210</h2>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
                {/* Performance by Therapist */}
                <div className="premium-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0 }}>Rendimiento por Profesional</h3>
                        <BarChart3 size={20} color="var(--text-light)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { name: 'Dr. Roberto Bolton', leads: 85, conv: '25%' },
                            { name: 'Dra. Elena Pardo', leads: 42, conv: '31%' },
                            { name: 'Lic. Marcos Sierra', leads: 28, conv: '18%' },
                        ].map(prof => (
                            <div key={prof.name}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>{prof.name}</span>
                                    <span style={{ fontWeight: 'bold' }}>{prof.conv} conv.</span>
                                </div>
                                <div style={{ height: '8px', width: '100%', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: prof.conv, backgroundColor: 'var(--accent)', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Funnel Visualisation */}
                <div className="premium-card" style={{ background: 'var(--primary)', color: '#fff' }}>
                    <h3 style={{ color: '#fff', marginBottom: '2rem' }}>Embudo de Conversión</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
                        <div style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Visitas Lista</p>
                            <h4 style={{ color: '#fff', margin: 0 }}>100%</h4>
                        </div>
                        <div style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', width: '80%', margin: '0 auto' }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Click "Reservar"</p>
                            <h4 style={{ color: '#fff', margin: 0 }}>15%</h4>
                        </div>
                        <div style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', width: '60%', margin: '0 auto' }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Lead Capturado</p>
                            <h4 style={{ color: '#fff', margin: 0 }}>6.8%</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
