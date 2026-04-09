"use client";
import { useState, useEffect } from "react";
import { User, Calendar, BookOpen, CreditCard, Clock, CheckCircle, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PatientDashboard() {
    const [patientInfo, setPatientInfo] = useState<any>(null);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState("");

    const [activeTab, setActiveTab] = useState("inicio");
    const [payments, setPayments] = useState<any[]>([]);
    
    // Para el perfil
    const [profileForm, setProfileForm] = useState({ rut: '', phone: '', address: '' });
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    useEffect(() => {
        // En un flujo real avanzado, guardaríamos este paciente en localStorage o context 
        // para persistir la sesión. Por simplicidad de este demo, pediremos login si refrescan.
        const storedId = localStorage.getItem('patient_id');
        if (storedId) {
            fetchPatientInfo(Number(storedId));
        }
    }, []);

    const fetchPatientInfo = async (id: number) => {
        try {
            const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();
            if (data && (data.status === 'Paciente' || data.status === 'Alta')) {
                setPatientInfo(data);
                setProfileForm({ rut: data.rut || '', phone: data.phone || '', address: data.address || '' });
                fetchPayments(id);
            }
        } catch (error) {
            console.error("Error fetching patient info:", error);
        }
    };

    const fetchPayments = async (patientId: number) => {
        try {
            const { data, error } = await supabase.from('payments').select('*').eq('patient_id', patientId).order('created_at', { ascending: false });
            if (data && !error) setPayments(data);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError("");
        try {
            // Buscamos el Lead por email y password
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('email', loginEmail)
                .eq('password', loginPassword)
                .or('status.eq.Paciente,status.eq.Alta')
                .single();

            if (error || !data) {
                throw new Error("Credenciales incorrectas o no tienes acceso como paciente.");
            }

            setPatientInfo(data);
            setProfileForm({ rut: data.rut || '', phone: data.phone || '', address: data.address || '' });
            localStorage.setItem('patient_id', data.id.toString());
            fetchPayments(data.id);
            
        } catch (error: any) {
            setLoginError(error.message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('patient_id');
        setPatientInfo(null);
    };

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        try {
            const { error } = await supabase.from('leads').update({
                rut: profileForm.rut,
                phone: profileForm.phone,
                address: profileForm.address
            }).eq('id', patientInfo.id);

            if (error) throw error;
            setPatientInfo({ ...patientInfo, rut: profileForm.rut, phone: profileForm.phone, address: profileForm.address });
            alert('¡Perfil actualizado con éxito!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Hubo un error al actualizar el perfil.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    if (!patientInfo) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-serene)' }}>
                <div className="expert-card" style={{ maxWidth: '400px', width: '90%', textAlign: 'center', padding: '3rem 2rem' }}>
                    <User size={48} style={{ color: 'var(--accent)', marginBottom: '1rem', backgroundColor: 'var(--accent-light)', padding: '10px', borderRadius: '50%' }} />
                    <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>Portal de Pacientes</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-soft)', fontSize: '0.9rem' }}>Ingresa con el correo y la contraseña que recibiste en tu email.</p>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="email"
                            placeholder="Tu correo electrónico"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            style={{ padding: '0.9rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', outline: 'none' }}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Tu contraseña"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            style={{ padding: '0.9rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', outline: 'none' }}
                            required
                        />
                        {loginError && <p style={{ color: '#e74c3c', fontSize: '0.85rem', margin: 0, fontWeight: '500' }}>{loginError}</p>}
                        <button type="submit" className="premium-btn" style={{ marginTop: '0.5rem', justifyContent: 'center' }} disabled={isLoggingIn}>
                            {isLoggingIn ? "Verificando..." : "Acceder"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-serene)' }}>
            <div style={{ display: 'flex' }}>
                {/* Sidebar */}
                <aside style={{ width: '280px', backgroundColor: 'var(--white)', borderRight: '1px solid rgba(0,0,0,0.05)', padding: '3rem 1.5rem', height: '100vh', position: 'sticky', top: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary)' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
                        Psicólogos Ahora
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button onClick={() => setActiveTab("inicio")} style={{ padding: '1rem', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem', fontWeight: '500', color: activeTab === "inicio" ? 'var(--primary)' : 'var(--text-soft)', backgroundColor: activeTab === "inicio" ? 'var(--accent-light)' : 'transparent', transition: 'all 0.2s' }}>
                            <User size={20} /> Inicio
                        </button>
                        <button onClick={() => setActiveTab("sesiones")} style={{ padding: '1rem', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem', fontWeight: '500', color: activeTab === "sesiones" ? 'var(--primary)' : 'var(--text-soft)', backgroundColor: activeTab === "sesiones" ? 'var(--accent-light)' : 'transparent', transition: 'all 0.2s' }}>
                            <Calendar size={20} /> Mis Sesiones
                        </button>
                        <button onClick={() => setActiveTab("recursos")} style={{ padding: '1rem', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem', fontWeight: '500', color: activeTab === "recursos" ? 'var(--primary)' : 'var(--text-soft)', backgroundColor: activeTab === "recursos" ? 'var(--accent-light)' : 'transparent', transition: 'all 0.2s' }}>
                            <BookOpen size={20} /> Recursos
                        </button>
                        <button onClick={() => setActiveTab("pagos")} style={{ padding: '1rem', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem', fontWeight: '500', color: activeTab === "pagos" ? 'var(--primary)' : 'var(--text-soft)', backgroundColor: activeTab === "pagos" ? 'var(--accent-light)' : 'transparent', transition: 'all 0.2s' }}>
                            <CreditCard size={20} /> Pagos y Boletas
                        </button>
                        <button onClick={() => setActiveTab("perfil")} style={{ padding: '1rem', border: 'none', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem', fontWeight: '500', color: activeTab === "perfil" ? 'var(--primary)' : 'var(--text-soft)', backgroundColor: activeTab === "perfil" ? 'var(--accent-light)' : 'transparent', transition: 'all 0.2s' }}>
                            <User size={20} /> Mi Perfil
                        </button>
                    </nav>

                    <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {patientInfo.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{patientInfo.name}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Paciente</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} style={{ width: '100%', padding: '0.6rem', border: '1px solid #eee', backgroundColor: '#fafafa', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <LogOut size={16} /> Cerrar Sesión
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, padding: '4rem 5% 8rem', maxWidth: '1000px' }}>

                    {activeTab === "inicio" && (
                        <div className="animate-fade">
                            <header style={{ marginBottom: '3rem' }}>
                                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>Hola, {patientInfo.name.split(' ')[0]}</h1>
                                <p style={{ color: 'var(--text-soft)', fontSize: '1.1rem' }}>Bienvenido(a) a tu espacio personal.</p>
                            </header>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                                <div className="expert-card" style={{ padding: '2rem', borderLeft: '4px solid var(--accent)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ padding: '10px', backgroundColor: 'var(--accent-light)', borderRadius: '12px' }}>
                                            <Calendar size={24} color="var(--primary)" />
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary)' }}>Próxima Sesión</h3>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-soft)', marginBottom: '1rem' }}>Agenda tu sesión o contacta a tu terapeuta para confirmar el próximo turno.</p>
                                    <button className="secondary-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', width: '100%' }}>Agendar Turno</button>
                                </div>

                                <div className="expert-card" style={{ padding: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ padding: '10px', backgroundColor: '#e8f0e9', borderRadius: '12px' }}>
                                            <CheckCircle size={24} color="#198754" />
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary)' }}>Progreso</h3>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                        <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--primary)', lineHeight: 1 }}>{patientInfo.sessions || 0}</h2>
                                        <span style={{ color: 'var(--text-soft)', fontWeight: '500' }}>sesiones acumuladas</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: '#198754', marginTop: '1rem', fontWeight: '600' }}>¡Gran trabajo! Sigue así.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "sesiones" && (
                        <div className="animate-fade">
                            <header style={{ marginBottom: '3rem' }}>
                                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>Mis Sesiones</h1>
                                <p style={{ color: 'var(--text-soft)' }}>Historial de avance terapéutico.</p>
                            </header>

                            <div className="expert-card" style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                                    <div>
                                        <h3 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>Total de Sesiones Asistidas</h3>
                                        <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>Desde tu ingreso al programa</p>
                                    </div>
                                    <div style={{ backgroundColor: 'var(--primary)', color: '#fff', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        {patientInfo.sessions || 0}
                                    </div>
                                </div>
                                <div style={{ paddingTop: '1.5rem', textAlign: 'center' }}>
                                    <Clock size={32} style={{ color: '#ccc', marginBottom: '1rem' }} />
                                    <p style={{ color: 'var(--text-soft)', fontSize: '0.95rem' }}>El historial detallado por fecha se habilitará muy pronto.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "recursos" && (
                        <div className="animate-fade">
                            <header style={{ marginBottom: '3rem' }}>
                                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>Tus Recursos</h1>
                                <p style={{ color: 'var(--text-soft)' }}>Material de apoyo para trabajar entre sesiones.</p>
                            </header>

                            <div style={{ backgroundColor: '#fff', border: '1px dashed #ccc', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center' }}>
                                <BookOpen size={48} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Zon de Enfoque en Construcción</h3>
                                <p style={{ color: 'var(--text-soft)', maxWidth: '400px', margin: '0 auto' }}>Aquí el terapeuta te enviará lecturas, audios meditativos o ejercicios semanales para potenciar tu proceso. ¡Pronto disponible!</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "pagos" && (
                        <div className="animate-fade">
                            <header style={{ marginBottom: '3rem' }}>
                                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>Pagos y Boletas</h1>
                                <p style={{ color: 'var(--text-soft)' }}>Historial de transacciones identificables realizadas por ti.</p>
                            </header>

                            {payments.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '20px', boxShadow: 'var(--shadow-sm)' }}>
                                    <p style={{ color: 'var(--text-soft)' }}>No se han encontrado pagos asociados a tu cuenta aún.</p>
                                </div>
                            ) : (
                                <div className="expert-card" style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #eee' }}>
                                                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-soft)', fontWeight: '600', fontSize: '0.85rem' }}>FECHA</th>
                                                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-soft)', fontWeight: '600', fontSize: '0.85rem' }}>SERVICIO</th>
                                                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-soft)', fontWeight: '600', fontSize: '0.85rem' }}>MONTO</th>
                                                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-soft)', fontWeight: '600', fontSize: '0.85rem' }}>ESTADO</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map(payment => (
                                                <tr key={payment.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                                    <td style={{ padding: '1.5rem', fontSize: '0.95rem' }}>
                                                        {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'Pendiente'}
                                                    </td>
                                                    <td style={{ padding: '1.5rem', fontSize: '0.95rem', color: 'var(--primary)', fontWeight: '500' }}>
                                                        {payment.service_name || 'Sesión de Terapia'}
                                                    </td>
                                                    <td style={{ padding: '1.5rem', fontSize: '0.95rem', fontWeight: 'bold' }}>
                                                        ${payment.amount?.toLocaleString('es-CL')}
                                                    </td>
                                                    <td style={{ padding: '1.5rem' }}>
                                                        <span style={{ padding: '0.4rem 0.8rem', backgroundColor: '#e8f0e9', color: '#198754', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                            {payment.status === 'matched' ? 'Completado' : payment.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "perfil" && (
                        <div className="animate-fade">
                            <header style={{ marginBottom: '3rem' }}>
                                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>Mi Perfil</h1>
                                <p style={{ color: 'var(--text-soft)' }}>Actualiza tus datos para las boletas y contacto.</p>
                            </header>

                            <div className="expert-card" style={{ padding: '3rem', maxWidth: '600px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--primary)' }}>Nombre Completo</label>
                                        <input type="text" value={patientInfo.name} disabled style={{ width: '100%', padding: '0.9rem', borderRadius: '8px', border: '1px solid #eee', backgroundColor: '#fafafa', color: '#888' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--primary)' }}>Correo Electrónico (Tu acceso)</label>
                                        <input type="email" value={patientInfo.email} disabled style={{ width: '100%', padding: '0.9rem', borderRadius: '8px', border: '1px solid #eee', backgroundColor: '#fafafa', color: '#888' }} />
                                    </div>
                                    <hr style={{ border: 'none', borderTop: '1px dashed #ddd', margin: '0.5rem 0' }} />
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--primary)' }}>Teléfono</label>
                                        <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} placeholder="Ej. +569 1234 5678" style={{ width: '100%', padding: '0.9rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--primary)' }}>RUT</label>
                                        <input type="text" value={profileForm.rut} onChange={(e) => setProfileForm({...profileForm, rut: e.target.value})} placeholder="Ej. 12.345.678-9" style={{ width: '100%', padding: '0.9rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--primary)' }}>Dirección / Comuna</label>
                                        <input type="text" value={profileForm.address} onChange={(e) => setProfileForm({...profileForm, address: e.target.value})} placeholder="Av. Providencia 1234" style={{ width: '100%', padding: '0.9rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }} />
                                    </div>

                                    <button className="premium-btn" style={{ marginTop: '1rem', justifyContent: 'center' }} onClick={handleSaveProfile} disabled={isSavingProfile}>
                                        {isSavingProfile ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
