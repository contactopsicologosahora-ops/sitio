import Navbar from "@/components/Navbar";

export default function Privacidad() {
    return (
        <div style={{ backgroundColor: '#fff', color: '#333' }}>
            <Navbar />
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 5%' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--primary)' }}>Política de Privacidad</h1>
                <p style={{ color: 'var(--text-soft)', marginBottom: '2rem' }}>Última actualización: Abril 2026</p>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>1. Introducción</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        En Psicólogos Ahora, nos tomamos muy en serio la privacidad de nuestros usuarios y la confidencialidad de la información clínica. Esta política explica cómo recolectamos, protegemos y utilizamos tus datos personales en cumplimiento con la <strong>Ley 19.628 sobre Protección de la Vida Privada</strong> en Chile.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>2. Recolección de Datos</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Recopilamos información necesaria para la prestación del servicio psicoterapéutico, incluyendo de forma enunciativa pero no limitativa:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                        <li>Datos de identificación (Nombre, RUT, Email, Teléfono).</li>
                        <li>Información clínica básica para la asignación de especialistas.</li>
                        <li>Registros de agendamiento y asistencia a sesiones.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>3. Confidencialidad Clínica</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Toda información compartida dentro de la sesión de terapia está protegida por el <strong>secreto profesional</strong> y la ética clínica. Psicólogos Ahora no accede al contenido de las sesiones privadas entre paciente y terapeuta, las cuales se realizan en entornos encriptados.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>4. Uso de la Información</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Tus datos se utilizan exclusivamente para:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                        <li>Facilitar el contacto con el psicólogo seleccionado.</li>
                        <li>Gestionar pagos y confirmaciones de agendamiento.</li>
                        <li>Mejorar la experiencia técnica de nuestra plataforma.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>5. Derechos ARCO</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Tienes derecho a acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales. Para ejercer estos derechos, puedes escribirnos a <strong>contacto@psicologosahora.cl</strong>.
                    </p>
                </section>

                <footer style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid #eee', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
                    Al utilizar nuestro servicio, aceptas los términos descritos en esta política.
                </footer>
            </main>
        </div>
    );
}
