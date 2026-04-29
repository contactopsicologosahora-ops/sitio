import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import ConditionalHeader from "@/components/ConditionalHeader";
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const lora = Lora({ subsets: ['latin'], variable: '--font-serif', style: ['normal', 'italic'] });

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
        <html lang="es" className={`${inter.variable} ${lora.variable}`}>
            <head>
                <Script
                    id="organization-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
            </head>
            <body>
                <Script
                    id="google-tag-manager"
                    strategy="afterInteractive"
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
                
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-KZLGLTCL"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    ></iframe>
                </noscript>
                
                <ConditionalHeader />
                
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
                                <li><a href="/terminos-y-condiciones" style={{ color: 'var(--text-soft)' }}>Ética y Términos</a></li>
                                <li><a href="/privacidad" style={{ color: 'var(--text-soft)' }}>Privacidad</a></li>
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
