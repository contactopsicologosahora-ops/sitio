import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Psicólogos Ahora | Centro de Excelencia Psicoterapéutica",
    description: "Encuentra paz y acompañamiento experto con nuestros terapeutas especializados.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
            </head>
            <body>
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
                        Psicólogos <span className="serif-font" style={{ fontWeight: '400', fontStyle: 'italic', marginLeft: '0.2rem' }}>Ahora</span>
                    </div>
                    <nav>
                        <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none' }}>
                            <li><a href="/" style={{ fontSize: '0.95rem', fontWeight: '500' }}>Inicio</a></li>
                            <li><a href="/terapeutas" style={{ fontSize: '0.95rem', fontWeight: '500' }}>Expertos</a></li>
                            <li><a href="/dashboard/admin" style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>Admin</a></li>
                        </ul>
                    </nav>
                </header>
                <main>{children}</main>
                <footer style={{ padding: '5rem 8% 3rem', backgroundColor: '#faf9f6', borderTop: '1px solid #f0efeb' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
                        <div>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Psicólogos Ahora</h3>
                            <p style={{ color: 'var(--text-soft)', maxWidth: '300px' }}>Comprometidos con la salud mental a través de un acompañamiento clínico de excelencia y ético.</p>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Enlaces</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <li><a href="/terapeutas" style={{ color: 'var(--text-soft)' }}>Nuestros Especialistas</a></li>
                                <li><a href="#" style={{ color: 'var(--text-soft)' }}>Cómo Funciona</a></li>
                                <li><a href="#" style={{ color: 'var(--text-soft)' }}>Contacto</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Legal</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <li><a href="#" style={{ color: 'var(--text-soft)' }}>Ética Profesional</a></li>
                                <li><a href="#" style={{ color: 'var(--text-soft)' }}>Privacidad</a></li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', paddingTop: '3rem', borderTop: '1px solid #eee', color: 'var(--text-soft)', fontSize: '0.9rem' }}>
                        &copy; 2026 Psicólogos Ahora. Centro de Excelencia Clínica Online.
                    </div>
                </footer>
            </body>
        </html>
    );
}
