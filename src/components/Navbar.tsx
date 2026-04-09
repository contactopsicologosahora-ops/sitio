"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleQuickLogin = (role: string) => {
        setIsOpen(false);
        if (role === "terapeuta") {
            localStorage.setItem("user_role", "terapeuta");
            localStorage.setItem("user_name", "Verónica Cuadra");
            localStorage.setItem("user_email", "claudio@correo.com");
            localStorage.setItem("therapist_id", "1");
            router.push("/dashboard/terapeuta");
        } else if (role === "admin") {
            localStorage.setItem("user_role", "admin");
            localStorage.setItem("user_name", "Admin Master");
            router.push("/dashboard/admin");
        } else if (role === "paciente") {
            localStorage.setItem("user_role", "paciente");
            localStorage.setItem("user_name", "Paciente de Prueba");
            router.push("/dashboard/paciente");
        }
    };

    return (
        <nav style={{ position: "relative" }}>
            <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', alignItems: 'center' }}>
                <li><Link href="/" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'inherit', textDecoration: 'none' }}>Inicio</Link></li>
                <li><Link href="/terapeutas" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'inherit', textDecoration: 'none' }}>Expertos</Link></li>
                
                {/* Dropdown de Ingresar */}
                <li 
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    style={{ position: "relative" }}
                >
                    <button 
                        style={{ 
                            fontSize: '0.95rem', 
                            fontWeight: '600', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            backgroundColor: 'transparent',
                            color: 'var(--primary)',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '50px',
                            border: '1.5px solid var(--primary)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Ingresar <LogIn size={16} />
                    </button>

                    {isOpen && (
                        <div style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            paddingTop: "0.5rem",
                            width: "220px",
                            zIndex: 1000
                        }}>
                            <div style={{
                                backgroundColor: "#fff",
                                borderRadius: "12px",
                                padding: "0.5rem",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                                border: "1px solid rgba(0,0,0,0.05)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.3rem"
                            }}>
                                <button onClick={() => handleQuickLogin('terapeuta')} style={{ 
                                    padding: '0.8rem 1rem', 
                                    textDecoration: 'none', 
                                    color: 'var(--primary)', 
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    borderRadius: '8px',
                                    display: 'block',
                                    textAlign: 'left',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    👨‍⚕️ Soy Terapeuta
                                </button>
                                <button onClick={() => handleQuickLogin('paciente')} style={{ 
                                    padding: '0.8rem 1rem', 
                                    textDecoration: 'none', 
                                    color: 'var(--primary)', 
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    borderRadius: '8px',
                                    display: 'block',
                                    textAlign: 'left',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    🛋️ Soy Paciente
                                </button>
                                <hr style={{ borderTop: '1px solid #eee', margin: '0.2rem 0' }} />
                                <button onClick={() => handleQuickLogin('admin')} style={{ 
                                    padding: '0.8rem 1rem', 
                                    textDecoration: 'none', 
                                    color: 'var(--text-soft)', 
                                    fontSize: '0.85rem',
                                    borderRadius: '8px',
                                    display: 'block',
                                    textAlign: 'left',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    ⚙️ Administrador
                                </button>
                            </div>
                        </div>
                    )}
                </li>
            </ul>
        </nav>
    );
}
