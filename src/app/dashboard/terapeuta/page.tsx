"use client";
import { useState, useEffect } from "react";
import { User, TrendingUp, Calendar, Users, Clock, ArrowUpRight, ArrowDownRight, CheckCircle, XCircle, RefreshCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TherapistDashboard() {
    const [activeTab, setActiveTab] = useState("pacientes");
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeads = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('pacientes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching leads from Supabase:", error.message);
            // Mock fallback
            const local = JSON.parse(localStorage.getItem("leads_backup") || "[]");
            setLeads(local);
        } else {
            setLeads(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const updateStatus = async (id: number, status: string) => {
        const { error } = await supabase
            .from('pacientes')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error("Error updating status:", error.message);
        } else {
            fetchLeads();
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <div style={{ display: 'flex' }}>
                {/* Sidebar */}
                <aside style={{ width: '280px', backgroundColor: 'var(--primary)', color: '#fff', padding: '3rem 1.5rem', height: '100vh', position: 'sticky', top: 0 }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
                        Psicólogos Ahora
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button
                            onClick={() => setActiveTab("pacientes")}
                            style={{ padding: '1rem', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', color: activeTab === "pacientes" ? '#fff' : '#rgba(255,255,255,0.6)', backgroundColor: activeTab === "pacientes" ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                        >
                            <Users size={20} /> Pacientes
                        </button>
                        <button
                            onClick={() => setActiveTab("metricas")}
                            style={{ padding: '1rem', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', color: activeTab === "metricas" ? '#fff' : '#rgba(255,255,255,0.6)', backgroundColor: activeTab === "metricas" ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                        >
                            <TrendingUp size={20} /> Métricas
                        </button>
                        <button
                            onClick={() => setActiveTab("agenda")}
                            style={{ padding: '1rem', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', color: activeTab === "agenda" ? '#fff' : '#rgba(255,255,255,0.6)', backgroundColor: activeTab === "agenda" ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                        >
                            <Calendar size={20} /> Mi Agenda
                        </button>
                    </nav>

                    <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User color="var(--primary)" size={18} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Dr. Roberto Bolton</p>
                                <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Terapeuta Senior</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, padding: '4rem 5% 8rem' }}>

                    {activeTab === "pacientes" && (
                        <div className="animate-fade">
                            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Gestión de Pacientes</h1>
                                    <p style={{ color: 'var(--text-soft)' }}>Historial de reservas y seguimiento de contactos.</p>
                                </div>
                                <button onClick={fetchLeads} className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Actualizar
                                </button>
                            </header>

                            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                {loading ? (
                                    <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando datos...</p>
                                ) : leads.length === 0 ? (
                                    <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-soft)' }}>Aún no hay pacientes registrados.</p>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 1rem' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', color: 'var(--text-soft)', fontSize: '0.9rem' }}>
                                                <th style={{ padding: '1rem' }}>PACIENTE</th>
                                                <th style={{ padding: '1rem' }}>FECHA</th>
                                                <th style={{ padding: '1rem' }}>ESTADO</th>
                                                <th style={{ padding: '1rem' }}>ACCIONES</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leads.map(lead => (
                                                <tr key={lead.id} style={{ backgroundColor: '#fafafa', borderRadius: '12px' }}>
                                                    <td style={{ padding: '1.5rem', fontWeight: '600', borderRadius: '12px 0 0 12px' }}>
                                                        {lead.name}
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: '400' }}>{lead.phone}</p>
                                                    </td>
                                                    <td style={{ padding: '1.5rem' }}>{new Date(lead.created_at || Date.now()).toLocaleDateString()}</td>
                                                    <td style={{ padding: '1.5rem' }}>
                                                        <span style={{
                                                            padding: '0.4rem 1rem',
                                                            borderRadius: '50px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700',
                                                            backgroundColor: lead.status === 'Pendiente' ? '#fff3cd' : lead.status === 'Paciente' ? '#d1e7dd' : '#f8d7da',
                                                            color: lead.status === 'Pendiente' ? '#856404' : lead.status === 'Paciente' ? '#0f5132' : '#842029'
                                                        }}>
                                                            {lead.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1.5rem', borderRadius: '0 12px 12px 0' }}>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button onClick={() => updateStatus(lead.id, 'Paciente')} title="Marcar como Paciente" style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#198754' }}><CheckCircle size={20} /></button>
                                                            <button onClick={() => updateStatus(lead.id, 'Perdido')} title="Marcar como Perdido" style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc3545' }}><XCircle size={20} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "metricas" && (
                        <div className="animate-fade">
                            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Tus Métricas</h1>
                                    <p style={{ color: 'var(--text-soft)' }}>Análisis de rendimiento y conversión.</p>
                                </div>
                                <select style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '0.9rem' }}>
                                    <option>Últimos 30 días</option>
                                    <option>Este año</option>
                                    <option>Histórico</option>
                                </select>
                            </header>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                                <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                    <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '1rem' }}>Leads Totales</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <h2 style={{ fontSize: '2.5rem' }}>{leads.length}</h2>
                                        <span style={{ color: '#198754', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem', fontWeight: '700' }}>
                                            <ArrowUpRight size={14} /> +{Math.round(leads.length * 0.1)}%
                                        </span>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '2px solid var(--accent-light)' }}>
                                    <div style={{ padding: '1rem' }}>
                                        <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '1rem' }}>Pendientes</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <h2 style={{ fontSize: '2.5rem' }}>{leads.filter(l => l.status === 'Pendiente').length}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                    <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '1rem' }}>Pacientes Reales</p>
                                    <h2 style={{ fontSize: '2.5rem' }}>{leads.filter(l => l.status === 'Paciente').length}</h2>
                                </div>
                            </div>

                            <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-soft)', marginBottom: '2rem' }}>Visualización de tendencia de visitas semanales</p>
                                <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '1.5rem', justifyContent: 'center' }}>
                                    {[40, 60, 45, 90, 65, 80, 55].map((h, i) => (
                                        <div key={i} style={{ width: '40px', height: `${h}%`, backgroundColor: i === 3 ? 'var(--accent)' : 'var(--primary-muted)', borderRadius: '8px 8px 0 0', opacity: 0.8 }}></div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem', color: 'var(--text-soft)', fontSize: '0.75rem' }}>
                                    {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(d => <span key={d}>{d}</span>)}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "agenda" && (
                        <div className="animate-fade">
                            <header style={{ marginBottom: '3rem' }}>
                                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Mi Agenda</h1>
                                <p style={{ color: 'var(--text-soft)' }}>Configura tus bloques de disponibilidad para el calendario público.</p>
                            </header>

                            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
                                    {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map(day => (
                                        <div key={day} style={{ textAlign: 'center' }}>
                                            <p style={{ fontWeight: '700', marginBottom: '1rem', color: 'var(--primary)' }}>{day}</p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {['09:00', '11:00', '15:00', '17:00'].map(t => (
                                                    <button key={t} style={{ padding: '0.6rem', border: '1px solid #eee', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', backgroundColor: Math.random() > 0.4 ? 'var(--accent-light)' : '#fff' }}>
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '3rem', textAlign: 'right' }}>
                                    <button className="premium-btn">Guardar Disponibilidad</button>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
