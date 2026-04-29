"use client";
import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, Clock, Phone, User as UserIcon, CalendarDays, ClipboardList, Mail, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

interface BookingFlowProps {
  therapist: any;
  onClose: () => void;
}

export default function BookingFlow({ therapist, onClose }: BookingFlowProps) {
  const router = useRouter();
  
  const [flowMode, setFlowMode] = useState<'leaveData' | 'directBooking' | null>(null);
  const [step, setStep] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  
  // Datos comunes
  const [formData, setFormData] = useState({
    urgency: "",
    timeRange: "",
    name: "",
    phone: "",
    email: "",
    // Específico para agenda directa
    selectedDay: "",
    selectedHour: ""
  });

  // Disponibilidad de calendario
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  
  const generateNextDays = (numDays = 14) => {
    const dates = [];
    const today = new Date();
    const daysStr = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    for (let i = 0; i < numDays; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dayName = daysStr[d.getDay()];
        const dateNum = d.getDate().toString().padStart(2, '0');
        const monthNum = (d.getMonth() + 1).toString().padStart(2, '0');
        dates.push({
            id: `${dayName} ${dateNum}/${monthNum}`,
            dayOfWeek: dayName,
            label: `${dayName} ${dateNum}`
        });
    }
    return dates;
  };

  const [realDates] = useState(() => generateNextDays(14));
  const [activeDayTab, setActiveDayTab] = useState<string>('');

  useEffect(() => {
    const lastBooking = localStorage.getItem("last_booking_time");
    if (lastBooking) {
      const timePast = Date.now() - parseInt(lastBooking);
      if (timePast < 3 * 60 * 60 * 1000) { // 3 hours
        setIsLocked(true);
      }
    }
    
    // Fetch availabilities
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`/api/availability?therapistId=${therapist?.id || 1}`);
        if (response.ok) {
          const data = await response.json();
          const avail = data.availability || data;
          const booked = data.bookedSlots || [];
          
          setAvailability(avail);
          setBookedSlots(booked);
          
          // Set primary tab to the first real date with availability
          const firstAvailDate = realDates.find(d => {
              const times = avail[d.dayOfWeek] || [];
              const availableTimes = times.filter((t: string) => !booked.includes(`${d.id} a las ${t}`));
              return availableTimes.length > 0;
          });
          if (firstAvailDate) setActiveDayTab(firstAvailDate.id);
          else setActiveDayTab(realDates[0].id);
        } else {
          // Fallback if API doesn't exist yet
          const fallbackData = { 'Lun': ['09:00', '11:00', '15:00'], 'Mie': ['10:00', '16:00'], 'Vie': ['09:00', '12:00'] };
          setAvailability(fallbackData);
          setActiveDayTab(realDates[0].id);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
        const fallbackData = { 'Lun': ['09:00', '11:00', '15:00'], 'Mie': ['10:00', '16:00'], 'Vie': ['09:00', '12:00'] };
        setAvailability(fallbackData);
        setActiveDayTab(realDates[0].id);
      }
    };
    
    fetchAvailability();
  }, [therapist?.id]);

  const totalSteps = flowMode === 'leaveData' ? 4 : (flowMode === 'directBooking' ? 2 : 1);

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setFlowMode(null);
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    localStorage.setItem("last_booking_time", Date.now().toString());
    console.log(`Saving ${flowMode} lead for therapist:`, therapist.name, formData);

    const themeStr = flowMode === 'directBooking'
      ? `Agendamiento Directo: ${formData.selectedDay} a las ${formData.selectedHour}`
      : `Datos Previos | Urgencia: ${formData.urgency} | Horario: ${formData.timeRange}`;

    const leadToInsert = {
      terapeuta_id: therapist.id,
      name: formData.name,
      phone: formData.phone,
      email: formData.email || null,
      status: 'Pendiente',
      theme: themeStr
    };

    // Guardar en CRM de Supabase (Backend) saltando la protección pública y enviar correos:
    try {
      const response = await fetch('/api/send-booking-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          flowMode,
          formData,
          therapist: {
            id: therapist.id,
            name: therapist.name,
            email: therapist.email
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API respondió con Error ${response.status}: ${JSON.stringify(errorData.error || errorData)}`);
      }

    } catch (err: any) {
      console.error("Fallo Quirúrgico (Exception invoking backend API):", err.message);
    }
    
    // Continuamos a la pantalla de éxito incluso si los correos fallan (para no bloquear al usuario),
    // pero el error queda registrado en consola para el desarrollador.
    if (flowMode === 'directBooking') {
      router.push(`/gracias-agendamiento?therapistId=${therapist.id}`);
    } else {
      router.push(`/gracias-datos?therapistId=${therapist.id}`);
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

  // --- RENDERS POR FLUJO --- //

  const renderInitialScreen = () => (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', color: 'var(--primary)' }}>¿Cómo prefieres agendar?</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <button 
          onClick={() => { setFlowMode('leaveData'); setStep(1); }}
          className="secondary-btn"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '1.5rem', 
            padding: '1.5rem', textAlign: 'left', borderRadius: '12px',
            background: '#fafafa', border: '1px solid #eaeaea', transition: 'all 0.3s ease'
          }}
        >
          <div style={{ background: 'rgba(243, 156, 18, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <ClipboardList size={32} color="var(--accent)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem', color: 'var(--primary)' }}>Deseo dejar mis datos</h3>
            <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', margin: 0 }}>Y que me contacten antes de agendar</p>
          </div>
          <ArrowRight size={20} color="var(--accent)" style={{ marginLeft: 'auto' }} />
        </button>

        <button 
          onClick={() => { setFlowMode('directBooking'); setStep(1); }}
          className="secondary-btn"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '1.5rem', 
            padding: '1.5rem', textAlign: 'left', borderRadius: '12px',
            background: '#fafafa', border: '1px solid #eaeaea', transition: 'all 0.3s ease'
          }}
        >
          <div style={{ background: 'rgba(243, 156, 18, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <CalendarDays size={32} color="var(--accent)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem', color: 'var(--primary)' }}>Quiero agendar directamente</h3>
            <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', margin: 0 }}>En el calendario del terapeuta</p>
          </div>
          <ArrowRight size={20} color="var(--accent)" style={{ marginLeft: 'auto' }} />
        </button>
      </div>
    </div>
  );

  const renderLeaveDataFlow = () => {
    return (
      <div className="animate-fade" key={`leaveData-${step}`}>
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>1. ¿Para cuándo necesitas la atención?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {["Lo antes posible (Urgente)", "Esta semana", "Próxima semana"].map(opt => (
                <button 
                  key={opt}
                  onClick={() => { setFormData({...formData, urgency: opt}); handleNext(); }}
                  className="secondary-btn"
                  style={{ textAlign: 'left', padding: '1.2rem 2rem', border: formData.urgency === opt ? '2px solid var(--accent)' : '1px solid #ddd' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>2. ¿Qué horario te acomodaría más?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: "Mañana", desc: "09:00 - 13:00 hrs" },
                { title: "Tarde", desc: "14:00 - 18:00 hrs" },
                { title: "Vespertino", desc: "18:00 - 21:00 hrs" }
              ].map(opt => (
                <button 
                  key={opt.title}
                  onClick={() => { setFormData({...formData, timeRange: opt.title}); handleNext(); }}
                  className="secondary-btn"
                  style={{ textAlign: 'left', padding: '1.2rem 2rem', border: formData.timeRange === opt.title ? '2px solid var(--accent)' : '1px solid #ddd' }}
                >
                  <span style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.2rem' }}>{opt.title}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>3. Ingresa tu nombre</h2>
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid var(--accent)', padding: '0.5rem 0' }}>
              <UserIcon style={{ color: 'var(--accent)', marginRight: '1rem' }} />
              <input 
                type="text" 
                autoFocus
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && formData.name && handleNext()}
                placeholder="Escribe tu respuesta aquí..."
                style={{ border: 'none', background: 'none', fontSize: '1.4rem', outline: 'none', width: '100%', fontFamily: 'var(--font-serif)' }}
              />
            </div>
            <p style={{ marginTop: '1.5rem', color: 'var(--text-soft)', fontSize: '0.9rem' }}>Presiona ENTER para continuar</p>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>4. Ingresa tu número de teléfono</h2>
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid var(--accent)', padding: '0.5rem 0' }}>
              <Phone style={{ color: 'var(--accent)', marginRight: '1rem' }} />
              <input 
                type="tel" 
                autoFocus
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && formData.phone && handleNext()}
                placeholder="+56 9 ..."
                style={{ border: 'none', background: 'none', fontSize: '1.4rem', outline: 'none', width: '100%', fontFamily: 'var(--font-serif)' }}
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
    );
  };

  const renderDirectBookingFlow = () => {
    return (
      <div className="animate-fade" key={`directBooking-${step}`}>
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <CalendarIcon size={24} color="var(--accent)" />
              <h2 style={{ fontSize: '1.6rem', color: 'var(--primary)', margin: 0 }}>Selecciona un Horario</h2>
            </div>
            <p style={{ color: 'var(--text-soft)', marginBottom: '1.5rem' }}>Elige el momento que más te acomoda de la agenda de {therapist.name}.</p>
            
            {/* Day Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', borderBottom: '1px solid #eaeaea', marginBottom: '1.5rem' }}>
              {realDates.map(dateObj => {
                const times = availability[dateObj.dayOfWeek] || [];
                const availableTimes = times.filter(t => !bookedSlots.includes(`${dateObj.id} a las ${t}`));
                const hasSlots = availableTimes.length > 0;
                const isActive = activeDayTab === dateObj.id;
                
                return (
                  <button
                    key={dateObj.id}
                    onClick={() => hasSlots && setActiveDayTab(dateObj.id)}
                    style={{
                      padding: '0.7rem 1.2rem',
                      borderRadius: '50px',
                      fontWeight: isActive ? '700' : '500',
                      background: isActive ? 'var(--primary)' : (hasSlots ? '#f4f4f4' : '#fff'),
                      color: isActive ? '#fff' : (hasSlots ? 'var(--text-main)' : '#ccc'),
                      border: `1px solid ${isActive ? 'var(--primary)' : '#eaeaea'}`,
                      cursor: hasSlots ? 'pointer' : 'not-allowed',
                      minWidth: '100px',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {dateObj.label}
                  </button>
                );
              })}
            </div>

            {/* Time Slots for Selected Day */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.8rem', maxHeight: '200px', overflowY: 'auto' }}>
              {(() => {
                const activeDateObj = realDates.find(d => d.id === activeDayTab);
                if (!activeDateObj) return null;
                const times = availability[activeDateObj.dayOfWeek] || [];
                const availableTimes = times.filter(t => !bookedSlots.includes(`${activeDateObj.id} a las ${t}`));
                
                if (availableTimes.length > 0) {
                  return availableTimes.map(time => {
                     const isSelected = formData.selectedDay === activeDayTab && formData.selectedHour === time;
                     return (
                       <button
                         key={time}
                         onClick={() => {
                           setFormData({ ...formData, selectedDay: activeDayTab, selectedHour: time });
                           setTimeout(() => handleNext(), 400); // Auto-advance
                         }}
                         style={{
                           padding: '1rem',
                           borderRadius: '8px',
                           background: isSelected ? 'rgba(243, 156, 18, 0.1)' : '#fff',
                           border: `2px solid ${isSelected ? 'var(--accent)' : '#eaeaea'}`,
                           color: isSelected ? 'var(--accent)' : 'var(--primary)',
                           fontWeight: '600',
                           fontSize: '1.1rem',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           gap: '0.5rem',
                           cursor: 'pointer',
                           transition: 'all 0.2s'
                         }}
                       >
                         {isSelected && <CheckCircle2 size={16} />}
                         {time}
                       </button>
                     );
                  });
                } else {
                  return <p style={{ color: 'var(--text-soft)', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>No hay horarios disponibles para este día.</p>;
                }
              })()}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Tus Datos</h2>
            <p style={{ color: 'var(--text-soft)', marginBottom: '2rem' }}>
              Has seleccionado el {formData.selectedDay} a las {formData.selectedHour} hrs. Déjanos tus datos para agendar.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #eaeaea', padding: '0.5rem 0' }}>
                <UserIcon style={{ color: 'var(--text-soft)', marginRight: '1rem' }} />
                <input 
                  type="text" 
                  placeholder="Nombre y Apellido"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ border: 'none', background: 'none', fontSize: '1.1rem', outline: 'none', width: '100%', fontFamily: 'var(--font-sans)', color: 'var(--primary)' }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #eaeaea', padding: '0.5rem 0' }}>
                <Phone style={{ color: 'var(--text-soft)', marginRight: '1rem' }} />
                <input 
                  type="tel" 
                  placeholder="Teléfono (ej. +56 9 1234 5678)"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{ border: 'none', background: 'none', fontSize: '1.1rem', outline: 'none', width: '100%', fontFamily: 'var(--font-sans)', color: 'var(--primary)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #eaeaea', padding: '0.5rem 0' }}>
                <Mail style={{ color: 'var(--text-soft)', marginRight: '1rem' }} />
                <input 
                  type="email" 
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ border: 'none', background: 'none', fontSize: '1.1rem', outline: 'none', width: '100%', fontFamily: 'var(--font-sans)', color: 'var(--primary)' }}
                />
              </div>
            </div>

            <button 
              onClick={handleNext} 
              disabled={!formData.name || !formData.phone || !formData.email}
              className="premium-btn" 
              style={{ marginTop: '3rem', width: '100%', justifyContent: 'center' }}
            >
              Confirmar Reserva <CheckCircle2 size={20} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-morphism animate-fade" style={{ 
      maxWidth: '600px', 
      width: '95%', 
      padding: '2.5rem', 
      borderRadius: 'var(--radius-lg)', 
      position: 'relative',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <button onClick={onClose} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-soft)', zIndex: 10 }}>
        <X size={24} />
      </button>

      {/* Progress Bar (Sólo visible cuando hay un flow activo) */}
      {flowMode && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', backgroundColor: '#eee', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
          <div style={{ 
            width: `${(step / totalSteps) * 100}%`, 
            height: '100%', 
            backgroundColor: 'var(--accent)', 
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
          }}></div>
        </div>
      )}

      {flowMode && (
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            PASO {step} DE {totalSteps} {flowMode === 'directBooking' && "- AGENDAMIENTO DIRECTO"}
          </span>
        </div>
      )}

      {/* Content Rendering */}
      {!flowMode && renderInitialScreen()}
      {flowMode === 'leaveData' && renderLeaveDataFlow()}
      {flowMode === 'directBooking' && renderDirectBookingFlow()}

      {/* Botón volver genérico */}
      {flowMode && (
        <button onClick={handlePrev} style={{ marginTop: '2rem', border: 'none', background: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
          <ArrowLeft size={16} /> Volver
        </button>
      )}
    </div>
  );
}
