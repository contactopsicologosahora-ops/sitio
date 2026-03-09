"use client";
import { useState, useEffect } from "react";
import { User, TrendingUp, Calendar, Users, Clock, ArrowUpRight, ArrowDownRight, CheckCircle, XCircle, RefreshCcw, Stethoscope, MessageSquare, ShieldAlert, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function TherapistDashboard() {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [activeTab, setActiveTab] = useState("pacientes");
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [availability, setAvailability] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [userName, setUserName] = useState("");
    const [terapeutaData, setTerapeutaData] = useState<any>(null);
    const [perfilError, setPerfilError] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("user_role");
        const name = localStorage.getItem("user_name");
        if (!role) {
            router.push("/login");
        } else {
            setAuthorized(true);
            setUserName(name || "Especialista");
            fetchTerapeutaData();
        }
    }, []);

    const fetchTerapeutaData = async () => {
        const tId = localStorage.getItem('therapist_id');
        const userEmail = localStorage.getItem('user_email');
        setPerfilError(false);

        // Estrategia 1: buscar por ID numérico
        if (tId) {
            const { data, error } = await supabase
                .from('terapeutas')
                .select('*')
                .eq('id', parseInt(tId))
                .single();

            if (data && !error) {
                setTerapeutaData(data);
                return;
            }
        }

        // Estrategia 2: buscar por email guardado en localStorage
        if (userEmail) {
            const { data, error } = await supabase
                .from('terapeutas')
                .select('*')
                .eq('email', userEmail)
                .single();

            if (data && !error) {
                setTerapeutaData(data);
                // Actualizar el therapist_id con el ID real de Supabase
                localStorage.setItem('therapist_id', data.id.toString());
                return;
            }
        }

        // Si no se encontró por ningún método, marcar error
        setPerfilError(true);
    };

    const handleLogout = async () => {
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_email");
        localStorage.removeItem("therapist_id");
        await supabase.auth.signOut();
        router.push("/login");
    };

    const fetchLeads = async () => {
        setLoading(true);
        const tId = localStorage.getItem('therapist_id');

        let query = supabase
            .from('pacientes')
            .select('*')
            .order('created_at', { ascending: false });

        if (tId) {
            query = query.eq('therapist_id', parseInt(tId));
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching leads from Supabase:", error.message);
            const local = JSON.parse(localStorage.getItem("leads_backup") || "[]");
            setLeads(local);
        } else {
            setLeads(data || []);
        }
        setLoading(false);
    };

    const updatePatientEmail = async (id: string, email: string) => {
        const { error } = await supabase
            .from('pacientes')
            .update({ email })
            .eq('id', id);

        if (error) {
            alert('Error guardando el correo: ' + error.message);
        } else {
            setLeads(leads.map(l => l.id === id ? { ...l, email } : l));
        }
    };

    const fetchAvailability = async () => {
        const tId = localStorage.getItem('therapist_id') || '1';
        const { data, error } = await supabase
            .from('disponibilidad')
            .select('*')
            .eq('therapist_id', parseInt(tId));

        if (!error && data) {
            const availMap: any = {};
            data.forEach((item: any) => {
                if (!availMap[item.day]) availMap[item.day] = [];
                availMap[item.day].push(item.hour);
            });
            setAvailability(availMap);
        }
    };

    useEffect(() => {
        if (authorized) {
            fetchLeads();
            fetchAvailability();
        }
    }, [authorized]);

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

    const toggleHour = (day: string, hour: string) => {
        const currentDay = availability[day] || [];
        const newDay = currentDay.includes(hour)
            ? currentDay.filter((h: string) => h !== hour)
            : [...currentDay, hour];

        setAvailability({
            ...availability,
            [day]: newDay
        });
    };

    const saveAvailability = async () => {
        setSaving(true);
        const tId = localStorage.getItem('therapist_id') || '1';

        // Delete previous to update
        await supabase.from('disponibilidad').delete().eq('therapist_id', parseInt(tId));

        const records = [];
        for (const day in availability) {
            for (const hour of availability[day]) {
                records.push({ therapist_id: parseInt(tId), day, hour });
            }
        }

        const { error } = await supabase.from('disponibilidad').insert(records);

        if (error) {
            alert("Error al guardar: " + error.message);
        } else {
            alert("¡Disponibilidad actualizada en Supabase!");
        }
        setSaving(false);
    };

    const handlePanicButton = async () => {
        if (!confirm("¿Estás seguro que deseas activar el Botón de Pánico Académico? Esto enviará una alerta inmediata a los supervisores clínicos (cfernandez.bolton@gmail.com, juanrojaspardo@gmail.com).")) {
            return;
        }

        const btn = document.getElementById("panic-btn");
        if (btn) btn.innerText = "Enviando alerta...";

        try {
            const res = await fetch('/api/panic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ therapistName: userName })
            });

            if (res.ok) {
                alert("Alerta enviada con éxito. Un supervisor se pondrá en contacto a la brevedad.");
            } else {
                alert("Hubo un error al enviar la alerta. Por favor, contacta directamente por teléfono.");
            }
        } catch (e) {
            alert("Hubo un error de conexión.");
        } finally {
            if (btn) btn.innerHTML = `<span style="display:flex;align-items:center;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square" style="margin-right: 0.5rem;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Solicitar Supervisión de Caso</span>`;
        }
    };

    if (!authorized) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Validando credenciales...</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                padding: '3rem 1.5rem',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 100
            }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
                    Psicólogos Ahora
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                    <button
                        onClick={() => setActiveTab("pacientes")}
                        style={{ padding: '1rem', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', color: activeTab === "pacientes" ? '#fff' : 'rgba(255,255,255,0.6)', backgroundColor: activeTab === "pacientes" ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                    >
                        <Users size={20} /> Pacientes
                    </button>
                    <button
                        onClick={() => setActiveTab("metricas")}
                        style={{ padding: '1rem', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', color: activeTab === "metricas" ? '#fff' : 'rgba(255,255,255,0.6)', backgroundColor: activeTab === "metricas" ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                    >
                        <TrendingUp size={20} /> Métricas
                    </button>
                    <button
                        onClick={() => setActiveTab("agenda")}
                        style={{ padding: '1rem', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', color: activeTab === "agenda" ? '#fff' : 'rgba(255,255,255,0.6)', backgroundColor: activeTab === "agenda" ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                    >
                        <Calendar size={20} /> Mi Agenda
                    </button>
                    <button
                        onClick={() => setActiveTab("comunidad")}
                        style={{ padding: '1rem', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', color: activeTab === "comunidad" ? '#fff' : 'rgba(255,255,255,0.6)', backgroundColor: activeTab === "comunidad" ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                    >
                        <ShieldAlert size={20} /> Peer Assist
                    </button>
                    <button
                        onClick={() => setActiveTab("perfil")}
                        style={{ padding: '1rem', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', color: activeTab === "perfil" ? '#fff' : 'rgba(255,255,255,0.6)', backgroundColor: activeTab === "perfil" ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                    >
                        <User size={20} /> Editar Perfil
                    </button>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User color="#fff" size={18} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: '600', margin: 0, color: '#fff' }}>Ps. {userName}</p>
                            <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: 0, color: '#fff' }}>Psicoterapeuta Online</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            padding: '0.8rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontSize: '0.9rem'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                    >
                        <LogOut size={16} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '4rem 5% 8rem', marginLeft: '280px' }}>

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
                                            <th style={{ padding: '1rem' }}>EMAIL</th>
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
                                                <td style={{ padding: '1.5rem' }}>
                                                    <input
                                                        type="email"
                                                        defaultValue={lead.email || ''}
                                                        placeholder="Añadir correo..."
                                                        onBlur={(e) => updatePatientEmail(lead.id, e.target.value)}
                                                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', width: '100%', outline: 'none' }}
                                                    />
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
                                                        {lead.status === 'Paciente' && (
                                                            <button onClick={() => alert(`Enviando acceso gratuito de la "Farmacia IA" a ${lead.name}...\n(Herramienta: Santuario Cognitivo)`)} title="Prescribir IA" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary)' }}><Stethoscope size={20} /></button>
                                                        )}
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
                                <p style={{ color: 'var(--text-soft)' }}>Análisis de rendimiento y conversión transversal de tu perfil.</p>
                            </div>
                            <select style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '0.9rem' }}>
                                <option value="all">Histórico</option>
                                <option value="today">Hoy</option>
                                <option value="7d">Últimos 7 días</option>
                                <option value="30d">Últimos 30 días</option>
                                <option value="90d">Últimos 3 meses</option>
                                <option value="6m">Últimos 6 meses</option>
                                <option value="year">Este año</option>
                            </select>
                        </header>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '1rem' }}>Impresiones</p>
                                <h2 style={{ fontSize: '2.5rem' }}>{terapeutaData?.impresiones || 0}</h2>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginTop: '0.5rem' }}>Visualizaciones de perfil</p>
                            </div>

                            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '1rem' }}>Clics</p>
                                <h2 style={{ fontSize: '2.5rem' }}>{terapeutaData?.clics || 0}</h2>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginTop: '0.5rem' }}>Clics en "Reservar"</p>
                            </div>

                            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '2px solid var(--accent-light)' }}>
                                <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '1rem' }}>Leads</p>
                                <h2 style={{ fontSize: '2.5rem' }}>{leads.length}</h2>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginTop: '0.5rem' }}>Formularios completados</p>
                            </div>

                            <div style={{ padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', backgroundColor: '#f0fdf4' }}>
                                <p style={{ color: '#166534', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '600' }}>Conversiones</p>
                                <h2 style={{ fontSize: '2.5rem', color: '#15803d' }}>{leads.filter(l => l.status === 'Paciente').length}</h2>
                                <p style={{ fontSize: '0.8rem', color: '#166534', opacity: 0.8, marginTop: '0.5rem' }}>Pacientes confirmados</p>
                            </div>

                            <div style={{ padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', backgroundColor: '#fef2f2' }}>
                                <p style={{ color: '#991b1b', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '600' }}>Perdidos</p>
                                <h2 style={{ fontSize: '2.5rem', color: '#b91c1c' }}>{leads.filter(l => l.status === 'Perdido').length}</h2>
                                <p style={{ fontSize: '0.8rem', color: '#991b1b', opacity: 0.8, marginTop: '0.5rem' }}>Descartados o no asisten</p>
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
                                            {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => toggleHour(day, t)}
                                                    style={{
                                                        padding: '0.6rem',
                                                        border: '1px solid #eee',
                                                        borderRadius: '8px',
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer',
                                                        backgroundColor: availability[day]?.includes(t) ? 'var(--accent)' : '#fff',
                                                        color: availability[day]?.includes(t) ? '#fff' : 'inherit'
                                                    }}>
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '3rem', textAlign: 'right' }}>
                                <button
                                    onClick={saveAvailability}
                                    disabled={saving}
                                    className="premium-btn"
                                >
                                    {saving ? "Guardando..." : "Guardar disponibilidad"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "comunidad" && (
                    <div className="animate-fade">
                        <header style={{ marginBottom: '3rem' }}>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Peer Assist & Supervisión</h1>
                            <p style={{ color: 'var(--text-soft)' }}>Foro clínico anonimizado exclusivo para especialistas verificados de la red.</p>
                        </header>

                        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '50%' }}>
                                    <ShieldAlert size={32} color="#27ae60" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Botón de Pánico Académico</h3>
                                    <p style={{ color: 'var(--text-soft)', lineHeight: 1.6, maxWidth: '600px' }}>
                                        ¿Atascado en un caso complejo? Solicita "Supervisión Flash". Describe la situación anonimizada (sin nombres ni datos identificables) y colegas senior o psiquiatras de nuestra red te dejarán su impresión diagnóstica en menos de 24 horas.
                                    </p>
                                </div>
                            </div>
                            <button id="panic-btn" onClick={handlePanicButton} className="premium-btn" style={{ padding: '1rem 2rem' }}>
                                <MessageSquare size={18} style={{ marginRight: '0.5rem' }} /> Solicitar Supervisión de Caso
                            </button>

                            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '3rem 0' }} />

                            <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-light)' }}>Casos Recientes en Discusión</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '12px', borderLeft: '4px solid #f39c12' }}>
                                    <h5 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Caso #842: Resistencia al encuadre en paciente TLP</h5>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-soft)', marginBottom: '1rem' }}>Paciente de 24 años presenta múltiples crisis durante la semana exigiendo contacto constante...</p>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>
                                        <span>3 Comentarios de Especialistas</span>
                                        <span>• Hace 2 horas</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "perfil" && (
                    <div className="animate-fade">
                        <header style={{ marginBottom: '3rem' }}>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Editar Datos</h1>
                            <p style={{ color: 'var(--text-soft)' }}>Administra tu tarjeta de presentación pública y tu seguridad.</p>
                        </header>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                            {/* Change Password */}
                            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', alignSelf: 'start' }}>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ShieldAlert size={20} color="var(--primary)" /> Seguridad
                                </h3>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    setSaving(true);
                                    const form = e.target as HTMLFormElement;
                                    const pass = (form.elements.namedItem('new_password') as HTMLInputElement).value;
                                    const conf = (form.elements.namedItem('confirm_password') as HTMLInputElement).value;

                                    if (pass !== conf) {
                                        alert("Las contraseñas no coinciden.");
                                        setSaving(false);
                                        return;
                                    }

                                    const { error } = await supabase.auth.updateUser({ password: pass });
                                    if (error) alert("Error: " + error.message);
                                    else {
                                        alert("¡Contraseña Suprema actualizada! \nLa próxima vez usa esta clave para entrar.");
                                        form.reset();
                                    }
                                    setSaving(false);
                                }}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Nueva Contraseña Suprema</label>
                                        <input name="new_password" type="password" required minLength={6} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }} />
                                    </div>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Confirmar Contraseña</label>
                                        <input name="confirm_password" type="password" required minLength={6} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }} />
                                    </div>
                                    <button disabled={saving} type="submit" className="premium-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                        Actualizar Contraseña
                                    </button>
                                </form>
                            </div>

                            {/* Edit Public Profile */}
                            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <User size={20} color="var(--primary)" /> Perfil Público
                                </h3>
                                {terapeutaData ? (
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        setSaving(true);
                                        const form = e.target as HTMLFormElement;

                                        const tagsString = (form.elements.namedItem('tags') as HTMLInputElement).value;
                                        const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

                                        const updates = {
                                            title: (form.elements.namedItem('title') as HTMLInputElement).value,
                                            price: (form.elements.namedItem('price') as HTMLInputElement).value,
                                            specialty: (form.elements.namedItem('specialty') as HTMLInputElement).value,
                                            bio: (form.elements.namedItem('bio') as HTMLTextAreaElement).value,
                                            tags: tagsArray
                                        };

                                        const tId = localStorage.getItem('therapist_id');
                                        const { error } = await supabase.from('terapeutas').update(updates).eq('id', parseInt(tId!));

                                        if (error) alert("Error actualizando perfil: " + error.message);
                                        else {
                                            alert("¡Perfil público actualizado con éxito en /terapeutas!");
                                            fetchTerapeutaData();
                                        }
                                        setSaving(false);
                                    }}>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Subtítulo Profesional</label>
                                            <input name="title" defaultValue={terapeutaData?.title} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }} />
                                        </div>
                                        <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Valor Consulta</label>
                                                <input name="price" defaultValue={terapeutaData?.price} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Tópicos Principales</label>
                                                <input name="specialty" defaultValue={terapeutaData?.specialty} required placeholder="Ej: Ansiedad · Depresión" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }} />
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Tags de Especialidad (Separados por coma)</label>
                                            <input name="tags" defaultValue={Array.isArray(terapeutaData?.tags) ? terapeutaData.tags.join(', ') : terapeutaData?.tags} placeholder="Ansiedad, Autoestima, Adultos Jóvenes" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }} />
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: '0.4rem' }}>Se mostrarán como píldoras en tu tarjeta de perfil.</p>
                                        </div>
                                        <div style={{ marginBottom: '2rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Biografía Pública</label>
                                            <textarea name="bio" defaultValue={terapeutaData?.bio} required rows={5} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', resize: 'vertical' }}></textarea>
                                        </div>
                                        <button disabled={saving} type="submit" className="premium-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                            {saving ? "Guardando..." : "Guardar Cambios Públicos"}
                                        </button>
                                    </form>
                                ) : perfilError ? (
                                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                        <p style={{ color: '#dc3545', marginBottom: '1rem' }}>⚠️ No se encontraron datos de perfil en Supabase.</p>
                                        <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                            Es posible que tu email aún no esté en la tabla de terapeutas.<br />
                                            Contacta al administrador para que registre tu perfil.
                                        </p>
                                        <button onClick={fetchTerapeutaData} className="secondary-btn">Reintentar</button>
                                    </div>
                                ) : (
                                    <p style={{ textAlign: 'center', color: 'var(--text-soft)', padding: '2rem 0' }}>Cargando datos de perfil...</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
