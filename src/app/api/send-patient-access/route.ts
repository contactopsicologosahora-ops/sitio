import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Verifica si la key existe, si no, es probable que no funcione en producción hasta que se agregue al .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json();

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos: email, name o password' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Psicólogos Ahora <hola@psicologosahora.cl>', // Deberás verificar este dominio en Resend, o usar onboarding@resend.dev para pruebas
      to: email,
      subject: '¡Bienvenido(a) a Psicólogos Ahora! Tu acceso al portal de pacientes',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #fcfaf7; color: #2c3333; max-width: 600px; margin: 0 auto; border-radius: 12px;">
          <h2 style="color: #2d3e40; font-size: 24px; margin-bottom: 20px; text-align: center;">¡Hola, ${name}!</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Tu terapeuta te ha dado de alta en nuestra plataforma. Ahora tienes acceso a tu <strong>Dashboard Privado de Pacientes</strong> donde podrás ver tu historial, sesiones, recursos y mucho más.
          </p>
          
          <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin: 30px 0; border: 1px solid #e1dcd5; text-align: center;">
            <p style="margin: 0; font-size: 15px; color: #636e72; margin-bottom: 10px;">Tus credenciales de acceso son:</p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Correo:</strong> ${email}</p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Contraseña:</strong> <span style="background-color: #f5f2ed; padding: 4px 10px; border-radius: 4px; font-family: monospace; font-size: 18px; color: #2d3e40;">${password}</span></p>
          </div>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://app.psicologosahora.cl/dashboard/paciente" style="background-color: #2d3e40; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block;">Acceder a mi panel</a>
          </div>
          
          <p style="font-size: 14px; line-height: 1.5; color: #636e72; margin-top: 30px; text-align: center;">
            Puedes cambiar tu contraseña en cualquier momento desde tu perfil dentro de la plataforma.<br><br>
            Si tienes alguna duda, responde a este correo.<br><br>
            El equipo de <strong>Psicólogos Ahora</strong>.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error de Resend:', error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Excepción al enviar email de acceso a paciente:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
