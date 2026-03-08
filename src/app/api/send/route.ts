import { Resend } from 'resend';

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("ERROR CRÍTICO: La variable RESEND_API_KEY no está definida en Vercel.");
    return Response.json({ error: "Configuración incompleta en el servidor" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  try {
    const payload = await req.json();
    const { patientData, therapistEmail, therapistName } = payload;

    console.log("Intentando enviar correo con Resend:", {
      to: therapistEmail,
      patient: patientData.name,
      sender: 'notificaciones@psicologosahora.cl'
    });

    const adminEmail = 'contactopsicologosahora@gmail.com';
    const recipients = [therapistEmail];
    const ccRecipients = [adminEmail].filter(email => !recipients.includes(email));

    const { data, error } = await resend.emails.send({
      from: 'Psicólogos Ahora <notificaciones@psicologosahora.cl>',
      to: recipients,
      cc: ccRecipients.length > 0 ? ccRecipients : undefined,
      subject: `Nueva Solicitud: ${patientData.name} - Psicólogos Ahora`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0efeb; border-radius: 12px; color: #2d3e40;">
          <h2 style="color: #2d3e40; font-size: 24px; margin-bottom: 20px;">Nueva Solicitud de Reserva</h2>
          <p>Hola <strong>${therapistName}</strong>,</p>
          <p>Has recibido una nueva solicitud de un paciente interesado en tus servicios.</p>
          
          <div style="background-color: #faf9f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin-top: 0; font-size: 18px; color: #c4a484;">Datos del Paciente</h3>
            <p><strong>Nombre:</strong> ${patientData.name}</p>
            <p><strong>Teléfono:</strong> +${patientData.countryCode || '56'} ${patientData.phone}</p>
            <p><strong>Tipo de solicitud:</strong> ${patientData.urgency}</p>
            <p><strong>Horario preferencia:</strong> ${patientData.timeRange || 'A coordinar por WhatsApp'}</p>
          </div>
          
          <p>Por favor, contacta al paciente lo antes posible para confirmar la sesión.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
            Este es un sistema automático de Psicólogos Ahora.
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error devuelto por Resend:", error);
      return Response.json({ error }, { status: 500 });
    }

    console.log("Correo enviado exitosamente:", data);
    return Response.json(data);
  } catch (error) {
    console.error("Error crítico en API /api/send:", error);
    return Response.json({ error }, { status: 500 });
  }
}
