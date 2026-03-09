"use client";
import { ShieldAlert, BarChart3, PieChart, Users, ArrowUpRight, MessageCircle, AlertTriangle, CheckCircle2, RefreshCcw, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [stats, setStats] = useState({
        totalPacientes: 0,
        pendientes: 0,
        perdidos: 0,
        totalImpresiones: 0,
        totalClics: 0
    });
    const [pacientes, setPacientes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Filtros
    const [timeFilter, setTimeFilter] = useState('all');
    const [therapistFilter, setTherapistFilter] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [terapeutasList, setTerapeutasList] = useState<any[]>([]);

    useEffect(() => {
        const role = localStorage.getItem("user_role");
        if (role !== "admin") {
            router.push("/login");
        } else {
            setAuthorized(true);
        }
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // 0. Cargar lista de terapeutas si no se ha hecho
            if (terapeutasList.length === 0) {
                const { data: allTerapeutas } = await supabase.from('terapeutas').select('id, name');
                if (allTerapeutas) setTerapeutasList(allTerapeutas);
            }

            // 1. Obtener métricas de terapeutas (Impresiones y Clics)
            let therapistQuery = supabase.from('terapeutas').select('impresiones, clics, id');
            if (therapistFilter !== 'all') {
                therapistQuery = therapistQuery.eq('id', therapistFilter);
            }
            const { data: therapistData, error: therapistError } = await therapistQuery;

            let impressionsSum = 0;
            let clicsSum = 0;

            if (!therapistError && therapistData) {
                impressionsSum = therapistData.reduce((acc, curr) => acc + (curr.impresiones || 0), 0);
                clicsSum = therapistData.reduce((acc, curr) => acc + (curr.clics || 0), 0);
            }

            // 2. Obtener datos de pacientes
            let patientQuery = supabase.from('pacientes').select('*, terapeutas(name)').order('created_at', { ascending: false });
            if (therapistFilter !== 'all') {
                patientQuery = patientQuery.eq('terapeuta_id', therapistFilter);
            }
            const { data: patientData, error: patientError } = await patientQuery;

            let filteredPatients = [];
            let totalPacientesCount = 0;
            let pendientesCount = 0;
            let perdidosCount = 0;

            if (!patientError && patientData) {
                // Aplicar filtros de fecha localmente en los pacientes
                const now = new Date();
                filteredPatients = patientData || [];

                if (timeFilter !== 'all') {
                    filteredPatients = filteredPatients.filter(p => {
                        const createdAt = new Date(p.created_at);
                        const diffTime = Math.abs(now.getTime() - createdAt.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        const startOfYesterday = new Date(startOfToday);
                        startOfYesterday.setDate(startOfYesterday.getDate() - 1);

                        switch (timeFilter) {
                            case 'today':
                                return createdAt >= startOfToday;
                            case 'yesterday':
                                return createdAt >= startOfYesterday && createdAt < startOfToday;
                            case '7days':
                                return diffDays <= 7;
                            case '14days':
                                return diffDays <= 14;
                            case '30days':
                                return diffDays <= 30;
                            case 'thisMonth':
                                return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
                            case 'lastMonth':
                                let lastMonth = now.getMonth() - 1;
                                let year = now.getFullYear();
                                if (lastMonth < 0) { lastMonth = 11; year--; }
                                return createdAt.getMonth() === lastMonth && createdAt.getFullYear() === year;
                            case 'thisYear':
                                return createdAt.getFullYear() === now.getFullYear();
                            case 'custom':
                                if (dateRange.start && dateRange.end) {
                                    const startParsed = new Date(dateRange.start + 'T00:00:00');
                                    const endParsed = new Date(dateRange.end + 'T23:59:59');
                                    return createdAt >= startParsed && createdAt <= endParsed;
                                }
                                return true;
                            default:
                                return true;
                        }
                    });
                }

                totalPacientesCount = filteredPatients.filter(d => d.status === 'Paciente').length;
                pendientesCount = filteredPatients.filter(d => d.status === 'Leads' || d.status === 'Pendiente').length;
                perdidosCount = filteredPatients.filter(d => d.status === 'Perdido').length;
            }

            const counts = {
                totalPacientes: totalPacientesCount,
                pendientes: pendientesCount,
                perdidos: perdidosCount,
                totalImpresiones: impressionsSum,
                totalClics: clicsSum
            };
            setStats(counts);
            setPacientes(filteredPatients);
        } catch (err) {
            console.error("Error fetching admin stats:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (authorized) {
            fetchStats();

            // Suscripción Realtime
            const channel = supabase
                .channel('admin-changes')
                .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'pacientes' }, () => {
                    fetchStats();
                })
                .on('postgres_changes' as any, { event: 'UPDATE', schema: 'public', table: 'terapeutas' }, () => {
                    fetchStats();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [authorized, timeFilter, therapistFilter, dateRange.start, dateRange.end]);

    const handleLogout = async () => {
        localStorage.removeItem("user_role");
        await supabase.auth.signOut();
        router.push("/login");
    };

    const handleSendWhatsApp = (phone: string, name: string) => {
        const message = encodeURIComponent(`Hola ${name}, te escribimos de Psicólogos Ahora para confirmar tu sesión. ¿Sigues disponible?`);
        window.open(`https://wa.me/${phone.replace(/\+/g, '')}?text=${message}`, '_blank');
    };

    if (!authorized) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando panel de seguridad...</div>;

    return (
        <div style={{ padding: '3rem 5%', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>Panel de Control Global</h1>
                    <p style={{ color: 'var(--text-light)' }}>Métricas de rendimiento del centro basadas en los KPIs de Supabase.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: '#fff', padding: '0.5rem', borderRadius: '8px', border: '1px solid #eee' }}>
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            style={{ padding: '0.5rem', border: 'none', backgroundColor: 'transparent', outline: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            <option value="all">Todos los tiempos</option>
                            <option value="today">Hoy</option>
                            <option value="yesterday">Ayer</option>
                            <option value="7days">Últimos 7 días</option>
                            <option value="14days">Últimos 14 días</option>
                            <option value="30days">Últimos 30 días</option>
                            <option value="thisMonth">Este mes</option>
                            <option value="lastMonth">Mes anterior</option>
                            <option value="thisYear">Este año</option>
                            <option value="custom">Personalizado</option>
                        </select>
                        {(timeFilter === 'custom') && (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', paddingLeft: '0.5rem', borderLeft: '1px solid #eee' }}>
                                <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} style={{ padding: '0.3rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.8rem' }} />
                                <span>-</span>
                                <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} style={{ padding: '0.3rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.8rem' }} />
                            </div>
                        )}
                        <select
                            value={therapistFilter}
                            onChange={(e) => setTherapistFilter(e.target.value)}
                            style={{ padding: '0.5rem', border: 'none', backgroundColor: 'transparent', outline: 'none', cursor: 'pointer', borderLeft: '1px solid #eee', fontSize: '0.9rem' }}
                        >
                            <option value="all">Todos los Terapeutas</option>
                            {terapeutasList.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <button onClick={fetchStats} className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refrescar
                    </button>
                    <button onClick={handleLogout} className="secondary-btn" style={{ color: '#e74c3c', borderColor: '#e74c3c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LogOut size={16} /> Salir
                    </button>
                </div>
            </header>

            {/* Global Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="premium-card" style={{ borderLeft: '5px solid var(--accent)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Visitas /terapeutas (Impresiones)</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <h2 style={{ margin: 0 }}>{stats.totalImpresiones.toLocaleString()}</h2>
                        <span style={{ color: '#27ae60', fontSize: '0.8rem', fontWeight: 'bold' }}>+12% <ArrowUpRight size={14} /></span>
                    </div>
                </div>
                <div className="premium-card" style={{ borderLeft: '5px solid #3498db' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Clics "Reservar" (Global)</p>
                    <h2 style={{ margin: 0 }}>{stats.totalClics.toLocaleString()}</h2>
                </div>
                <div className="premium-card" style={{ borderLeft: '5px solid #f1c40f' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Leads / Pendientes</p>
                    <h2 style={{ margin: 0 }}>{stats.pendientes}</h2>
                </div>
                <div className="premium-card" style={{ borderLeft: '5px solid #2ecc71' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Agendamiento Real</p>
                    <h2 style={{ margin: 0 }}>{stats.totalPacientes}</h2>
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
                                <h4 style={{ margin: 0, fontSize: '1.4rem' }}>{stats.totalImpresiones.toLocaleString()} usuarios</h4>
                            </div>
                            <b style={{ fontSize: '1.2rem' }}>100%</b>
                        </div>

                        {/* Dropoff Arrow */}
                        <div style={{ textAlign: 'center', color: '#e74c3c', fontSize: '0.85rem', fontWeight: '600' }}>
                            ↓ Pierdes el {stats.totalImpresiones > 0 ? ((1 - stats.totalClics / stats.totalImpresiones) * 100).toFixed(1) : 0}% del tráfico aquí
                        </div>

                        {/* Step 2 */}
                        <div style={{ backgroundColor: 'rgba(45, 62, 64, 0.8)', color: '#fff', padding: '1.2rem 1.5rem', borderRadius: '12px', width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Paso 2: Clic "Reservar Ahora"</p>
                                <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{stats.totalClics.toLocaleString()} usuarios</h4>
                            </div>
                            <b style={{ fontSize: '1.2rem' }}>{stats.totalImpresiones > 0 ? ((stats.totalClics / stats.totalImpresiones) * 100).toFixed(1) : 0}%</b>
                        </div>

                        {/* Dropoff Arrow */}
                        <div style={{ textAlign: 'center', color: '#e74c3c', fontSize: '0.85rem', fontWeight: '600' }}>
                            ↓ Conversión a Lead real
                        </div>

                        {/* Step 3 */}
                        <div style={{ backgroundColor: 'rgba(45, 62, 64, 0.6)', color: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', width: '80%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Paso 3: Leads Generados</p>
                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{stats.pendientes + stats.totalPacientes} usuarios</h4>
                            </div>
                            <b style={{ fontSize: '1.2rem' }}>{stats.totalClics > 0 ? (((stats.pendientes + stats.totalPacientes) / stats.totalClics) * 100).toFixed(1) : 0}%</b>
                        </div>

                        {/* Dropoff Arrow */}
                        <div style={{ textAlign: 'center', color: '#e74c3c', fontSize: '0.85rem', fontWeight: '600' }}>
                            ↓ Conversión Final
                        </div>

                        {/* Step 4 */}
                        <div style={{ backgroundColor: 'var(--accent)', color: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', width: '70%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Paso 4: Agendamiento Real</p>
                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{stats.totalPacientes} usuarios</h4>
                            </div>
                            <b style={{ fontSize: '1.2rem' }}>{stats.totalImpresiones > 0 ? ((stats.totalPacientes / stats.totalImpresiones) * 100).toFixed(2) : 0}%</b>
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
                        {pacientes.filter(p => p.status === 'Pendiente' || p.status === 'Leads').slice(0, 5).map((paciente, idx) => (
                            <div key={paciente.id || idx} style={{ padding: '1.2rem', border: '1px solid #eee', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {paciente.name} <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', backgroundColor: '#ffeaa7', borderRadius: '4px', color: '#d35400' }}>{paciente.status}</span>
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                        {paciente.sesion_fecha ? `${paciente.sesion_fecha} con ${paciente.terapeutas?.name || 'Terapeuta'}` : 'Sin fecha definida aún'}
                                    </p>
                                </div>
                                <button onClick={() => handleSendWhatsApp(paciente.telefono || '', paciente.name)} className="secondary-btn" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#27ae60', borderColor: '#27ae60' }}>
                                    <MessageCircle size={16} /> Enviar Recordatorio
                                </button>
                            </div>
                        ))}

                        {pacientes.filter(p => p.status === 'Pendiente' || p.status === 'Leads').length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                                <CheckCircle2 size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p>No hay leads pendientes de confirmación.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
