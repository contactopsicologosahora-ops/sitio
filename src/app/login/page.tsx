"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, User, ShieldCheck, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (role: string) => {
        setIsLoading(true);
        setSelectedRole(role);

        // Simulamos un retraso de red
        setTimeout(() => {
            if (role === "terapeuta") {
                localStorage.setItem("user_role", "terapeuta");
                localStorage.setItem("user_name", "Verónica Cuadra");
                localStorage.setItem("user_email", "claudio@correo.com"); // Email para match de prueba
                localStorage.setItem("therapist_id", "1");
                router.push("/dashboard/terapeuta");
            } else if (role === "admin") {
                localStorage.setItem("user_role", "admin");
                localStorage.setItem("user_name", "Admin Master");
                router.push("/dashboard/admin");
            } else if (role === "paciente") {
                localStorage.setItem("user_role", "paciente");
                localStorage.setItem("user_name", "Paciente de Prueba");
                router.push("/dashboard/paciente"); // Próxima característica a implementar
            }
        }, 800);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#faf9f6', padding: '2rem' }}>
            <div className="glass-morphism" style={{ maxWidth: '480px', width: '100%', padding: '3rem', borderRadius: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--primary)', letterSpacing: '-0.02em', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></span>
                    Psicólogos <span className="serif-font" style={{ fontWeight: '400', fontStyle: 'italic', marginLeft: '0.2rem' }}>Ahora</span>
                </div>
                
                <h1 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: '#333' }}>Bienvenido de nuevo</h1>
                <p style={{ color: 'var(--text-soft)', marginBottom: '3rem', fontSize: '0.95rem' }}>Selecciona tu perfil para ingresar a tu panel de control personalizado.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button 
                        onClick={() => handleLogin('terapeuta')}
                        disabled={isLoading}
                        style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '1.2rem', backgroundColor: '#fff', border: '1px solid #eee', 
                            borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                            opacity: isLoading && selectedRole !== 'terapeuta' ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ backgroundColor: '#eef2ff', padding: '0.8rem', borderRadius: '12px' }}>
                                <Stethoscope size={24} color="var(--primary)" />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ display: 'block', fontWeight: '600', color: '#222', fontSize: '1.05rem' }}>Perfil Terapeuta</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>Conectar con mis pacientes</span>
                            </div>
                        </div>
                        {isLoading && selectedRole === 'terapeuta' ? <span className="animate-spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></span> : <ArrowRight size={20} color="var(--text-soft)" />}
                    </button>

                    <button 
                        onClick={() => handleLogin('paciente')}
                        disabled={isLoading}
                        style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '1.2rem', backgroundColor: '#fff', border: '1px solid #eee', 
                            borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                            opacity: isLoading && selectedRole !== 'paciente' ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ backgroundColor: '#fdf4ff', padding: '0.8rem', borderRadius: '12px' }}>
                                <User size={24} color="#a21caf" />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ display: 'block', fontWeight: '600', color: '#222', fontSize: '1.05rem' }}>Perfil Paciente</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>Ver mis próximas citas</span>
                            </div>
                        </div>
                        {isLoading && selectedRole === 'paciente' ? <span className="animate-spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid #a21caf', borderTopColor: 'transparent', borderRadius: '50%' }}></span> : <ArrowRight size={20} color="var(--text-soft)" />}
                    </button>

                    <button 
                        onClick={() => handleLogin('admin')}
                        disabled={isLoading}
                        style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '1.2rem', backgroundColor: '#fff', border: '1px solid #eee', 
                            borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                            opacity: isLoading && selectedRole !== 'admin' ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ backgroundColor: '#f0fdf4', padding: '0.8rem', borderRadius: '12px' }}>
                                <ShieldCheck size={24} color="#15803d" />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ display: 'block', fontWeight: '600', color: '#222', fontSize: '1.05rem' }}>Administración</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>Gestión global de plataforma</span>
                            </div>
                        </div>
                        {isLoading && selectedRole === 'admin' ? <span className="animate-spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid #15803d', borderTopColor: 'transparent', borderRadius: '50%' }}></span> : <ArrowRight size={20} color="var(--text-soft)" />}
                    </button>
                </div>
            </div>
            {/* Simple CSS animation class mapped explicitly for this page to assure it exists */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}} />
        </div>
    );
}
