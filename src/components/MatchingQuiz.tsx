"use client";
import { useState } from "react";
import { ArrowRight, Sparkles, MessageSquare, Heart, RefreshCcw } from "lucide-react";

export default function MatchingQuiz() {
    const [step, setStep] = useState(0); // 0: Start, 1-3: Questions, 4: Result
    const [answers, setAnswers] = useState<string[]>([]);

    const questions = [
        {
            text: "¿Cómo describirías tu estado emocional principal hoy?",
            options: [
                { label: "Siento ansiedad o agobio constante", tag: "Ansiedad" },
                { label: "Atravieso un proceso de pérdida o duelo", tag: "Duelo" },
                { label: "Busco autoconocimiento y crecimiento", tag: "Crecimiento" },
                { label: "Tengo dificultades en mis relaciones", tag: "Relaciones" }
            ]
        },
        {
            text: "¿Qué modalidad de trabajo prefieres?",
            options: [
                { label: "Estructurada y con objetivos claros", tag: "TCC" },
                { label: "Exploración libre y profunda", tag: "Psicoanálisis" },
                { label: "Enfoque en el aquí y ahora", tag: "Gestalt" }
            ]
        }
    ];

    const handleAnswer = (tag: string) => {
        const newAnswers = [...answers, tag];
        setAnswers(newAnswers);
        if (step < questions.length) {
            setStep(step + 1);
        }
    };

    const reset = () => {
        setStep(0);
        setAnswers([]);
    };

    return (
        <div className="glass-morphism" style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '4rem',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)'
        }}>
            {step === 0 && (
                <div className="animate-fade">
                    <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--accent-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Sparkles style={{ color: 'var(--accent)' }} size={24} />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Concierge de Bienestar</h2>
                    <p style={{ color: 'var(--text-soft)', marginBottom: '2.5rem' }}>Responde 2 preguntas y encontraremos al especialista ideal según tu momento vital.</p>
                    <button onClick={() => setStep(1)} className="premium-btn">Comenzar Perfilado</button>
                </div>
            )}

            {step > 0 && step <= questions.length && (
                <div className="animate-fade" key={step}>
                    <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '1rem' }}>Pregunta {step} de {questions.length}</p>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '2.5rem' }}>{questions[step - 1].text}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {questions[step - 1].options.map((opt) => (
                            <button
                                key={opt.label}
                                onClick={() => handleAnswer(opt.tag)}
                                className="secondary-btn"
                                style={{ textAlign: 'left', padding: '1.5rem', borderRadius: 'var(--radius-md)', height: '100%', fontSize: '0.95rem' }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step > questions.length && (
                <div className="animate-fade">
                    <div style={{ width: '60px', height: '60px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Heart style={{ color: '#2ecc71' }} size={30} />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Perfil Completado</h2>
                    <div style={{ backgroundColor: 'var(--bg-serene)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem', border: '1px solid #eee', textAlign: 'left' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sparkles size={18} color="var(--accent)" /> ¿Por qué estas recomendaciones?
                        </h3>
                        <p style={{ color: 'var(--text-soft)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            Mencionaste que estás experimentando <strong>{answers[0]?.toLowerCase() || "dificultades"}</strong> y prefieres una dinámica <strong>{answers[1]?.toLowerCase() || "clínica"}</strong>. Nuestro sistema ha seleccionado a los terapeutas con años de formación y éxito comprobado manejando tu situación específica.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <a href="/terapeutas" className="premium-btn">Ver mis Recomendaciones <ArrowRight size={18} /></a>
                        <button onClick={reset} style={{ background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <RefreshCcw size={16} /> Reiniciar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
