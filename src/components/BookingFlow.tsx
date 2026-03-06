"use client";
import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, CheckCircle2, Clock, Phone, User as UserIcon, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingFlowProps {
  therapist: any;
  onClose: () => void;
}

import { supabase } from "@/lib/supabase";

export default function BookingFlow({ therapist, onClose }: BookingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    urgency: "",
    timeRange: "",
    name: "",
    phone: ""
  });
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const lastBooking = localStorage.getItem("last_booking_time");
    if (lastBooking) {
      const timePast = Date.now() - parseInt(lastBooking);
      if (timePast < 3 * 60 * 60 * 1000) { // 3 hours
        setIsLocked(true);
      }
    }
  }, []);

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // Record booking time for lockout
    localStorage.setItem("last_booking_time", Date.now().toString());

    // Save to Supabase (if keys exist)
    const { data, error } = await supabase
      .from('pacientes')
      .insert([
        {
          name: formData.name,
          phone: formData.phone,
          urgent: formData.urgency,
          time_range: formData.timeRange,
          therapist_id: therapist.id,
          status: 'Pendiente'
        }
      ]);

    if (error) {
      console.error("Supabase Save Error (Falling back to LocalStorage):", error.message);
      // Mock fallback for testing if Supabase is not ready
      const existingLeads = JSON.parse(localStorage.getItem("leads_backup") || "[]");
      localStorage.setItem("leads_backup", JSON.stringify([...existingLeads, { ...formData, therapist_id: therapist.id, date: new Date().toISOString(), status: 'Pendiente' }]));
    }

    // Emulate email trigger
    console.log("Emulating email to:", therapist.name, "copy to: contactopsicologosahora@gmail.com");

    // Redirect to thank you page
    router.push(`/gracias?therapistId=${therapist.id}`);
  };

  if (isLocked) {
    return (
      <div className="glass-morphism" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', maxWidth: '500px' }}>
        <Clock size={48} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ marginBottom: '1rem' }}>Solicitud en curso</h2>
        <p style={{ color: 'var(--text-soft)' }}>Ya has enviado una solicitud recientemente. Para proteger la calidad del servicio, permitimos una reserva cada 3 horas. Por favor, espera un momento.</p>
        <button onClick={onClose} className="premium-btn" style={{ marginTop: '2rem' }}>Entendido</button>
      </div>
    );
  }

  return (
    <div className="glass-morphism animate-fade" style={{
      maxWidth: '600px',
      width: '95%',
      padding: '4rem',
      borderRadius: 'var(--radius-lg)',
      position: 'relative',
      minHeight: '500px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <button onClick={onClose} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-soft)' }}>
        <X size={24} />
      </button>

      {/* Progress Bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', backgroundColor: '#eee', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
        <div style={{
          width: `${(step / totalSteps) * 100}%`,
          height: '100%',
          backgroundColor: 'var(--accent)',
          transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}></div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.1em' }}>PASO {step} DE {totalSteps}</span>
      </div>

      <div className="animate-fade" key={step}>
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '2rem' }}>1. ¿Para cuándo necesitas la sesión?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {["Lo antes posible (Urgente)", "Esta semana", "Próxima semana"].map(opt => (
                <button
                  key={opt}
                  onClick={() => { setFormData({ ...formData, urgency: opt }); handleNext(); }}
                  className="secondary-btn"
                  style={{ textAlign: 'left', padding: '1.2rem 1.5rem', border: formData.urgency === opt ? '2px solid var(--accent)' : '1px solid #ddd' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '2rem' }}>2. ¿Qué horario te acomodaría más?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {["Mañana (09:00 - 13:00)", "Tarde (14:00 - 18:00)", "Vespertino (19:00 - 21:00)"].map(opt => (
                <button
                  key={opt}
                  onClick={() => { setFormData({ ...formData, timeRange: opt }); handleNext(); }}
                  className="secondary-btn"
                  style={{ textAlign: 'left', padding: '1.2rem 1.5rem', border: formData.timeRange === opt ? '2px solid var(--accent)' : '1px solid #ddd' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '2rem' }}>3. ¿Cuál es tu nombre completo?</h2>
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid var(--accent)', padding: '0.5rem 0' }}>
              <UserIcon style={{ color: 'var(--accent)', marginRight: '1rem' }} />
              <input
                type="text"
                autoFocus
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && formData.name && handleNext()}
                placeholder="Escribe tu respuesta aquí..."
                style={{ border: 'none', background: 'none', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', outline: 'none', width: '100%', fontFamily: 'var(--font-serif)' }}
              />
            </div>
            <p style={{ marginTop: '1.5rem', color: 'var(--text-soft)', fontSize: '0.9rem' }}>Presiona ENTER para continuar</p>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '2rem' }}>4. Déjanos tu número de contacto</h2>
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid var(--accent)', padding: '0.5rem 0' }}>
              <Phone style={{ color: 'var(--accent)', marginRight: '1rem' }} />
              <input
                type="tel"
                autoFocus
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && formData.phone && handleNext()}
                placeholder="+56 9 ..."
                style={{ border: 'none', background: 'none', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', outline: 'none', width: '100%', fontFamily: 'var(--font-serif)' }}
              />
            </div>
            <button
              onClick={handleNext}
              disabled={!formData.phone}
              className="premium-btn"
              style={{ marginTop: '3rem', width: '100%', justifyContent: 'center' }}
            >
              Finalizar solicitud <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>

      {step > 1 && (
        <button onClick={handlePrev} style={{ marginTop: '2rem', border: 'none', background: 'none', color: 'var(--text-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
          <ArrowLeft size={16} /> Volver
        </button>
      )}
    </div>
  );
}
