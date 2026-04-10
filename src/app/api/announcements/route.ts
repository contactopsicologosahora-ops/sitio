import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

// HTML Template Builder
function buildAnnouncementEmail(title: string, content: string) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuevo Comunicado</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f7f9fa;
          margin: 0;
          padding: 0;
          color: #333333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }
        .header {
          background-color: #E6F0EB;
          padding: 30px;
          text-align: center;
          border-bottom: 2px solid #D1E3D8;
        }
        .logo {
          width: 50px;
          height: 50px;
          margin-bottom: 10px;
        }
        .brand-name {
          font-size: 20px;
          font-weight: 700;
          color: #1F2937;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .content {
          padding: 40px 30px;
        }
        .title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin-top: 0;
          margin-bottom: 20px;
          line-height: 1.3;
        }
        .body-text {
          font-size: 16px;
          line-height: 1.6;
          color: #4B5563;
          white-space: pre-wrap; /* Mantiene los saltos de línea del textarea */
        }
        .footer {
          background-color: #F9FAFB;
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid #E5E7EB;
        }
        .footer-text {
          font-size: 13px;
          color: #6B7280;
          margin: 0;
        }
        .action-container {
          margin-top: 30px;
          text-align: center;
        }
        .btn {
          display: inline-block;
          background-color: #1a6fba;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <!-- Opcional si tienes logo: <img src="https://tusitio.com/logo.png" alt="Psicólogos Ahora" class="logo"> -->
          <h2 class="brand-name">Psicólogos Ahora</h2>
        </div>
        
        <div class="content">
          <h1 class="title">${title}</h1>
          <div class="body-text">${content}</div>
          
          <div class="action-container">
            <a href="https://psicologosahora.cl" class="btn">Ir a la Plataforma</a>
          </div>
        </div>
        
        <div class="footer">
          <p class="footer-text">Has recibido este mensaje porque eres parte del equipo de Psicólogos Ahora.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: Request) {
  try {
    const { title, content, sendEmail } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Título y contenido son requeridos.' }, { status: 400 });
    }

    // 1. Guardar en Supabase
    const { data: insertData, error: dbError } = await supabase
      .from('announcements')
      .insert([
        { 
          title, 
          content, 
          sent_via_email: sendEmail 
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Error insertando anuncio en DB:', dbError);
      return NextResponse.json({ error: 'Error al guardar el comunicado.' }, { status: 500 });
    }

    // 2. Si sendEmail es true, enviamos correos masivos
    if (sendEmail) {
      // Traer todos los terapeutas
      const { data: terapeutas, error: getTherapistsError } = await supabase
        .from('terapeutas')
        .select('email, name');

      if (getTherapistsError || !terapeutas || terapeutas.length === 0) {
        console.error('Error obteniendo terapeutas:', getTherapistsError);
        // Aun así devolvemos ok porque ya se guardó
        return NextResponse.json({ message: 'Comunicado guardado pero no se enviaron correos (no hay terapeutas o error al obtener).' });
      }

      // Preparar envío masivo: Resend permite enviar a 50 destinatarios simultáneos (BCC).
      // Extraemos solo los arreglos de strings
      const emailsList = terapeutas.map(t => t.email).filter(e => e); // filtrar vacíos o nulos

      if (emailsList.length > 0) {
        // Generar el HTML Premium
        const emailHtml = buildAnnouncementEmail(title, content);

        const { error: resendError } = await resend.emails.send({
          from: 'Psicólogos Ahora <hola@psicologosahora.cl>',
          to: 'hola@psicologosahora.cl',
          bcc: emailsList,
          subject: title,
          html: emailHtml
        });

        if (resendError) {
          console.error("Resend Error al enviar a terapeutas:", resendError);
          return NextResponse.json({ error: 'Comunicado guardado, pero falló el envío masivo.' }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ message: 'Comunicado publicado exitosamente.', data: insertData }, { status: 200 });

  } catch (error) {
    console.error('Error en API announcements:', error);
    return NextResponse.json({ error: 'Error del servidor.' }, { status: 500 });
  }
}
