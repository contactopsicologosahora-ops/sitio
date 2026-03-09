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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availability, setAvailability] = useState<any>({});
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [selectedDayLabel, setSelectedDayLabel] = useState("");

  useEffect(() => {
    const lastBooking = localStorage.getItem("last_booking_time");
    if (lastBooking) {
      const timePast = Date.now() - parseInt(lastBooking);
      if (timePast < 3 * 60 * 60 * 1000) { // 3 hours
        setIsLocked(true);
      }
    }
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    setLoadingAvail(true);
    const { data, error } = await supabase
      .from('disponibilidad')
      .select('*')
      .eq('therapist_id', therapist.id);

    if (!error && data) {
      const availMap: any = {};
      data.forEach((item: any) => {
        if (!availMap[item.day]) availMap[item.day] = [];
        availMap[item.day].push(item.hour);
      });
      setAvailability(availMap);

      // Auto-select first available day if any
      const days = Object.keys(availMap);
      if (days.length > 0) setSelectedDayLabel(days[0]);
    }
    setLoadingAvail(false);
  };

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Record booking time for lockout
      localStorage.setItem("last_booking_time", Date.now().toString());

      // Save to Supabase
      const { error } = await supabase
        .from('pacientes')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            urgent: formData.urgency,
            time_range: formData.timeRange,
            therapist_id: therapist.id, // Unified column name
            status: 'Pendiente'
          }
        ]);

      if (error) {
        console.error("Supabase Save Error (Falling back to LocalStorage):", error.message);
        // Backup to localStorage if DB fails
        const existingLeads = JSON.parse(localStorage.getItem("leads_backup") || "[]");
        localStorage.setItem("leads_backup", JSON.stringify([...existingLeads, { ...formData, therapist_id: therapist.id, date: new Date().toISOString(), status: 'Pendiente' }]));
      }

      // Trigger Email Notification (Non-blocking)
      const fireEmail = async () => {
        try {
          await fetch('/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              patientData: formData,
              therapistEmail: therapist.email || 'contactopsicologosahora@gmail.com',
              therapistName: therapist.name || 'Especialista'
            }),
          });
        } catch (e) {
          console.error("Fallo de red al intentar enviar correo:", e);
        }
      };

      fireEmail();

      // Redirect to thank you page
      router.push(`/gracias?therapistId=${therapist.id}`);
    } catch (err) {
      console.error("Critical error during submission:", err);
      // Even if everything fails, try to redirect or show message to avoid "Application Error"
      router.push(`/gracias?therapistId=${therapist.id}`);
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="animate-fade" style={{
      backgroundColor: 'var(--white)',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid rgba(0,0,0,0.05)',
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
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '2rem' }}>1. ¿Cómo deseas agendar con {(therapist.name || "").split(" ")[1] || "tu especialista"}?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={() => { setFormData({ ...formData, urgency: "Calendario Directo" }); handleNext(); }}
                className="premium-btn"
                style={{ textAlign: 'left', padding: '1.2rem 1.5rem', justifyContent: 'center' }}
              >
                <Calendar size={20} /> Agendar directamente en el calendario
              </button>
              <div style={{ textAlign: 'center', color: 'var(--text-soft)', margin: '0.5rem 0', fontSize: '0.9rem' }}>o</div>
              <button
                onClick={() => { setFormData({ ...formData, urgency: "Contacto Asistido" }); handleNext(); }}
                className="secondary-btn"
                style={{ textAlign: 'center', padding: '1.2rem 1.5rem', justifyContent: 'center' }}
              >
                Dejar mis datos y solicitar contacto
              </button>
            </div>
          </div>
        )}

        {step === 2 && formData.urgency === "Calendario Directo" && (
          <div className="animate-fade">
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '1rem' }}>Selecciona tu hora</h2>
            <p style={{ color: 'var(--text-soft)', marginBottom: '2rem' }}>Selecciona la disponibilidad real de {therapist.name}.</p>

            {loadingAvail ? (
              <p>Cargando disponibilidad...</p>
            ) : Object.keys(availability).length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#fff3cd', borderRadius: '12px' }}>
                <p style={{ margin: 0 }}>El terapeuta aún no ha configurado sus horarios. Por favor usa la opción de <strong>"Solicitar contacto"</strong>.</p>
                <button onClick={handlePrev} className="secondary-btn" style={{ marginTop: '1rem' }}>Volver</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  {Object.keys(availability).map(day => (
                    <button
                      key={day}
                      onClick={() => setSelectedDayLabel(day)}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: selectedDayLabel === day ? '2px solid var(--accent)' : '1px solid #ddd',
                        minWidth: '80px',
                        backgroundColor: selectedDayLabel === day ? 'var(--accent-light)' : 'var(--white)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>Día</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{day}</div>
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  {availability[selectedDayLabel]?.map((hora: string) => (
                    <button
                      key={hora}
                      onClick={() => { setFormData({ ...formData, timeRange: `${selectedDayLabel} a las ${hora}` }); handleNext(); }}
                      className="secondary-btn"
                      style={{ padding: '1rem' }}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && formData.urgency === "Contacto Asistido" && (
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
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '2rem' }}>3. Ingresa tu nombre</h2>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', margin: 0 }}>Presiona ENTER para continuar</p>
              <button
                onClick={handleNext}
                disabled={!formData.name}
                className="premium-btn"
                style={{ padding: '0.8rem 2rem', opacity: formData.name ? 1 : 0.5 }}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '2rem' }}>4. Déjanos tu número de contacto</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid var(--accent)', padding: '0.5rem 0', width: '80px' }}>
                <span style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', color: 'var(--text-main)', fontFamily: 'var(--font-serif)', marginRight: '4px' }}>+</span>
                <input
                  type="text"
                  defaultValue="56"
                  style={{ border: 'none', background: 'none', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', outline: 'none', width: '100%', fontFamily: 'var(--font-serif)' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid var(--accent)', padding: '0.5rem 0', flex: 1 }}>
                <Phone style={{ color: 'var(--accent)', marginRight: '1rem' }} />
                <input
                  type="tel"
                  autoFocus
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && formData.phone && handleNext()}
                  placeholder="9 1234 5678"
                  style={{ border: 'none', background: 'none', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', outline: 'none', width: '100%', fontFamily: 'var(--font-serif)' }}
                />
              </div>
            </div>
            <button
              onClick={handleNext}
              disabled={!formData.phone || isSubmitting}
              className="premium-btn"
              style={{ marginTop: '3rem', width: '100%', justifyContent: 'center', opacity: (formData.phone && !isSubmitting) ? 1 : 0.5 }}
            >
              {isSubmitting ? "Enviando solicitud..." : "Enviar solicitud"} {!isSubmitting && <ArrowRight size={20} />}
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
