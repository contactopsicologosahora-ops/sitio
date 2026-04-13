import Navbar from "@/components/Navbar";

export default function Terminos() {
    return (
        <div style={{ backgroundColor: '#fff', color: '#333' }}>
            <Navbar />
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 5%' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--primary)' }}>Términos y Condiciones</h1>
                <p style={{ color: 'var(--text-soft)', marginBottom: '2rem' }}>Última actualización: Abril 2026</p>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>1. Aceptación de los Términos</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Al acceder y utilizar la plataforma de Psicólogos Ahora, el usuario acepta de manera íntegra y sin reservas los presentes Términos y Condiciones de uso.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>2. Naturaleza del Servicio</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Psicólogos Ahora actúa como una plataforma de conexión entre profesionales de la psicología y pacientes. El servicio se presta bajo la modalidad de telepsicología, la cual requiere una conexión a internet estable y un entorno privado por parte del paciente.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: '#fff8f0', borderLeft: '4px solid #f39c12' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#d35400' }}>⚠️ Protocolo de Emergencias</h2>
                    <p style={{ lineHeight: '1.8', margin: 0 }}>
                        Nuestra plataforma <strong>NO está diseñada para atender emergencias clínicas agudas, riesgo suicida inminente o crisis violentas</strong>. Si te encuentras en una situación de peligro inmediato, por favor contacta a los servicios de urgencia (131 o 133 en Chile) o acude al centro de salud más cercano.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>3. Responsabilidad Profesional</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Cada terapeuta es responsable independiente de su ejercicio clínico y del cumplimiento de las normas éticas dictadas por el Colegio de Psicólogos de Chile. Psicólogos Ahora no se hace responsable por las opiniones o intervenciones técnicas individuales del profesional durante la sesión.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>4. Cancelaciones y Reembolsos</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Las cancelaciones deben realizarse con al menos 24 horas de antelación para optar a la reprogramación o reembolso, salvo situaciones de fuerza mayor debidamente acreditadas.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>5. Modificaciones</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Psicólogos Ahora se reserva el derecho de modificar estos términos en cualquier momento para adaptarlos a novedades legislativas o mejoras en el servicio.
                    </p>
                </section>

                <footer style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid #eee', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
                    Para dudas sobre estos términos, contáctanos en contacto@psicologosahora.cl
                </footer>
            </main>
        </div>
    );
}
