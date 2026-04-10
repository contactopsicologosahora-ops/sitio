"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
    ShieldAlert, BarChart3, PieChart, Users, ArrowUpRight, CheckCircle, 
    Save, Download, Megaphone, Laptop, CalendarCheck, PhoneCall, CalendarDays, 
    HeartHandshake, SmilePlus, Share2, ArrowDown, Activity, Settings, Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Default Funnel Stages Definition
const DEFAULT_FUNNEL_STAGES = [
    { id: 1, key: 'ads', title: "Campaña Google Ads", description: "Esfuerzos SEM y anuncios enfocados a palabras clave de intención.", metric: "-", conversion: "-", icon: 'Megaphone', color: "#3498db", adMetrics: null as any },
    { id: 2, key: 'landing', title: "Landing de Terapeutas", description: "Página de destino optimizada para conversión y selección de especialista.", metric: "500 Visitas", conversion: "15% Clic", icon: 'Laptop', color: "#9b59b6" },
    { id: 3, key: 'form', title: "Formulario o Calendario", description: "Usuario selecciona horario o deja sus datos de contacto.", metric: "75 Solicitudes", conversion: "40% Envío", icon: 'CalendarCheck', color: "#e67e22" },
    { id: 4, key: 'contact', title: "Contacto con Lead", description: "Nuestro equipo se contacta para confirmar e instruir el pago/proceso.", metric: "30 Contactados", conversion: "80% Respuesta", icon: 'PhoneCall', color: "#f1c40f" },
    { id: 5, key: 'booking', title: "Confirmación de Cita", description: "Cita agendada oficialmente tras verificación y/o pago.", metric: "24 Confirmados", conversion: "100%", icon: 'CalendarDays', color: "#1abc9c" },
    { id: 6, key: 'session', title: "Atención Psicológica", description: "Realización efectiva de la sesión clínica con el terapeuta.", metric: "24 Asistencias", conversion: "90% Efectividad", icon: 'HeartHandshake', color: "#2ecc71" },
    { id: 7, key: 'adherence', title: "Adherencia y Satisfacción", description: "Paciente continúa tratamiento y valora positivamente la experiencia.", metric: "15 Retenidos", conversion: "60% Retención", icon: 'SmilePlus', color: "#fd79a8" },
    { id: 8, key: 'referral', title: "Recomendación a Otros", description: "Paciente trae nuevos conocidos (Boca a boca o referidos).", metric: "5 Referidos", conversion: "33% Viralidad", icon: 'Share2', color: "#e84393" },
];

export default function AdminDashboard() {
    const [authorized, setAuthorized] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [terapeutas, setTerapeutas] = useState<any[]>([]);
    const [loadingMetrics, setLoadingMetrics] = useState(false);
    
    // Tab State
    const [activeTab, setActiveTab] = useState<'metrics' | 'funnel' | 'announcements'>('metrics');

    // Funnel State
    const [funnelStages, setFunnelStages] = useState(DEFAULT_FUNNEL_STAGES);
    const [funnelSavedMsg, setFunnelSavedMsg] = useState("");
    const funnelRef = useRef<HTMLDivElement>(null);

    // Google Ads State
    const [dateRange, setDateRange] = useState('last_30_days');
    const [loadingAds, setLoadingAds] = useState(false);

    // Announcements State
    const [announceTitle, setAnnounceTitle] = useState("");
    const [announceContent, setAnnounceContent] = useState("");
    const [announceSendEmail, setAnnounceSendEmail] = useState(false);
    const [announceLoading, setAnnounceLoading] = useState(false);
    const [announceSuccess, setAnnounceSuccess] = useState("");
    
    // Announcement History State
    const [announcementHistory, setAnnouncementHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const submitAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!announceTitle || !announceContent) return;
        setAnnounceLoading(true);
        setAnnounceSuccess("");
        try {
            const res = await fetch('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: announceTitle, content: announceContent, sendEmail: announceSendEmail })
            });
            if (res.ok) {
                setAnnounceSuccess("¡Comunicado publicado exitosamente!");
                setAnnounceTitle("");
                setAnnounceContent("");
                setAnnounceSendEmail(false);
                fetchAnnouncementHistory();
                setTimeout(() => setAnnounceSuccess(""), 4000);
            } else {
                const errData = await res.json().catch(() => null);
                alert(errData?.error || "Error al publicar el comunicado.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de red.");
        } finally {
            setAnnounceLoading(false);
        }
    };

    useEffect(() => {
        if (authorized) {
            fetchTerapeutas();
            const savedFunnel = localStorage.getItem('admin_marketing_funnel');
            if (savedFunnel) {
                try {
                    const parsed = JSON.parse(savedFunnel);
                    // Prevent overwriting the ads node fully with cached if we want live data
                    // pero mantenemos la edición local de los demases.
                    setFunnelStages(parsed);
                } catch (e) {
                    console.error("Error parsing funnel data", e);
                }
            }
        }
    }, [authorized]);

    // Fetch Google Ads metrics when dateRange changes and on funnel tab
    useEffect(() => {
        if (authorized && activeTab === 'funnel') {
            fetchGoogleAdsData();
        }
    }, [authorized, activeTab, dateRange]);

    // Fetch Announcements history 
    useEffect(() => {
        if (authorized && activeTab === 'announcements') {
            fetchAnnouncementHistory();
        }
    }, [authorized, activeTab]);

    const fetchAnnouncementHistory = async () => {
        setLoadingHistory(true);
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select(`
                    id, title, content, created_at,
                    therapist_announcements(therapist_id, is_read)
                `)
                .order('created_at', { ascending: false });
            
            if (data && !error) {
                setAnnouncementHistory(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const fetchGoogleAdsData = async () => {
        setLoadingAds(true);
        try {
            const res = await fetch(`/api/google-ads?range=${dateRange}`);
            if (res.ok) {
                const data = await res.json();
                
                // Formateamos las métricas
                const formatCurrency = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
                const formatNumber = (val: number) => new Intl.NumberFormat('es-CL').format(val);

                const kpi = `${formatNumber(data.impressions)} Impresiones`;
                const conv = `${formatNumber(data.clicks)} Clics`;
                
                setFunnelStages(prev => prev.map(stage => {
                    if (stage.key === 'ads') {
                        return {
                            ...stage,
                            description: "Datos sincronizados y automatizados directo desde Google Ads.",
                            metric: kpi,
                            conversion: conv,
                            adMetrics: {
                                cost: formatCurrency(data.cost),
                                cpc: formatCurrency(data.cpc),
                                costPerConversion: formatCurrency(data.costPerConversion)
                            }
                        };
                    }
                    return stage;
                }));
            } else {
                console.error("Error cargando Google Ads:", await res.text());
            }
        } catch (err) {
            console.error("Fallo de red al pedir métricas Ads:", err);
        } finally {
            setLoadingAds(false);
        }
    };

    const fetchTerapeutas = async () => {
        const { data, error } = await supabase.from('terapeutas').select('*').order('id', { ascending: true });
        if (data && !error) {
            const enriched = data.map(t => ({
                ...t,
                metrics: t.metrics || {
                    supervisionAttendance: false,
                    weeklyAvailabilityHours: 0,
                    seniorityMonths: 0,
                    patientAdherence: 0
                }
            }));
            setTerapeutas(enriched);
        }
    };

    const handleMetricChange = (id: number, field: string, value: any) => {
        setTerapeutas(prev => prev.map(t => {
            if (t.id === id) {
                return { ...t, metrics: { ...t.metrics, [field]: value } };
            }
            return t;
        }));
    };

    const saveMetrics = async (id: number, metrics: any) => {
        setLoadingMetrics(true);
        try {
            await supabase.from('terapeutas').update({ metrics: metrics }).eq('id', id);
        } catch (error) {
            console.error("Error saving metrics", error);
        } finally {
            setLoadingMetrics(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Clave actualizada
        if (password === "BoltonPardo2026") {
            setAuthorized(true);
            setError(false);
        } else {
            setError(true);
        }
    };

    // --- Funnel Handlers ---
    const handleFunnelChange = (id: number, field: string, value: string) => {
        setFunnelStages(prev => prev.map(stage => {
            if (stage.id === id) {
                return { ...stage, [field]: value };
            }
            return stage;
        }));
    };

    const saveFunnel = () => {
        // Al guardar, quitamos temporalmente la propiedad adMetrics o la mantenemos
        // pero evitamos sobreescribir datos live que siempre vendrán de la API
        localStorage.setItem('admin_marketing_funnel', JSON.stringify(funnelStages));
        setFunnelSavedMsg("Embudo guardado exitosamente");
        setTimeout(() => setFunnelSavedMsg(""), 3000);
    };

    const downloadFunnelPDF = async () => {
        if (!funnelRef.current) return;
        try {
            const canvas = await html2canvas(funnelRef.current, {
                scale: 2, 
                backgroundColor: "#f4f7f6",
                useCORS: true
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('embudo_marketing_pa.pdf');
        } catch (error) {
            console.error("Error generando PDF", error);
            alert("No se pudo generar el PDF. Verifica la consola.");
        }
    };

    // Icon Resolver Builder
    const resolveIcon = (name: string, size = 24, color = "#fff") => {
        const icons: any = {
            Megaphone: <Megaphone size={size} color={color} />,
            Laptop: <Laptop size={size} color={color} />,
            CalendarCheck: <CalendarCheck size={size} color={color} />,
            PhoneCall: <PhoneCall size={size} color={color} />,
            CalendarDays: <CalendarDays size={size} color={color} />,
            HeartHandshake: <HeartHandshake size={size} color={color} />,
            SmilePlus: <SmilePlus size={size} color={color} />,
            Share2: <Share2 size={size} color={color} />
        };
        return icons[name] || <Activity size={size} color={color} />;
    };

    if (!authorized) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-serene)' }}>
                <div className="premium-card" style={{ maxWidth: '400px', width: '90%', textAlign: 'center', padding: '3rem 2rem', background: 'white', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
                    <ShieldAlert size={56} style={{ color: 'var(--accent)', marginBottom: '1.5rem' }} />
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Acceso Administrativo</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-soft)', fontSize: '0.9rem' }}>Este panel contiene configuraciones e información confidencial del centro.</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Contraseña de Administrador"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ 
                                width: '100%', padding: '1rem 1.5rem', marginBottom: '1.5rem', 
                                borderRadius: '12px', border: `2px solid ${error ? '#e74c3c' : '#eaeaea'}`,
                                fontSize: '1rem', outline: 'none', transition: 'border 0.3s'
                            }}
                        />
                        {error && <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 500, marginTop: '-0.5rem' }}>Credenciales incorrectas.</p>}
                        <button className="premium-btn" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                            Desbloquear Panel
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 4%', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'var(--font-sans)', color: 'var(--text-main)' }}>
            
            {/* Nav Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.4rem', color: 'var(--primary)', lineHeight: 1.2, margin: 0, fontWeight: 700 }}>Workspace Ejecutivo</h1>
                    <p style={{ color: 'var(--primary-muted)', marginTop: '0.5rem', fontSize: '1.05rem' }}>Control Maestro de Operaciones y Estrategia</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={() => setActiveTab('metrics')} 
                        style={{ 
                            padding: '0.75rem 1.5rem', borderRadius: '50px', fontWeight: 600, border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s',
                            backgroundColor: activeTab === 'metrics' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                            color: activeTab === 'metrics' ? 'white' : 'var(--text-soft)'
                        }}
                    >
                        <BarChart3 size={18} /> Operaciones & Core
                    </button>
                    <button 
                        onClick={() => setActiveTab('funnel')} 
                        style={{ 
                            padding: '0.75rem 1.5rem', borderRadius: '50px', fontWeight: 600, border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s',
                            backgroundColor: activeTab === 'funnel' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                            color: activeTab === 'funnel' ? 'white' : 'var(--text-soft)'
                        }}
                    >
                        <Activity size={18} /> Estructura de Embudo
                    </button>
                    <button 
                        onClick={() => setActiveTab('announcements')} 
                        style={{ 
                            padding: '0.75rem 1.5rem', borderRadius: '50px', fontWeight: 600, border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s',
                            backgroundColor: activeTab === 'announcements' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                            color: activeTab === 'announcements' ? 'white' : 'var(--text-soft)'
                        }}
                    >
                        <Megaphone size={18} /> Comunicados
                    </button>
                </div>
            </header>

            <main>
                {/* -------------------- TAB: METRICAS -------------------- */}
                {activeTab === 'metrics' && (
                    <div className="animate-fade">
                        {/* Global Stats Grid */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.4rem' }}>Resumen General Operativo</h3>
                            <span style={{ fontSize: '0.85rem', backgroundColor: '#fff3cd', color: '#856404', padding: '0.3rem 0.8rem', borderRadius: '50px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle size={16}/> Próximamente disponible</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', borderLeft: '6px solid var(--accent)', boxShadow: 'var(--shadow-sm)' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Visitas Totales</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                                    <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary)' }}>0</h2>
                                </div>
                            </div>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', borderLeft: '6px solid #3498db', boxShadow: 'var(--shadow-sm)' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Visitas P. Terapeutas</p>
                                <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary)', marginTop: '0.5rem' }}>0</h2>
                            </div>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', borderLeft: '6px solid #2ecc71', boxShadow: 'var(--shadow-sm)' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Leads Capturados</p>
                                <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary)', marginTop: '0.5rem' }}>0</h2>
                            </div>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', borderLeft: '6px solid #f1c40f', boxShadow: 'var(--shadow-sm)' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pacientes Activos</p>
                                <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary)', marginTop: '0.5rem' }}>0</h2>
                            </div>
                        </div>

                        {/* Gestión de Métricas por Terapeuta */}
                        <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ width: 48, height: 48, background: 'rgba(45, 62, 64, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Settings size={24} color="var(--primary)" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.4rem' }}>Gestión de Desempeño Clínico</h3>
                                    <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '0.95rem' }}>Ajusta los parámetros que dictan la visibilidad de los especialistas en el portal.</p>
                                </div>
                            </div>
                            
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #f0f0f0', color: 'var(--text-soft)', fontSize: '0.9rem' }}>
                                            <th style={{ padding: '1rem 0' }}>Especialista</th>
                                            <th style={{ padding: '1rem' }}>Supervisión Clínica</th>
                                            <th style={{ padding: '1rem' }}>Apertura (hrs/sem)</th>
                                            <th style={{ padding: '1rem' }}>Permanencia (meses)</th>
                                            <th style={{ padding: '1rem' }}>Adherencia (%)</th>
                                            <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {terapeutas.map(t => (
                                            <tr key={t.id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }} className="hover-row">
                                                <td style={{ padding: '1rem 0', fontWeight: '600', color: 'var(--primary)' }}>{t.name}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={t.metrics.supervisionAttendance} 
                                                            onChange={(e) => handleMetricChange(t.id, 'supervisionAttendance', e.target.checked)} 
                                                            style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                                                        />
                                                        <span style={{ fontSize: '0.9rem', color: t.metrics.supervisionAttendance ? '#27ae60' : 'var(--text-soft)' }}>
                                                            {t.metrics.supervisionAttendance ? "Completada" : "Faltante"}
                                                        </span>
                                                    </label>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <input type="number" value={t.metrics.weeklyAvailabilityHours} onChange={(e) => handleMetricChange(t.id, 'weeklyAvailabilityHours', Number(e.target.value))} style={{ width: '70px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center', fontWeight: '600' }} />
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <input type="number" value={t.metrics.seniorityMonths} onChange={(e) => handleMetricChange(t.id, 'seniorityMonths', Number(e.target.value))} style={{ width: '70px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center', fontWeight: '600' }} />
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <input type="number" value={t.metrics.patientAdherence} onChange={(e) => handleMetricChange(t.id, 'patientAdherence', Number(e.target.value))} style={{ width: '70px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center', fontWeight: '600' }} />
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                    <button onClick={() => saveMetrics(t.id, t.metrics)} disabled={loadingMetrics} style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.3s' }}>
                                                        <CheckCircle size={16} /> Guardar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* -------------------- TAB: EMBUDO DE MARKETING -------------------- */}
                {activeTab === 'funnel' && (
                    <div className="animate-fade">
                        {/* Toolbar del Funnel */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-soft)' }}>Métricas Globales Ads:</span>
                                <select 
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    style={{ border: 'none', fontWeight: 'bold', color: 'var(--primary)', outline: 'none', background: 'transparent', cursor: 'pointer' }}
                                >
                                    <option value="today">Hoy</option>
                                    <option value="last_7_days">Últimos 7 días</option>
                                    <option value="last_30_days">Últimos 30 días</option>
                                    <option value="this_month">Este mes</option>
                                    <option value="last_month">Mes anterior</option>
                                    <option value="this_year">Todo el año</option>
                                </select>
                                {loadingAds && <Loader2 size={16} className="animate-spin" color="var(--primary)" />}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', flex: 1, justifyContent: 'flex-end' }}>
                                {funnelSavedMsg && <span style={{ alignSelf: 'center', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e8f5e9', padding: '0.5rem 1rem', borderRadius: '50px' }}><CheckCircle size={18} /> {funnelSavedMsg}</span>}
                                
                                <button onClick={saveFunnel} className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                                    <Save size={18} /> Guardar Cambios
                                </button>
                                <button onClick={downloadFunnelPDF} className="premium-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                                    <Download size={18} /> Descargar PDF
                                </button>
                            </div>
                        </div>

                        {/* Contenedor Captutable para PDF */}
                        <div 
                            ref={funnelRef}
                            style={{ 
                                background: 'white', borderRadius: '24px', padding: '4rem 2rem', 
                                boxShadow: 'var(--shadow-md)', border: '1px solid rgba(0,0,0,0.03)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center'
                            }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                                <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', margin: 0 }}>Arquitectura Estratégica del Flujo</h2>
                                <p style={{ color: 'var(--text-soft)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Visualización y gestión integral de pacientes en Psicólogos Ahora</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '800px', gap: '0.5rem', position: 'relative' }}>
                                
                                {funnelStages.map((stage, index) => {
                                    const isAdsNode = stage.key === 'ads';

                                    return (
                                        <React.Fragment key={stage.id}>
                                            {/* Nodo del Funnel */}
                                            <div style={{ 
                                                display: 'flex', 
                                                flexDirection: 'column',
                                                background: isAdsNode ? '#f0f9fa' : '#fafafa', 
                                                border: isAdsNode ? '2px solid #3498db40' : '1px solid #eee', 
                                                borderRadius: '20px', 
                                                padding: '1.5rem',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                                                transition: 'transform 0.3s, box-shadow 0.3s',
                                                margin: '0 auto',
                                                width: `${100 - (index * 4)}%`, // Efecto escalera/embudo visual suave
                                                minWidth: '60%',
                                                position: 'relative'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)' }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.02)' }}
                                            >
                                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'stretch' }}>
                                                    {/* Icon Block */}
                                                    <div style={{ 
                                                        width: '70px', height: '70px', 
                                                        background: `linear-gradient(135deg, ${stage.color}cc 0%, ${stage.color} 100%)`, 
                                                        borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        flexShrink: 0,
                                                        boxShadow: `0 8px 20px ${stage.color}40`,
                                                        position: 'relative'
                                                    }}>
                                                        {loadingAds && isAdsNode && <Loader2 className="animate-spin" style={{ position: 'absolute', top: -10, right: -10, color: stage.color }} />}
                                                        {resolveIcon(stage.icon, 32, "#ffffff")}
                                                    </div>

                                                    {/* Data Inputs */}
                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyItems: 'center', gap: '0.2rem' }}>
                                                        <input 
                                                            value={stage.title}
                                                            readOnly={isAdsNode} // Ads read-only
                                                            onChange={(e) => handleFunnelChange(stage.id, 'title', e.target.value)}
                                                            style={{ border: 'none', background: 'transparent', fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', outline: 'none', width: '100%', cursor: isAdsNode ? 'default' : 'text' }}
                                                        />
                                                        <textarea 
                                                            value={stage.description}
                                                            readOnly={isAdsNode}
                                                            onChange={(e) => handleFunnelChange(stage.id, 'description', e.target.value)}
                                                            rows={2}
                                                            style={{ border: 'none', background: 'transparent', fontSize: '0.90rem', color: 'var(--text-soft)', outline: 'none', width: '100%', resize: 'none', fontFamily: 'inherit', cursor: isAdsNode ? 'default' : 'text' }}
                                                        />
                                                    </div>

                                                    {/* Main Metrics Panel */}
                                                    <div style={{ flexShrink: 0, width: '160px', display: 'flex', flexDirection: 'column', gap: '0.4rem', justifyContent: 'center', borderLeft: '1px solid #eaeaea', paddingLeft: '1.5rem' }}>
                                                        <div>
                                                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#999', fontWeight: 700, letterSpacing: '1px' }}>Kpi Clave</span>
                                                            <input 
                                                                value={stage.metric}
                                                                readOnly={isAdsNode}
                                                                onChange={(e) => handleFunnelChange(stage.id, 'metric', e.target.value)}
                                                                style={{ border: 'none', background: 'transparent', fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600, outline: 'none', width: '100%', padding: '0.2rem 0', borderBottom: isAdsNode ? 'none' : '1px dashed #ddd', cursor: isAdsNode ? 'default' : 'text' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#999', fontWeight: 700, letterSpacing: '1px' }}>{isAdsNode ? 'Clics Totales' : 'Conversión'}</span>
                                                            <input 
                                                                value={stage.conversion}
                                                                readOnly={isAdsNode}
                                                                onChange={(e) => handleFunnelChange(stage.id, 'conversion', e.target.value)}
                                                                style={{ border: 'none', background: 'transparent', fontSize: '1rem', color: '#059669', fontWeight: 700, outline: 'none', width: '100%', padding: '0.2rem 0', borderBottom: isAdsNode ? 'none' : '1px dashed #ddd', cursor: isAdsNode ? 'default' : 'text' }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Extended Read-Only Ads Metrics Area */}
                                                {isAdsNode && stage.adMetrics && (
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem', background: '#ffffff', borderRadius: '12px', padding: '1rem', border: '1px solid #e0e0e0', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)' }}>
                                                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Inversión Total</span>
                                                            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>{stage.adMetrics.cost}</span>
                                                        </div>
                                                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>CPC Promedio</span>
                                                            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3498db' }}>{stage.adMetrics.cpc}</span>
                                                        </div>
                                                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Costo x Conversión</span>
                                                            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>{stage.adMetrics.costPerConversion}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Connector Arrow (Skip after last) */}
                                            {index < funnelStages.length - 1 && (
                                                <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0', opacity: 0.6 }}>
                                                    <ArrowDown size={32} color="#ccc" />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}

                            </div>
                            
                            <div style={{ marginTop: '4rem', width: '100%', borderTop: '1px solid #eee', paddingTop: '2rem', textAlign: 'center', color: '#aaa', fontSize: '0.85rem' }}>
                                Documento Interno Privado · Psicólogos Ahora © {new Date().getFullYear()} · Actualizado en tiempo real {dateRange !== 'today' ? `(Filtro: ${dateRange.replace(/_/g, ' ')})` : ''}
                            </div>

                        </div>
                    </div>
                )}

                {/* -------------------- TAB: COMUNICADOS -------------------- */}
                {activeTab === 'announcements' && (
                    <div className="animate-fade">
                        <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-md)', maxWidth: '800px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ width: 48, height: 48, background: 'rgba(26, 111, 186, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Megaphone size={24} color="#1a6fba" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.4rem' }}>Enviar Comunicado</h3>
                                    <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '0.95rem' }}>Escribe noticias, avisos o normativas para todos los especialistas (Aparecerá en su portal).</p>
                                </div>
                            </div>

                            <form onSubmit={submitAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-soft)', marginBottom: '0.5rem' }}>Título del Comunicado</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Nueva Política de Cierre Mensual, Actualización de Precios, etc."
                                        value={announceTitle}
                                        onChange={(e) => setAnnounceTitle(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #eaeaea', fontSize: '1rem', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-soft)', marginBottom: '0.5rem' }}>Cuerpo del Mensaje</label>
                                    <textarea 
                                        placeholder="Escribe el mensaje detallado aquí... Puedes usar múltiples párrafos."
                                        value={announceContent}
                                        onChange={(e) => setAnnounceContent(e.target.value)}
                                        required
                                        rows={8}
                                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #eaeaea', fontSize: '1rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                                    />
                                </div>
                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <input 
                                        type="checkbox" 
                                        id="sendEmailCheck"
                                        checked={announceSendEmail}
                                        onChange={(e) => setAnnounceSendEmail(e.target.checked)}
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                                    />
                                    <label htmlFor="sendEmailCheck" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '1rem' }}>Enviar también como correo electrónico</span>
                                        <span style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>Todos los terapeutas recibirán esto en su bandeja de entrada (Html premium).</span>
                                    </label>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                                    {announceSuccess && <span style={{ color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} /> {announceSuccess}</span>}
                                    <button disabled={announceLoading} className="premium-btn" style={{ padding: '1rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: announceLoading ? 0.7 : 1 }}>
                                        {announceLoading ? <Loader2 className="animate-spin" size={20} /> : <Megaphone size={20} />} 
                                        {announceLoading ? 'Publicando...' : 'Publicar Comunicado'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Historial de Comunicados */}
                        <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-md)', maxWidth: '800px', margin: '2rem auto 4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.4rem' }}>Historial y Lecturas</h3>
                                <button onClick={fetchAnnouncementHistory} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Activity size={16} /> Refrescar
                                </button>
                            </div>
                            
                            {loadingHistory ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" size={32} color="var(--primary)" /></div>
                            ) : announcementHistory.length === 0 ? (
                                <p style={{ color: 'var(--text-soft)', textAlign: 'center' }}>No hay comunicados publicados.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {announcementHistory.map(ann => {
                                        const readStatus = ann.therapist_announcements || [];
                                        // Encontramos los ids que leyeron este aviso:
                                        const readTherapistIds = readStatus.filter((s:any) => s.is_read).map((s:any) => s.therapist_id);
                                        
                                        // Mapeamos los IDs a objetos de terapeutas:
                                        const readTherapists = terapeutas.filter(t => readTherapistIds.includes(t.id));
                                        
                                        return (
                                            <div key={ann.id} style={{ border: '1px solid #eaeaea', borderRadius: '16px', padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>{ann.title}</h4>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)', whiteSpace: 'nowrap' }}>
                                                        {new Date(ann.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '1rem' }}>
                                                    {ann.content.substring(0, 100)}...
                                                </p>
                                                
                                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <CheckCircle size={14} /> Leído por ({readTherapists.length}):
                                                    </p>
                                                    {readTherapists.length > 0 ? (
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                            {readTherapists.map(t => (
                                                                <span key={t.id} style={{ fontSize: '0.75rem', background: '#e1f5fe', color: '#0288d1', padding: '0.2rem 0.6rem', borderRadius: '50px' }}>
                                                                    {t.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-soft)', fontStyle: 'italic' }}>Ningún terapeuta ha marcado este aviso como leído.</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
