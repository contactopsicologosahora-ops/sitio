import { Search, CalendarCheck, MessageSquareHeart } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            icon: <Search size={32} />,
            title: "Explora",
            desc: "Navega por nuestro equipo de especialistas verificados hasta encontrar el perfil que resuene contigo."
        },
        {
            icon: <CalendarCheck size={32} />,
            title: "Reserva",
            desc: "Elige un horario disponible o deja tus datos para que nuestro concierge coordine el encuentro por ti."
        },
        {
            icon: <MessageSquareHeart size={32} />,
            title: "Conecta",
            desc: "Asiste a tu primera sesión desde la comodidad de tu hogar en un espacio seguro y profesional."
        }
    ];

    return (
        <section style={{ padding: '8rem 8%', backgroundColor: 'var(--white)' }}>
            <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <span style={{ color: 'var(--accent)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>Transparencia Total</span>
                <h2 style={{ fontSize: '3rem', marginTop: '1rem' }}>Tu camino hacia el equilibrio</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0', position: 'relative' }}>
                {steps.map((s, idx) => (
                    <div key={idx} style={{ padding: '0 3rem', position: 'relative' }}>
                        {idx < steps.length - 1 && (
                            <div style={{
                                position: 'absolute',
                                top: '32px',
                                right: '-30px',
                                width: '60px',
                                height: '1px',
                                backgroundColor: 'var(--accent-light)',
                                display: 'block' // Will hide on mobile in a real project
                            }}></div>
                        )}
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '20px',
                            backgroundColor: 'var(--accent-light)',
                            color: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '2rem'
                        }}>
                            {s.icon}
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.2rem' }}>{idx + 1}. {s.title}</h3>
                        <p style={{ color: 'var(--text-soft)', fontSize: '1rem', lineHeight: '1.6' }}>{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
