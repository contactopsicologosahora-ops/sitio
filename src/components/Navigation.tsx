"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        // Initial check
        checkMobile();
        window.addEventListener("resize", checkMobile);
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
                                <li><Link href="/dashboard/admin" onClick={toggleMenu} style={{ fontSize: '1rem', color: 'var(--text-soft)', textDecoration: 'none' }}>Admin</Link></li>
                            </ul>
                        </div>
                    )}
                </>
            ) : (
                <nav>
                    <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', flexWrap: 'wrap', justifyContent: 'center', margin: 0, padding: 0 }}>
                        <li><Link href="/" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--primary)', textDecoration: 'none' }}>Inicio</Link></li>
                        <li><Link href="/terapeutas" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--primary)', textDecoration: 'none' }}>Expertos</Link></li>
                        <li><Link href="/dashboard/admin" style={{ color: 'var(--text-soft)', fontSize: '0.85rem', textDecoration: 'none' }}>Admin</Link></li>
                    </ul>
                </nav>
            )}
        </header>
    );
}
