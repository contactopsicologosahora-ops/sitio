"use client";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);

        // Listen for user role changes (using local storage for this simplified multi-role demo)
        const checkAuth = () => {
            setRole(localStorage.getItem("user_role"));
        };
        checkAuth();

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="glass-morphism" style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '1.2rem 8%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            gap: '1rem'
        }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '600', color: 'var(--primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></span>
                Psicólogos <span className="serif-font" style={{ fontWeight: '400', fontStyle: 'italic', marginLeft: '0.2rem' }}>Ahora</span>
            </div>

            {isMobile ? (
                <>
                    <button onClick={toggleMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    {isMenuOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderBottom: '1px solid rgba(0,0,0,0.1)',
                            padding: '2rem 8%',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                        }}>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
                                <li><Link href="/" onClick={toggleMenu} style={{ fontSize: '1.2rem', fontWeight: '500', color: 'var(--primary)', textDecoration: 'none' }}>Inicio</Link></li>
                                <li><Link href="/terapeutas" onClick={toggleMenu} style={{ fontSize: '1.2rem', fontWeight: '500', color: 'var(--primary)', textDecoration: 'none' }}>Expertos</Link></li>
                                <li style={{ marginTop: '1rem' }}>
                                    {role ? (
                                        <Link href={role === "admin" ? "/dashboard/admin" : "/dashboard/terapeuta"} onClick={toggleMenu} className="premium-btn" style={{ fontSize: '1rem', width: '100%', justifyContent: 'center' }}>
                                            <User size={18} /> Mi Panel
                                        </Link>
                                    ) : (
                                        <Link href="/login" onClick={toggleMenu} className="premium-btn" style={{ fontSize: '1rem', width: '100%', justifyContent: 'center' }}>
                                            Ingresar
                                        </Link>
                                    )}
                                </li>
                            </ul>
                        </div>
                    )}
                </>
            ) : (
                <nav>
                    <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', flexWrap: 'wrap', justifyContent: 'center', margin: 0, padding: 0 }}>
                        <li><Link href="/" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--primary)', textDecoration: 'none' }}>Inicio</Link></li>
                        <li><Link href="/terapeutas" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--primary)', textDecoration: 'none' }}>Expertos</Link></li>
                        <li style={{ marginLeft: '1rem' }}>
                            {role ? (
                                <Link href={role === "admin" ? "/dashboard/admin" : "/dashboard/terapeuta"} className="premium-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                                    <User size={16} /> Mi Panel
                                </Link>
                            ) : (
                                <Link href="/login" className="premium-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                                    Ingresar
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
}
