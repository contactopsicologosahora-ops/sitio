import type { Metadata } from "next";
import "./globals.css";

import Navigation from "@/components/Navigation";

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
                {/* Google Tag Manager */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KZLGLTCL');`
                    }}
                />
                {/* End Google Tag Manager */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
            </head>
            <body style={{ paddingTop: '80px' }}>
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-KZLGLTCL"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    />
                </noscript>
                {/* End Google Tag Manager (noscript) */}
                <Navigation />
                <main style={{ minHeight: 'calc(100vh - 80px)' }}>{children}</main>
                <footer style={{ padding: '5rem 8% 3rem', backgroundColor: '#faf9f6', borderTop: '1px solid #f0efeb' }}>
                    <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
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
