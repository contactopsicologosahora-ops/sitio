"use client";
import { useState } from "react";
import { ShieldAlert, BarChart3, PieChart, Users, ArrowUpRight, MessageCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

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

    const handleSendWhatsApp = (phone: string, name: string) => {
        alert(`Simulando envío de mensaje de confirmación por WhatsApp a ${name} (${phone})...`);
    }

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
                <p style={{ color: 'var(--text-light)' }}>Métricas de rendimiento y conversión del centro basadas en los KPIs del Agente Socio.</p>
            </header>

            {/* Global Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="premium-card" style={{ borderLeft: '5px solid var(--accent)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Visitas /terapeutas</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <h2 style={{ margin: 0 }}>45,280</h2>
                        <span style={{ color: '#27ae60', fontSize: '0.8rem', fontWeight: 'bold' }}>+12% <ArrowUpRight size={14} /></span>
                    </div>
                </div>
                <div className="premium-card" style={{ borderLeft: '5px solid #3498db' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Clics "Reservar"</p>
                    <h2 style={{ margin: 0 }}>6,792</h2>
                </div>
                <div className="premium-card" style={{ borderLeft: '5px solid #f1c40f' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Leads Teléfono (Paso 4)</p>
                    <h2 style={{ margin: 0 }}>842</h2>
                </div>
                <div className="premium-card" style={{ borderLeft: '5px solid #2ecc71' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Agendamiento Real</p>
                    <h2 style={{ margin: 0 }}>210</h2>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* 1. Panel de Conversión del Embudo */}
                <div className="premium-card" style={{ background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0 }}>1. Análisis del Embudo (Funnel)</h3>
                        <PieChart size={20} color="var(--primary)" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', height: '100%', paddingBottom: '2rem' }}>

                        {/* Step 1 */}
                        <div style={{ backgroundColor: 'var(--primary)', color: '#fff', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Paso 1: Visitas al Directorio</p>
                                <h4 style={{ margin: 0, fontSize: '1.4rem' }}>45,280 usuarios</h4>
                            </div>
                            <b style={{ fontSize: '1.2rem' }}>100%</b>
                        </div>

                        {/* Dropoff Arrow */}
                        <div style={{ textAlign: 'center', color: '#e74c3c', fontSize: '0.85rem', fontWeight: '600' }}>
                            ↓ Pierdes el 85% del tráfico aquí (38,488 usuarios)
                        </div>

                        {/* Step 2 */}
                        <div style={{ backgroundColor: 'rgba(45, 62, 64, 0.8)', color: '#fff', padding: '1.2rem 1.5rem', borderRadius: '12px', width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Paso 2: Clic "Reservar Ahora"</p>
                                <h4 style={{ margin: 0, fontSize: '1.2rem' }}>6,792 usuarios</h4>
                            </div>
                            <b style={{ fontSize: '1.2rem' }}>15.0%</b>
                        </div>

                        {/* Dropoff Arrow */}
                        <div style={{ textAlign: 'center', color: '#e74c3c', fontSize: '0.85rem', fontWeight: '600' }}>
                            ↓ Pierdes el 87% de los interesados (5,950 usuarios)
                        </div>

                        {/* Step 3 */}
                        <div style={{ backgroundColor: 'rgba(45, 62, 64, 0.6)', color: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', width: '80%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Paso 3: Lead Generado</p>
                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>842 usuarios</h4>
                            </div>
                            <b style={{ fontSize: '1.2rem' }}>1.8%</b>
                        </div>

                        {/* Dropoff Arrow */}
                        <div style={{ textAlign: 'center', color: '#e74c3c', fontSize: '0.85rem', fontWeight: '600' }}>
                            ↓ Pierdes el 75% aquí por disponibilidad/precios
                        </div>

                        {/* Step 4 */}
                        <div style={{ backgroundColor: 'var(--accent)', color: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', width: '70%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Paso 4: Agendamiento Real</p>
                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>210 usuarios</h4>
                            </div>
                            <b style={{ fontSize: '1.2rem' }}>0.46%</b>
                        </div>

                    </div>
                    <div style={{ marginTop: '-2rem', textAlign: 'center', backgroundColor: '#fff', position: 'relative', zIndex: 10, padding: '1rem 0' }}>
                        <button className="secondary-btn">Exportar Reporte Mensual</button>
                    </div>
                </div>

                {/* 4. Automatización Anti No-Show */}
                <div className="premium-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0 }}>4. Control Anti No-Show</h3>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: 0 }}>Alertas a 24 horas de la sesión</p>
                        </div>
                        <AlertTriangle size={24} color="#f39c12" />
                    </div>

                    <div style={{ padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeeba', color: '#856404', marginBottom: '2rem', fontSize: '0.9rem' }}>
                        <strong>KPI:</strong> Tasa de inasistencia actual: <strong>14.2%</strong>. El impacto mensual en revenue perdido es de $850.000. Utilice la automatización para reducirlo al &lt;5%.
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Paciente 1 */}
                        <div style={{ padding: '1.2rem', border: '1px solid #eee', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                            <div>
                                <h4 style={{ margin: '0 0 0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Carlos M. <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', backgroundColor: '#ffeaa7', borderRadius: '4px', color: '#d35400' }}>Pendiente Confirmación</span>
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Mañana 15:00 hrs con Ps. Esteban Cancino</p>
                            </div>
                            <button onClick={() => handleSendWhatsApp('+56912345678', 'Carlos M.')} className="secondary-btn" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#27ae60', borderColor: '#27ae60' }}>
                                <MessageCircle size={16} /> Enviar Recordatorio Automático
                            </button>
                        </div>

                        {/* Paciente 2 */}
                        <div style={{ padding: '1.2rem', border: '1px solid #eee', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                            <div>
                                <h4 style={{ margin: '0 0 0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Laura R. <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', backgroundColor: '#e8f5e9', borderRadius: '4px', color: '#27ae60' }}>Confirmado por IA</span>
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Mañana 16:30 hrs con Ps. Esteban Cancino</p>
                            </div>
                            <div style={{ color: '#27ae60' }}>
                                <CheckCircle2 size={24} />
                            </div>
                        </div>

                        {/* Paciente 3 */}
                        <div style={{ padding: '1.2rem', border: '1px solid #eee', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                            <div>
                                <h4 style={{ margin: '0 0 0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Fernando T. <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', backgroundColor: '#ffcccc', borderRadius: '4px', color: '#c0392b' }}>No responde (24h)</span>
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Mañana 09:00 hrs con Ps. Paola Arriagada</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="secondary-btn" style={{ fontSize: '0.85rem', color: '#c0392b', borderColor: '#c0392b' }}>
                                    Liberar Hora
                                </button>
                                <button onClick={() => handleSendWhatsApp('+56987654321', 'Fernando T.')} className="secondary-btn" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#27ae60', borderColor: '#27ae60' }}>
                                    <MessageCircle size={16} /> Contactar
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
