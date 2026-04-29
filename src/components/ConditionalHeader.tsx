"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ConditionalHeader() {
    const pathname = usePathname();
    
    // Ocultar el menú principal en la ruta /terapeutas
    if (pathname && pathname.startsWith('/terapeutas')) {
        return null;
    }

    return (
        <header className="glass-morphism" style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '1.2rem 8%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '600', color: 'var(--primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></span>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                    Psicólogos <span className="serif-font" style={{ fontWeight: '400', fontStyle: 'italic', marginLeft: '0.2rem' }}>Ahora</span>
                </Link>
            </div>
            <Navbar />
        </header>
    );
}
