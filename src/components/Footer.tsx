import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '5rem 8% 3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>Psicólogos <span style={{ fontStyle: 'italic' }}>Ahora</span></h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '2rem' }}>
                        Excelencia en salud mental. Un espacio de paz y acompañamiento profesional para tu bienestar emocional.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href="#" style={{ color: 'white', opacity: 0.8 }}><Instagram size={20} /></a>
                        <a href="#" style={{ color: 'white', opacity: 0.8 }}><Facebook size={20} /></a>
                        <a href="#" style={{ color: 'white', opacity: 0.8 }}><Linkedin size={20} /></a>
                    </div>
                </div>

                <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'white' }}>Enlaces</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <li><Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Inicio</Link></li>
                        <li><Link href="/terapeutas" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Nuestros Expertos</Link></li>
                        <li><Link href="/blog" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Blog de Salud Mental</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'white' }}>Contacto</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)' }}>
                            <Mail size={16} /> contacto@psicologosahora.cl
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)' }}>
                            <Phone size={16} /> +56 9 1234 5678
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)' }}>
                            <MapPin size={16} /> Santiago, Chile
                        </li>
                    </ul>
                </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                <p>&copy; {new Date().getFullYear()} Psicólogos Ahora. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}
