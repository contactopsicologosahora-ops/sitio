"use client";
import { useState } from "react";
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { TERAPEUTAS } from "@/data/terapeutas";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // For now, we'll implement a logical bypass check for your specific admin credentials
        // and therapists, but we'll use Supabase Auth for the real check.
        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            // Simplified check for "BoltonPardo26" if we haven't created the user yet in DB
            // This allows Claudio to test immediately
            // admin and therapists bypass for initial setup
            if (email === "contactopsicologosahora@gmail.com" && password === "BoltonPardo26") {
                localStorage.setItem("user_role", "admin");
                localStorage.setItem("user_name", "Claudio Administrador");
                router.push("/dashboard/admin");
                return;
            }

            // Therapist Bypass (Using central data for initial access)
            const foundTherapist = TERAPEUTAS.find(t => t.email === email);
            if (foundTherapist) {
                // Password pattern: FirstName + 2026! (e.g., Esteban2026!)
                const firstName = foundTherapist.name.replace("Ps. ", "").split(" ")[0];
                const expectedPassword = `${firstName}2026!`;

                if (password === expectedPassword) {
                    localStorage.setItem("user_role", "terapeuta");
                    localStorage.setItem("user_name", foundTherapist.name);
                    localStorage.setItem("user_email", email);
                    // Buscar el ID real en Supabase por email
                    const { data: tData } = await supabase
                        .from('terapeutas')
                        .select('id')
                        .eq('email', email)
                        .single();
                    localStorage.setItem("therapist_id", (tData?.id || foundTherapist.id).toString());
                    router.push("/dashboard/terapeuta");
                    return;
                }
            }

            setError("Credenciales inválidas. Por favor verifica tu correo y contraseña.");
            setLoading(false);
            return;
        }

        if (data?.user) {
            // Buscar terapeuta por email en Supabase para obtener nombre e ID real
            const { data: tData } = await supabase
                .from('terapeutas')
                .select('id, name')
                .eq('email', data.user.email)
                .single();

            if (tData) {
                localStorage.setItem("user_role", "terapeuta");
                localStorage.setItem("user_name", tData.name);
                localStorage.setItem("user_email", data.user.email || "");
                localStorage.setItem("therapist_id", tData.id.toString());
            } else {
                localStorage.setItem("user_role", "terapeuta");
                localStorage.setItem("user_name", data.user.email || "Especialista");
                localStorage.setItem("user_email", data.user.email || "");
            }
            router.push("/dashboard/terapeuta");
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#faf9f6',
            padding: '2rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px',
                backgroundColor: '#fff',
                padding: '3rem',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'var(--accent-light)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: 'var(--primary)'
                }}>
                    <ShieldCheck size={32} />
                </div>

                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Bienvenido de nuevo</h1>
                <p style={{ color: 'var(--text-soft)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                    Ingresa a tu panel de control especializado.
                </p>

                <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>Correo Electrónico</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="ejemplo@psicologosahora.cl"
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    borderRadius: '12px',
                                    border: '1px solid #eee',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={(e) => e.target.style.borderColor = '#eee'}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Contraseña</label>
                            <Link href="#" style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '600' }}>¿Olvidaste tu contraseña?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '1rem 3.5rem 1rem 3rem',
                                    borderRadius: '12px',
                                    border: '1px solid #eee',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={(e) => e.target.style.borderColor = '#eee'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-soft)'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#fff5f5',
                            color: '#e53e3e',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            marginBottom: '1.5rem',
                            border: '1px solid #fed7d7'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="premium-btn"
                        style={{
                            width: '100%',
                            padding: '1.2rem',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            justifyContent: 'center',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? "Iniciando sesión..." : "Ingresar al Panel"} {!loading && <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />}
                    </button>
                </form>

                <p style={{ marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
                    ¿Eres un nuevo especialista? <Link href="/contacto" style={{ color: 'var(--primary)', fontWeight: '700' }}>Únete a la red</Link>
                </p>
            </div>
        </div>
    );
}
