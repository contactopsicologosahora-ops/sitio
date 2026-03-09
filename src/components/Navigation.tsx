"use client";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

export default function Navigation() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    // Initial check for mobile and auth

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
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            padding: '1.2rem 8%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            gap: '1rem',
            transition: 'all 0.3s ease'
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
                    <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
                        <li><Link href="/" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--primary)', textDecoration: 'none', transition: 'color 0.2s' }}>Inicio</Link></li>
                        <li><Link href="/terapeutas" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--primary)', textDecoration: 'none', transition: 'color 0.2s' }}>Expertos</Link></li>
                        <li style={{ marginLeft: '0.5rem' }}>
                            {role ? (
                                <Link href={role === "admin" ? "/dashboard/admin" : "/dashboard/terapeuta"} className="premium-btn" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem', height: '40px' }}>
                                    <User size={16} /> Mi Panel
                                </Link>
                            ) : (
                                <Link href="/login" className="premium-btn" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem', height: '40px' }}>
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
