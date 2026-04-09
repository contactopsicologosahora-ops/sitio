import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
    title: "Psicólogos Ahora | Centro de Excelencia Psicoterapéutica",
    description: "Encuentra paz y acompañamiento experto con nuestros terapeutas especializados 100% online en Chile. Agenda tu consulta.",
    metadataBase: new URL('https://psicologosahora.cl'),
    openGraph: {
        type: 'website',
        locale: 'es_CL',
        url: 'https://psicologosahora.cl',
        siteName: 'Psicólogos Ahora',
        title: 'Psicólogos Ahora | Centro de Excelencia Psicoterapéutica',
        description: 'Terapia en línea con especialistas clínicos. Agenda ahora tu consulta y da el primer paso.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Psicólogos Ahora - Terapia Online',
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Psicólogos Ahora | Centro de Excelencia Psicoterapéutica',
        description: 'Encuentra tu apoyo emocional con especialistas online.',
    }
};

const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Psicólogos Ahora",
    "url": "https://psicologosahora.cl",
    "description": "Centro de Excelencia Psicoterapéutica Online. Ofrecemos psicoterapia cognitivo conductual, sistémica, humanista, para adultos, parejas y familias.",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Santiago",
        "addressCountry": "CL"
    },
    "medicalSpecialty": "Psychiatric"
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
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-KZLGLTCL');
                        `,
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
            </head>
            <body>
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-KZLGLTCL"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    ></iframe>
                </noscript>
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
                    <Navbar />
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
