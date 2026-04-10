"use client";
import { useState, useEffect } from "react";
import { User, TrendingUp, Calendar, Users, Clock, ArrowUpRight, CheckCircle, XCircle, Edit2, Award, X, Search, Mail, Phone, MapPin, Activity, DollarSign, AlertCircle, LogOut, ChevronRight, Video, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { updateLeadStatusAction, matchPaymentAction, saveProfileAction, markAnnouncementReadAction, hideAnnouncementAction } from "./actions";

export default function TherapistDashboard() {
    const [session, setSession] = useState<any>(null);
    const [therapistInfo, setTherapistInfo] = useState<any>(null);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState("");

    const [activeTab, setActiveTab] = useState("pacientes");
    const [leads, setLeads] = useState<any[]>([]);
    const [pendingPayments, setPendingPayments] = useState<any[]>([]);
    const [editingLead, setEditingLead] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [missingEmailAlert, setMissingEmailAlert] = useState<{show: boolean, leadId: number | null}>({ show: false, leadId: null });
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [isUpdatingAnnouncement, setIsUpdatingAnnouncement] = useState<Record<string, boolean>>({});

    const [isAddingPatient, setIsAddingPatient] = useState(false);
    const [newPatient, setNewPatient] = useState({ name: '', email: '', phone: '', status: 'Paciente' });
    const [isSubmittingPatient, setIsSubmittingPatient] = useState(false);

    const handleMatchPayment = async (paymentId: string, leadId: number) => {
        const payment = pendingPayments.find(p => p.id === paymentId);
        const lead = leads.find(l => l.id === leadId);
        
        if (payment && lead && confirm(`¿Deseas asociar este pago de ${payment.encuadrado_patient_name} a ${lead.name}? \n\nEl sistema asociará automáticamente futuros pagos provenientes de Encuadrado.`)) {
            setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, sessions: (l.sessions || 0) + 1 } : l));
            
            try {
                const response = await matchPaymentAction(session.access_token, paymentId, leadId);
                if (!response.success) throw new Error(response.error);
            } catch (error) {
                console.error("Error matching payment (DLP block):", error);
                alert("Hubo un error de seguridad impidiendo asociar el pago.");
            }
        }
    };

    const handleUpdateLeadStatus = async (id: number, status: string) => {
        if (status === 'Paciente') {
            const currentLead = leads.find(l => l.id === id);
            if (!currentLead?.email) {
                setMissingEmailAlert({ show: true, leadId: id });
                return;
            }
        }

        const backupLeads = [...leads];
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        try {
            const result = await updateLeadStatusAction(session.access_token, id, status);
            if (!result.success) throw new Error(result.error);
        } catch (error) {
            console.error("Error updating lead status:", error);
            alert("Operación denegada por protocolo de seguridad.");
            setLeads(backupLeads); // Revertir actualización optimista
        }
    };

    const handleSaveLeadDetails = async (updatedLead: any) => {
        setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
        setEditingLead(null);
        try {
            const { rut, address, theme, observations, email } = updatedLead;
            await supabase.from('leads').update({ rut, address, theme, observations, email }).eq('id', updatedLead.id);
        } catch (error) {
            console.error("Error saving lead details:", error);
        }
    };

    const handleAddPatient = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingPatient(true);
        try {
            const response = await fetch('/api/add-patient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    therapistId: therapistInfo.id,
                    name: newPatient.name,
                    email: newPatient.email,
                    phone: newPatient.phone,
                    status: newPatient.status
                })
            });
            
            const result = await response.json();
            if (!response.ok) throw new Error(result.error?.message || 'Error en la petición');
            
            if (result.success && result.data) {
                setLeads(prev => [result.data, ...prev]);
            } else {
                fetchLeads(therapistInfo.id); // fallback
            }
            
            setIsAddingPatient(false);
            setNewPatient({ name: '', email: '', phone: '', status: 'Paciente' });
            alert("Paciente añadido exitosamente");
        } catch (error) {
            console.error("Error al añadir paciente:", error);
            alert(`Hubo un error al añadir el paciente: ${error}`);
        } finally {
            setIsSubmittingPatient(false);
        }
    };

    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    const [availability, setAvailability] = useState<Record<string, string[]>>({});

    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState({ 
        price: '', 
        title: '', 
        bio: '',
        tags: '',
        education: '',
        impact: '',
        methodology: '',
        quote: '',
        button_text: 'Agendar Evaluación de Ingreso',
        duration: '50 min'
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const [isGoogleConnected, setIsGoogleConnected] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session && session.user.email) {
                fetchTherapistInfo(session.user.email);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session && session.user.email) {
                fetchTherapistInfo(session.user.email);
            } else {
                setTherapistInfo(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchTherapistInfo = async (email: string) => {
        try {
            const { data, error } = await supabase.from('terapeutas').select('id, name, email, image, price, title, bio, tags, education, impact, methodology, quote, button_text, duration').eq('email', email).single();
            if (data && !error) {
                setTherapistInfo(data);
                setProfile({ 
                    price: data.price || '', 
                    title: data.title || '', 
                    bio: data.bio || '',
                    tags: data.tags || '',
                    education: data.education || '',
                    impact: data.impact || '',
                    methodology: data.methodology || '',
                    quote: data.quote || '',
                    button_text: data.button_text || 'Agendar Evaluación de Ingreso',
                    duration: data.duration || '50 min'
                });
                fetchLeads(data.id);
                fetchAvailability(data.id);
                fetchGoogleStatus(data.id);
                fetchPendingPayments(data.id);
                fetchAnnouncements(data.id);
            } else {
                console.error("No therapist found for email", email);
            }
        } catch (error) {
            console.error("Error fetching therapist info:", error);
        }
    };

    const fetchLeads = async (tId: number) => {
        try {
            const { data, error } = await supabase.from('leads').select('id, name, email, phone, status, theme, sessions, created_at').eq('therapist_id', tId).order('created_at', { ascending: false });
            if (error) {
                const fallback = await supabase.from('leads').select('id, name, email, phone, status, theme, sessions, created_at').eq('terapeuta_id', tId).order('created_at', { ascending: false });
                if (fallback.data) setLeads(fallback.data);
            } else if (data) {
                setLeads(data);
            }
        } catch (error) {
            console.error("Exception fetching leads:", error);
        }
    };

    const fetchAvailability = async (tId: number) => {
        try {
            const response = await fetch(`/api/availability?therapistId=${tId}`);
            if (response.ok) {
                const data = await response.json();
                setAvailability(data);
            }
        } catch (error) {
            console.error("Error fetching availability:", error);
        }
    };

    const fetchGoogleStatus = async (tId: number) => {
        try {
            const res = await fetch(`/api/auth/google/status?therapistId=${tId}`);
            if (res.ok) {
                const data = await res.json();
                setIsGoogleConnected(data.isConnected);
            }
        } catch (e) {}
    };

    const fetchPendingPayments = async (tId: number) => {
        try {
            const { data, error } = await supabase
                .from('payments')
                .select('id, amount, encuadrado_patient_name, encuadrado_patient_email, payment_date')
                .eq('status', 'pending_match')
                .eq('therapist_id', tId)
                .order('created_at', { ascending: false });
            if (data && !error) setPendingPayments(data);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    const fetchAnnouncements = async (tId: number) => {
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select(`
                    *,
                    therapist_announcements(is_read, is_hidden, therapist_id)
                `)
                .order('created_at', { ascending: false });
            if (data && !error) {
                const mappedAnnouncements = data.map((ann: any) => {
                    const status = ann.therapist_announcements?.find((s: any) => s.therapist_id === tId) || {};
                    return { ...ann, is_read: status.is_read || false, is_hidden: status.is_hidden || false };
                }).filter((ann: any) => !ann.is_hidden);
                setAnnouncements(mappedAnnouncements);
            }
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    const handleMarkAnnouncementAsRead = async (announcementId: string) => {
        if (!session || !therapistInfo) return;
        setIsUpdatingAnnouncement(prev => ({ ...prev, [announcementId]: true }));
        try {
            await markAnnouncementReadAction(session.access_token, announcementId);
            setAnnouncements(prev => prev.map(ann => ann.id === announcementId ? { ...ann, is_read: true } : ann));
        } catch (err) {
            console.error(err);
            alert("No se pudo actualizar el estado del anuncio.");
        } finally {
            setIsUpdatingAnnouncement(prev => ({ ...prev, [announcementId]: false }));
        }
    };

    const handleHideAnnouncement = async (announcementId: string) => {
        if (!session || !therapistInfo) return;
        setIsUpdatingAnnouncement(prev => ({ ...prev, [announcementId]: true }));
        try {
            await hideAnnouncementAction(session.access_token, announcementId);
            setAnnouncements(prev => prev.filter(ann => ann.id !== announcementId));
        } catch (err) {
            console.error(err);
            alert("No se pudo ocultar el anuncio.");
            setIsUpdatingAnnouncement(prev => ({ ...prev, [announcementId]: false }));
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError("");
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            });
            if (error) throw error;
        } catch (error: any) {
            setLoginError(error.message === "Email not confirmed" ? "Debes confirmar tu correo electrónico. Revisa tu bandeja." : "Credenciales incorrectas.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const toggleSlot = (day: string, time: string) => {
        setAvailability(prev => {
            const newAvail = { ...prev };
            if (!newAvail[day]) newAvail[day] = [];
            if (newAvail[day].includes(time)) {
                newAvail[day] = newAvail[day].filter(t => t !== time);
            } else {
                newAvail[day] = [...newAvail[day], time];
            }
            return newAvail;
        });
    };

    const saveAvailability = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ therapistId: therapistInfo.id.toString(), availability })
            });
            alert('¡Horarios actualizados correctamente!');
        } catch (error) {
            console.error('Error saving availability:', error);
            alert('Error al guardar los horarios');
        } finally {
            setIsSaving(false);
        }
    };

    const saveProfile = async () => {
        setIsSavingProfile(true);
        try {
            const result = await saveProfileAction(session.access_token, profile);
            if (!result.success) throw new Error(result.error);
            alert('¡Perfil actualizado correctamente!');
        } catch (error) {
            console.error('Error saving profile (DLP block):', error);
            alert('Error autorizado. No pudimos guardar tu perfil debido a la política de seguridad.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    if (!session || !therapistInfo) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-serene)' }}>
                <div className="glass-card animate-fade" style={{ maxWidth: '420px', width: '90%', textAlign: 'center', padding: '3.5rem 2.5rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 25px rgba(45,62,64,0.3)' }}>
                        <Activity size={32} />
                    </div>
                    <h2 className="serif-font" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Portal Clínico</h2>
                    <p style={{ marginBottom: '2.5rem', color: 'var(--text-soft)', fontSize: '0.95rem' }}>Acceso exclusivo para especialistas.</p>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="clean-input"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="clean-input"
                            required
                        />
                        {loginError && <p style={{ color: '#e74c3c', fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>{loginError}</p>}
                        <button type="submit" className="premium-btn" style={{ marginTop: '1rem', justifyContent: 'center', padding: '1rem' }} disabled={isLoggingIn}>
                            {isLoggingIn ? "Autenticando..." : "Ingresar al Panel"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const filteredLeads = [...leads].filter(l => 
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase()))
    ).sort((a, b) => {
        if (a.status === 'Perdido' && b.status !== 'Perdido') return 1;
        if (a.status !== 'Perdido' && b.status === 'Perdido') return -1;
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    // Cálculos dinámicos (Desactivados temporalmente)
    const totalLeads = 0; // leads.length;
    const totalPatients = 0; // leads.filter(l => l.status === 'Paciente' || l.status === 'Alta').length;
    const activePatients = 0; // leads.filter(l => l.status === 'Paciente').length;
    const conversionRate = "0.0"; // totalLeads > 0 ? ((totalPatients / totalLeads) * 100).toFixed(1) : "0.0";
    const estimatedPendingIncome = 0; // pendingPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-serene)', display: 'flex' }}>
            
            {/* Ultra Premium Sidebar */}
            <aside className="dash-sidebar" style={{ width: '280px', padding: '2.5rem 1.5rem', height: '100vh', position: 'sticky', top: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem', padding: '0 0.5rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent) 0%, #aa9e8b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <Activity size={20} />
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', letterSpacing: '0.5px' }}>PA <span style={{fontWeight: 300, opacity: 0.7}}>Clínica</span></span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Gestión</span>
                    
                    <button onClick={() => setActiveTab("noticias")} className={`dash-nav-btn ${activeTab === "noticias" ? "active" : ""}`}>
                        <AlertCircle size={18} /> Tablón de Avisos
                    </button>
                    <button onClick={() => setActiveTab("pacientes")} className={`dash-nav-btn ${activeTab === "pacientes" ? "active" : ""}`}>
                        <Users size={18} /> CRM Pacientes
                    </button>
                    <button onClick={() => setActiveTab("agenda")} className={`dash-nav-btn ${activeTab === "agenda" ? "active" : ""}`}>
                        <Calendar size={18} /> Disponibilidad
                    </button>
                    
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', margin: '1.5rem 0 0.5rem', paddingLeft: '0.5rem' }}>Análisis</span>
                    
                    <button onClick={() => setActiveTab("metricas")} className={`dash-nav-btn ${activeTab === "metricas" ? "active" : ""}`}>
                        <TrendingUp size={18} /> Desempeño
                    </button>

                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', margin: '1.5rem 0 0.5rem', paddingLeft: '0.5rem' }}>Configuración</span>
                    
                    <button onClick={() => setActiveTab("perfil")} className={`dash-nav-btn ${activeTab === "perfil" ? "active" : ""}`}>
                        <User size={18} /> Mi Perfil Público
                    </button>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                        <img src={therapistInfo.image || "https://via.placeholder.com/40"} alt="Profile" style={{ width: '44px', height: '44px', borderRadius: '14px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', margin: 0 }}>{therapistInfo.name}</p>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', margin: 0 }}>Especialista</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '0.8rem', border: 'none', backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(231,76,60,0.1)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
                        <LogOut size={16} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '3rem 4rem 6rem', overflowY: 'auto' }}>
                
                {activeTab === "pacientes" && (
                    <div className="animate-fade">
                        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h1 className="serif-font" style={{ fontSize: '2.4rem', marginBottom: '0.2rem' }}>CRM de Pacientes</h1>
                                <p style={{ color: 'var(--text-soft)' }}>Gestiona tus casos clínicos, historial y seguimiento comercial.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div className="search-container">
                                    <Search size={18} />
                                    <input 
                                        type="text" 
                                        className="clean-input" 
                                        placeholder="Buscar por nombre o email..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button className="premium-btn" onClick={() => setIsAddingPatient(true)}>
                                    + Nuevo Paciente
                                </button>
                            </div>
                        </header>

                        {/* Alertas de Pagos Péndientes (Inbox Style) */}
                        {pendingPayments.length > 0 && (
                            <div className="glass-card animate-fade" style={{ padding: '0', marginBottom: '2.5rem', border: '1px solid #ffe69c', overflow: 'hidden' }}>
                                <div style={{ backgroundColor: '#fff8e1', padding: '1.2rem 1.5rem', borderBottom: '1px solid #ffe69c', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <div style={{ background: '#ffc107', color: '#fff', padding: '6px', borderRadius: '8px' }}><AlertCircle size={20} /></div>
                                    <h3 style={{ fontSize: '1rem', margin: 0, color: '#856404' }}>Acción Requerida: {pendingPayments.length} pago(s) de Encuadrado sin asociar</h3>
                                </div>
                                <div style={{ padding: '1rem 1.5rem' }}>
                                    {pendingPayments.map(payment => (
                                        <div key={payment.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #f1f3f5', flexWrap: 'wrap', gap: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cc9a06', fontWeight: 'bold' }}>
                                                    {payment.amount ? '$' : '-'}
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: '700', color: '#333', fontSize: '0.95rem' }}>{payment.encuadrado_patient_name}</p>
                                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-soft)' }}>
                                                        {payment.encuadrado_patient_email || 'Email no reportado'} 
                                                        <span style={{ margin: '0 0.5rem', color: '#ddd' }}>|</span> 
                                                        <strong style={{ color: '#198754' }}>${payment.amount?.toLocaleString('es-CL') || 0}</strong>
                                                        <span style={{ margin: '0 0.5rem', color: '#ddd' }}>|</span> 
                                                        {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'Sin fecha'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-soft)' }}>Asociar al expediente de:</span>
                                                <select 
                                                    onChange={(e) => handleMatchPayment(payment.id, parseInt(e.target.value))}
                                                    value=""
                                                    className="clean-input"
                                                    style={{ padding: '0.6rem 1rem', minWidth: '220px', borderRadius: '8px' }}
                                                >
                                                    <option value="" disabled>Seleccionar paciente...</option>
                                                    {leads.filter(l => l.status === 'Paciente' || l.status === 'Alta').map(l => (
                                                        <option key={l.id} value={l.id}>{l.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Data Grid Premium */}
                        <div className="glass-card" style={{ overflow: 'hidden' }}>
                            <table className="dash-table">
                                <thead>
                                    <tr>
                                        <th>Paciente</th>
                                        <th>Información Clínica</th>
                                        <th>Estado</th>
                                        <th style={{ textAlign: 'center' }}>Sesiones</th>
                                        <th style={{ textAlign: 'right' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeads.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-soft)' }}>
                                                <Users size={48} style={{ opacity: 0.2, marginBottom: '1rem', margin: '0 auto' }} />
                                                <p>No se encontraron registros de pacientes.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLeads.map(lead => {
                                            const init = lead.name.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase();
                                            return (
                                                <tr key={lead.id}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            <div className="avatar-initials">{init}</div>
                                                            <div>
                                                                <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem' }}>{lead.name}</p>
                                                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-soft)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                                    <Mail size={12}/> 
                                                                    {lead.email ? (
                                                                        lead.email
                                                                    ) : (
                                                                        lead.status !== 'Perdido' ? (
                                                                            <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: '600' }} title="Falta correo electrónico">
                                                                                <AlertCircle size={14} /> Sin correo (Requerido)
                                                                            </span>
                                                                        ) : (
                                                                            <span style={{ color: 'var(--text-soft)' }}>Sin correo</span>
                                                                        )
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={12} color="var(--primary-muted)"/> {lead.phone || 'N/A'}</span>
                                                            {lead.theme && <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '500', background: '#f0f9f5', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>{lead.theme.substring(0,25)}{lead.theme.length > 25 ? '...' : ''}</span>}
                                                            {lead.created_at && (
                                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                                                                    <Clock size={10} /> Ingreso: {new Date(lead.created_at).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-pill ${lead.status.toLowerCase()}`}>
                                                            {lead.status === 'Paciente' && <Activity size={12}/>}
                                                            {lead.status === 'Pendiente' && <Clock size={12}/>}
                                                            {lead.status === 'Alta' && <Award size={12}/>}
                                                            {lead.status === 'Perdido' && <XCircle size={12}/>}
                                                            {lead.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', borderRadius: '8px', background: lead.sessions > 0 ? 'var(--primary)' : '#f1f3f5', color: lead.sessions > 0 ? '#fff' : 'var(--text-soft)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                            {lead.sessions || 0}
                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                            <button onClick={() => setEditingLead(lead)} className="action-btn-subtle info" title="Ver Expediente"><FileText size={16} /></button>
                                                            {lead.status !== 'Paciente' && lead.status !== 'Alta' && (
                                                                <button onClick={() => handleUpdateLeadStatus(lead.id, 'Paciente')} className="action-btn-subtle success" title="Convertir a Paciente Activo"><CheckCircle size={16} /></button>
                                                            )}
                                                            {lead.status === 'Paciente' && (
                                                                <button onClick={() => handleUpdateLeadStatus(lead.id, 'Alta')} className="action-btn-subtle info" title="Dar de Alta a Paciente"><Award size={16} /></button>
                                                            )}
                                                            {lead.status !== 'Perdido' && lead.status !== 'Alta' && (
                                                                <button onClick={() => handleUpdateLeadStatus(lead.id, 'Perdido')} className="action-btn-subtle danger" title="Descartar"><XCircle size={16} /></button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {isAddingPatient && (
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                                <div className="glass-card animate-fade" style={{ maxWidth: '500px', width: '90%', padding: '2.5rem', position: 'relative' }}>
                                    <button onClick={() => setIsAddingPatient(false)} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)' }}><X size={20}/></button>
                                    <h2 className="serif-font" style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>Nuevo Paciente</h2>
                                    <p style={{ color: 'var(--text-soft)', marginBottom: '2rem', fontSize: '0.9rem' }}>Añade un paciente directamente a tu CRM.</p>
                                    
                                    <form onSubmit={handleAddPatient} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>Nombre Completo *</label>
                                            <input type="text" className="clean-input" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} required placeholder="Ej. Juan Pérez" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>Email</label>
                                            <input type="email" className="clean-input" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} placeholder="juan@ejemplo.com" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>Teléfono</label>
                                            <input type="tel" className="clean-input" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} placeholder="+56 9 ..." />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>Estado Inicial</label>
                                            <select className="clean-input" value={newPatient.status} onChange={e => setNewPatient({...newPatient, status: e.target.value})}>
                                                <option value="Paciente">Paciente Activo</option>
                                                <option value="Pendiente">Pendiente de agendar</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="premium-btn" style={{ justifyContent: 'center', marginTop: '1rem' }} disabled={isSubmittingPatient}>
                                            {isSubmittingPatient ? "Guardando..." : "Guardar Paciente"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "noticias" && (
                    <div className="animate-fade">
                        <header style={{ marginBottom: '2.5rem' }}>
                            <h1 className="serif-font" style={{ fontSize: '2.4rem', marginBottom: '0.2rem' }}>Tablón de Avisos</h1>
                            <p style={{ color: 'var(--text-soft)' }}>Noticias, comunicados y normativas desde administración.</p>
                        </header>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
                            {announcements.length === 0 ? (
                                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                                    <AlertCircle size={40} style={{ color: 'var(--text-soft)', marginBottom: '1rem', opacity: 0.5 }} />
                                    <h3 style={{ color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>Todo al día</h3>
                                    <p style={{ color: 'var(--text-soft)', margin: 0 }}>No hay comunicados recientes.</p>
                                </div>
                            ) : (
                                announcements.map(ann => (
                                    <div key={ann.id} className="glass-card" style={{ padding: '2rem', borderLeft: ann.is_read ? '2px solid rgba(0,0,0,0.1)' : '4px solid var(--primary)', opacity: ann.is_read ? 0.8 : 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                <h2 style={{ fontSize: '1.4rem', margin: 0, color: ann.is_read ? 'var(--text-main)' : 'var(--primary)' }}>{ann.title}</h2>
                                                {!ann.is_read && <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--primary-muted)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '50px', fontWeight: 'bold' }}>NUEVO</span>}
                                            </div>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)', background: 'var(--bg-serene)', padding: '0.3rem 0.6rem', borderRadius: '50px' }}>
                                                {new Date(ann.created_at).toLocaleDateString('es-CL')}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>
                                            {ann.content}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                            {ann.is_read ? (
                                                <button 
                                                    onClick={() => handleHideAnnouncement(ann.id)}
                                                    disabled={isUpdatingAnnouncement[ann.id]}
                                                    style={{ background: 'none', border: 'none', color: 'var(--text-soft)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', transition: 'color 0.2s' }}
                                                    onMouseOver={(e) => e.currentTarget.style.color = '#e74c3c'}
                                                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-soft)'}
                                                >
                                                    {isUpdatingAnnouncement[ann.id] ? <CheckCircle size={16} /> : <XCircle size={16} />} 
                                                    {isUpdatingAnnouncement[ann.id] ? 'Procesando...' : 'Ocultar aviso'}
                                                </button>
                                            ) : (
                                                <button 
                                                    className="premium-btn" 
                                                    onClick={() => handleMarkAnnouncementAsRead(ann.id)}
                                                    disabled={isUpdatingAnnouncement[ann.id]}
                                                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                >
                                                    <CheckCircle size={16} /> {isUpdatingAnnouncement[ann.id] ? 'Marcando...' : 'Marcar como leído'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "metricas" && (
                    <div className="animate-fade">
                        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <h1 className="serif-font" style={{ fontSize: '2.4rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    Panel de Desempeño
                                    <span style={{ fontSize: '0.9rem', backgroundColor: '#fff3cd', color: '#856404', padding: '0.3rem 0.8rem', borderRadius: '50px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)', letterSpacing: 'normal' }}><AlertCircle size={16}/> Próximamente disponible</span>
                                </h1>
                                <p style={{ color: 'var(--text-soft)' }}>Métricas calculadas en tiempo real para tu práctica privada.</p>
                            </div>
                        </header>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                            
                            <div className="glass-card" style={{ padding: '1.8rem', borderTop: '4px solid #10b981' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pacientes Activos</p>
                                    <div style={{ background: '#e6f4ea', padding: '8px', borderRadius: '10px', color: '#10b981' }}><Activity size={20}/></div>
                                </div>
                                <h2 style={{ fontSize: '2.8rem', color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1 }}>{activePatients}</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', margin: 0 }}>De {totalPatients} pacientes históricos</p>
                            </div>

                            <div className="glass-card" style={{ padding: '1.8rem', borderTop: '4px solid var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tasa de Conversión</p>
                                    <div style={{ background: '#f0f4f8', padding: '8px', borderRadius: '10px', color: 'var(--primary)' }}><TrendingUp size={20}/></div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <h2 style={{ fontSize: '2.8rem', color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1 }}>{conversionRate}%</h2>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', margin: 0 }}>Desde contactos totales ({totalLeads})</p>
                            </div>

                            <div className="glass-card" style={{ padding: '1.8rem', borderTop: '4px solid #f59e0b' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ingreso Pdte.</p>
                                    <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '10px', color: '#f59e0b' }}><DollarSign size={20}/></div>
                                </div>
                                <h2 style={{ fontSize: '2.8rem', color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1 }}>${(estimatedPendingIncome / 1000).toFixed(0)}k</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', margin: 0 }}>Requiere asociación manual</p>
                            </div>

                            <div className="glass-card" style={{ padding: '1.8rem', borderTop: '4px solid #8b7d6b' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ranking Global</p>
                                    <div style={{ background: '#f5f2ed', padding: '8px', borderRadius: '10px', color: '#8b7d6b' }}><Award size={20}/></div>
                                </div>
                                <h2 style={{ fontSize: '2.8rem', color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1 }}>0<span style={{ fontSize: '1.2rem', color: 'var(--text-soft)', fontWeight: 400 }}>/100</span></h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', margin: 0, fontWeight: '700' }}>Sin datos aún</p>
                            </div>
                        </div>

                        {/* Visual Trend Chart (CSS based for premium feel without massive libs) */}
                        <div className="glass-card" style={{ padding: '2.5rem', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Flujo de Reservas Recientes</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-soft)' }}>Representación de actividad semanal</p>
                                </div>
                            </div>
                            <div style={{ height: '260px', display: 'flex', alignItems: 'flex-end', gap: '2rem', justifyContent: 'space-around', paddingTop: '1rem', borderBottom: '1px solid #f1f3f5' }}>
                                {[0, 0, 0, 0, 0, 0, 0].map((h, i) => (
                                    <div key={i} style={{ flex: 1, height: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <div style={{ width: '40%', height: `${h}%`, background: 'linear-gradient(180deg, var(--primary-muted) 0%, rgba(94,114,107,0.3) 100%)', borderRadius: '8px 8px 0 0', transition: 'height 1s ease', position: 'relative' }}>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'space-around', marginTop: '1rem', color: 'var(--text-soft)', fontSize: '0.8rem', fontWeight: '600' }}>
                                {days.map(d => <span key={d} style={{ flex: 1, textAlign: 'center' }}>{d}</span>)}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "agenda" && (
                    <div className="animate-fade">
                        <header style={{ marginBottom: '2.5rem' }}>
                            <h1 className="serif-font" style={{ fontSize: '2.4rem', marginBottom: '0.2rem' }}>Configuración de Agenda</h1>
                            <p style={{ color: 'var(--text-soft)' }}>Administra tu disponibilidad y sincronización de calendario.</p>
                        </header>


                        <div className="glass-card" style={{ padding: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Bloques de Disponibilidad Semanal</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-soft)' }}>Selecciona las horas habilitadas para recibir nuevas reservas.</p>
                                </div>
                                <button className="premium-btn" onClick={saveAvailability} disabled={isSaving} style={{ padding: '0.8rem 1.5rem' }}>
                                    {isSaving ? "Guardando cambios..." : "Guardar Disponibilidad"}
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
                                {days.map(day => (
                                    <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        <div style={{ textAlign: 'center', padding: '0.8rem 0', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #e9ecef' }}>
                                            <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem' }}>{day}</p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {hours.map(time => {
                                                const isSelected = availability[day]?.includes(time);
                                                return (
                                                    <button 
                                                        key={time} 
                                                        onClick={() => toggleSlot(day, time)} 
                                                        style={{ 
                                                            padding: '0.7rem 0', 
                                                            border: isSelected ? '1px solid var(--primary)' : '1px solid #eee', 
                                                            borderRadius: '8px', 
                                                            fontSize: '0.85rem', 
                                                            cursor: 'pointer', 
                                                            backgroundColor: isSelected ? 'var(--primary)' : '#fff',
                                                            color: isSelected ? '#fff' : 'var(--text-soft)',
                                                            fontWeight: isSelected ? '600' : '400',
                                                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                                            width: '100%',
                                                            boxShadow: isSelected ? '0 4px 10px rgba(45,62,64,0.15)' : 'none'
                                                        }}>
                                                        {time}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "perfil" && (
                    <div className="animate-fade">
                        <header style={{ marginBottom: '2.5rem' }}>
                            <h1 className="serif-font" style={{ fontSize: '2.4rem', marginBottom: '0.2rem' }}>Perfil Profesional</h1>
                            <p style={{ color: 'var(--text-soft)' }}>Personaliza cómo te ven los pacientes en la plataforma.</p>
                        </header>

                        <div className="glass-card" style={{ padding: '3rem', maxWidth: '800px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', paddingBottom: '2rem', borderBottom: '1px solid #f1f3f5' }}>
                                    <div style={{ position: 'relative' }}>
                                        <img src={therapistInfo.image || "https://via.placeholder.com/120"} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '24px', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>{therapistInfo.name}</h2>
                                        <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '0.95rem' }}>Las fotos de perfil se administran internamente. Contáctanos si deseas cambiarla.</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Visibilidad de Especialidad</label>
                                        <input
                                            type="text"
                                            value={profile.title}
                                            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                            placeholder="Ej. Psicólogo Clínico Especialista en Ansiedad"
                                            className="clean-input"
                                        />
                                        <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-soft)' }}>Título visible debajo de tu nombre en las tarjetas.</p>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Precio de Sesión (CLP)</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)', fontWeight: 'bold' }}>$</span>
                                            <input
                                                type="text"
                                                value={profile.price}
                                                onChange={(e) => setProfile({ ...profile, price: e.target.value })}
                                                placeholder="35000"
                                                className="clean-input"
                                                style={{ paddingLeft: '2rem' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Duración de Sesión</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }}><Clock size={16}/></span>
                                            <input
                                                type="text"
                                                value={profile.duration}
                                                onChange={(e) => setProfile({ ...profile, duration: e.target.value })}
                                                placeholder="50 min"
                                                className="clean-input"
                                                style={{ paddingLeft: '2.5rem' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Especialista en resolver (Etiquetas separadas por comas)</label>
                                        <input
                                            type="text"
                                            value={profile.tags}
                                            onChange={(e) => setProfile({ ...profile, tags: e.target.value })}
                                            placeholder="Ej. Ansiedad Severa, Mindfulness, Trastornos del Sueño"
                                            className="clean-input"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Formación Base</label>
                                        <input
                                            type="text"
                                            value={profile.education}
                                            onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                                            placeholder="Ej. Harvard Medical School"
                                            className="clean-input"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Impacto Clínico</label>
                                        <input
                                            type="text"
                                            value={profile.impact}
                                            onChange={(e) => setProfile({ ...profile, impact: e.target.value })}
                                            placeholder="Ej. Más de 2.400+ procesos dirigidos"
                                            className="clean-input"
                                        />
                                    </div>

                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Frase Destacada (Cita personal)</label>
                                        <textarea
                                            value={profile.quote}
                                            onChange={(e) => setProfile({ ...profile, quote: e.target.value })}
                                            placeholder='"La claridad mental no es la ausencia de pensamientos..."'
                                            className="clean-input"
                                            rows={2}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>

                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Biografía y Enfoque</label>
                                        <textarea
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            placeholder="Con más de 15 años de experiencia, mi enfoque se centra en..."
                                            className="clean-input"
                                            rows={4}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>
                                    
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Mi Metodología</label>
                                        <textarea
                                            value={profile.methodology}
                                            onChange={(e) => setProfile({ ...profile, methodology: e.target.value })}
                                            placeholder="Trabajamos en identificar los patrones de pensamiento..."
                                            className="clean-input"
                                            rows={3}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>

                                    <div style={{ gridColumn: '1 / -1', paddingBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Texto del Botón de Reserva</label>
                                        <input
                                            type="text"
                                            value={profile.button_text}
                                            onChange={(e) => setProfile({ ...profile, button_text: e.target.value })}
                                            placeholder="Ej. Agendar Evaluación de Ingreso"
                                            className="clean-input"
                                            style={{ background: '#f8f9fa', borderColor: '#d1e7dd', fontWeight: 'bold', color: 'var(--primary)' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #f1f3f5' }}>
                                    <button className="premium-btn" onClick={saveProfile} disabled={isSavingProfile} style={{ padding: '0.9rem 2.5rem' }}>
                                        <CheckCircle size={18} /> {isSavingProfile ? "Actualizando perfil..." : "Guardar Configuración"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Patient Editor Modal */}
                {editingLead && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
                        <div className="glass-card animate-fade" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '0' }}>
                            <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid #f1f3f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfaf7' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.3rem 0', color: 'var(--primary)' }}>Expediente Clínico</h2>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-soft)' }}>Información privada del paciente.</p>
                                </div>
                                <button onClick={() => setEditingLead(null)} style={{ background: '#fff', border: '1px solid #eee', cursor: 'pointer', color: 'var(--text-soft)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-soft)'}><X size={20} /></button>
                            </div>
                            
                            <div style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-soft)', textTransform: 'uppercase' }}>Nombre completo</label>
                                        <input type="text" value={editingLead.name} disabled className="clean-input" style={{ backgroundColor: '#f1f3f5', opacity: 0.8, cursor: 'not-allowed' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-soft)', textTransform: 'uppercase' }}>RUT o Identificación</label>
                                        <input type="text" value={editingLead.rut || ''} onChange={e => setEditingLead({...editingLead, rut: e.target.value})} placeholder="Ej. 12.345.678-9" className="clean-input" />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-soft)', textTransform: 'uppercase' }}>Correo Electrónico <span style={{ color: '#dc2626' }}>*</span></label>
                                        <input type="email" value={editingLead.email || ''} onChange={e => setEditingLead({...editingLead, email: e.target.value})} placeholder="Ej. correo@ejemplo.com" className="clean-input" style={{ border: !editingLead.email ? '1px solid #fca5a5' : undefined }} />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-soft)', textTransform: 'uppercase' }}>Dirección / Localidad</label>
                                        <input type="text" value={editingLead.address || ''} onChange={e => setEditingLead({...editingLead, address: e.target.value})} placeholder="Comuna, Región..." className="clean-input" />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-soft)', textTransform: 'uppercase' }}>Motivo de Consulta (Temática)</label>
                                        <input type="text" value={editingLead.theme || ''} onChange={e => setEditingLead({...editingLead, theme: e.target.value})} placeholder="Ej. Ansiedad Generalizada, Terapia de pareja..." className="clean-input" />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-soft)', textTransform: 'uppercase' }}>Notas y Observaciones Clínicas</label>
                                        <textarea value={editingLead.observations || ''} onChange={e => setEditingLead({...editingLead, observations: e.target.value})} rows={6} placeholder="Registro de evolución, consideraciones especiales..." className="clean-input" style={{ resize: 'vertical' }}></textarea>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f3f5' }}>
                                    <button onClick={() => setEditingLead(null)} className="secondary-btn" style={{ padding: '0.8rem 1.5rem' }}>Cancelar</button>
                                    <button onClick={() => handleSaveLeadDetails(editingLead)} className="premium-btn" style={{ padding: '0.8rem 2rem' }}>Guardar Expediente</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Missing Email Alert Modal */}
                {missingEmailAlert.show && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '2rem' }}>
                        <div className="glass-card animate-fade" style={{ width: '100%', maxWidth: '450px', padding: '0', textAlign: 'center', overflow: 'hidden' }}>
                            <div style={{ backgroundColor: '#fee2e2', padding: '2rem', borderBottom: '1px solid #fca5a5' }}>
                                <AlertCircle size={64} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
                                <h2 style={{ color: '#991b1b', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Correo Faltante</h2>
                            </div>
                            <div style={{ padding: '2rem' }}>
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                    Es <strong>ESTRICTAMENTE NECESARIO</strong> incluir un correo electrónico antes de convertir un lead a <strong>Paciente Activo</strong>.
                                </p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-soft)', marginBottom: '2rem' }}>
                                    El correo es vital para enviarle comprobantes o boletas, enlaces de su portal privado y las comunicaciones de ingreso.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button onClick={() => setMissingEmailAlert({ show: false, leadId: null })} className="secondary-btn" style={{ padding: '0.8rem 1.5rem', width: '100%' }}>Entendido</button>
                                    <button onClick={() => {
                                        const lead = leads.find(l => l.id === missingEmailAlert.leadId);
                                        setMissingEmailAlert({ show: false, leadId: null });
                                        if (lead) setEditingLead(lead);
                                    }} className="premium-btn" style={{ padding: '0.8rem 1.5rem', width: '100%', backgroundColor: '#dc2626', color: '#fff', border: 'none' }}>Agregar Correo</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
