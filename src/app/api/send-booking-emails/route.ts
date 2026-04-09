import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    // Inicialización Quirúrgica (Retrasada para evitar caídas de módulo completo en Next.js)
    if (!process.env.RESEND_API_KEY) {
      console.warn("ADVERTENCIA: RESEND_API_KEY no detectado. Los correos no se enviarán.");
    }
    const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("ERROR CRÍTICO: Variables de entorno de Supabase ausentes.");
      return NextResponse.json({ error: 'Configuración de Supabase inválida.' }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { flowMode, formData, therapist } = await request.json();

    if (!formData || !therapist) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // 0. Registrar en Base de Datos Principal (CRM Global y Terapeuta)
    if (therapist.id) {
      const themeStr = flowMode === 'directBooking'
        ? `Agendamiento Directo: ${formData.selectedDay} a las ${formData.selectedHour}`
        : `Datos Previos | Urgencia: ${formData.urgency} | Horario: ${formData.timeRange}`;

      // Inserción directa a la columna estándar confirmada
      const { data: leadData, error: dbError } = await supabase.from('leads').insert([{
        therapist_id: therapist.id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        status: 'Pendiente',
        theme: themeStr
      }]).select();

      if (dbError) {
        console.error("❌ ERROR CRÍTICO SUPERBASE INSERTANDO LEAD:", dbError.message || dbError);
      } else {
        console.log("✅ LEAD GUARDADO EXITOSAMENTE EN SUPABASE:", leadData);
      }
    }

    const centralEmail = 'contactopsicologosahora@gmail.com';
    const toEmails = [centralEmail];

    // Si el terapeuta tiene correo registrado, lo incluimos en las notificaciones
    if (therapist.email) {
      toEmails.push(therapist.email);
    }

    // 1. Enviar correo a la Central y al Terapeuta
    const subjectPrefix = flowMode === 'directBooking' ? 'Agendamiento Directo' : 'Datos Previos';
    const therapistSubject = `[Nuevo Lead] ${subjectPrefix} - ${therapist.name}`;

    let therapistHtml = `
      <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f9f9f9; color: #333; max-width: 600px; margin: 0 auto; border-radius: 8px; border: 1px solid #eaeaea;">
        <h2 style="color: #2d3e40; margin-top: 0;">Nuevo paciente interesado: ${formData.name}</h2>
        <p style="font-size: 15px; line-height: 1.5;">Hola <strong>${therapist.name}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.5;">El siguiente usuario ha completado el formulario de <strong>${subjectPrefix}</strong> y está a la espera de ser contactado.</p>
        
        <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-top: 25px; border-left: 4px solid #b7a99a; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
          <h3 style="margin-top: 0; color: #2d3e40; font-size: 16px;">Datos del Paciente:</h3>
          <p style="margin: 8px 0;"><strong>Nombre:</strong> ${formData.name}</p>
          <p style="margin: 8px 0;"><strong>Teléfono:</strong> ${formData.phone}</p>
          ${formData.email ? `<p style="margin: 8px 0;"><strong>Email:</strong> ${formData.email}</p>` : ''}
          
          <h3 style="margin-top: 20px; margin-bottom: 15px; color: #2d3e40; font-size: 16px;">Detalles de Solicitud:</h3>
          ${flowMode === 'directBooking' ? `
            <p style="margin: 8px 0;"><strong>Día seleccionado:</strong> <span style="background: #eef2f3; padding: 2px 6px; border-radius: 4px;">${formData.selectedDay}</span></p>
            <p style="margin: 8px 0;"><strong>Hora seleccionada:</strong> <span style="background: #eef2f3; padding: 2px 6px; border-radius: 4px;">${formData.selectedHour}</span></p>
          ` : `
            <p style="margin: 8px 0;"><strong>Urgencia:</strong> <span style="color: #b7a99a; font-weight: bold;">${formData.urgency}</span></p>
            <p style="margin: 8px 0;"><strong>Disponibilidad preferida:</strong> ${formData.timeRange}</p>
          `}
        </div>

        <div style="margin-top: 35px; padding: 20px; background-color: #2d3e40; color: #ffffff; border-radius: 8px; text-align: center;">
          <h4 style="margin-top: 0; font-size: 16px; color: #f9cba3;">🔴 Acción Requerida en tu Panel</h4>
          <p style="font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            El paciente ya ha sido añadido a tu CRM como <strong>Pendiente</strong>. Por favor, contáctalo a la brevedad y actualiza su estado.
          </p>
          <a href="https://psicologosahora.cl/dashboard/terapeuta" style="background-color: #ffffff; color: #2d3e40; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
            Ir a mi Escritorio Privado
          </a>
          <p style="font-size: 13px; margin-top: 15px; color: rgba(255,255,255,0.7);">
            Debes indicar si el paciente pasa a "Activo" o "Perdido" para mantener tus métricas al día.
          </p>
        </div>
      </div>
    `;

    const { error: errorInternal } = await resend.emails.send({
      from: 'Psicólogos Ahora <hola@psicologosahora.cl>',
      to: toEmails,
      subject: therapistSubject,
      html: therapistHtml,
    });

    if (errorInternal) {
      console.error('Error enviando correo interno:', errorInternal);
      return NextResponse.json({ error: errorInternal }, { status: 400 });
    }

    // 2. Si es Agendamiento Directo, enviar un correo al Paciente
    if (flowMode === 'directBooking' && formData.email) {
      const patientSubject = `Reservaste una cita con ${therapist.name} - Psicólogos Ahora`;
      const patientHtml = `
        <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #fcfaf7; color: #2c3333; max-width: 600px; margin: 0 auto; border-radius: 12px;">
          <h2 style="color: #2d3e40; font-size: 24px; margin-bottom: 20px; text-align: center;">¡Hola, ${formData.name}!</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hemos recibido tu solicitud de agendamiento con <strong>${therapist.name}</strong>.
          </p>
          
          <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin: 30px 0; border: 1px solid #e1dcd5; text-align: center;">
            <p style="margin: 0; font-size: 15px; color: #636e72; margin-bottom: 10px;">Detalles de tu solicitud:</p>
            <p style="margin: 5px 0; font-size: 18px;"><strong>Día:</strong> ${formData.selectedDay}</p>
            <p style="margin: 5px 0; font-size: 18px;"><strong>Hora:</strong> ${formData.selectedHour}</p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
            <strong>¡Atención!</strong> Tu cita aún no está confirmada. El terapeuta se contactará contigo pronto a tu teléfono (${formData.phone}) o correo para confirmar la sesión y coordinar los detalles.
          </p>
          
          <p style="font-size: 14px; line-height: 1.5; color: #636e72; margin-top: 30px; text-align: center;">
            Si tienes urgencia o no recibes contacto dentro de 24 horas, puedes escribirnos.<br><br>
            El equipo de <strong>Psicólogos Ahora</strong>.
          </p>
        </div>
      `;

      const { error: errorPatient } = await resend.emails.send({
        from: 'Psicólogos Ahora <hola@psicologosahora.cl>',
        to: formData.email,
        subject: patientSubject,
        html: patientHtml,
      });

      if (errorPatient) {
        console.error('Error enviando correo al paciente:', errorPatient);
        // We log but still return success since the internal email was sent.
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Excepción enviando correos de reserva:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
