import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { therapistName } = body;

        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            console.error("Resend API Key is missing");
            return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
        }

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: "Psicólogos Ahora <notificaciones@psicologosahora.cl>",
                to: ["cfernandez.bolton@gmail.com", "juanrojaspardo@gmail.com"],
                subject: `🚨 ALERTA: Supervisión Urgente Requerida por ${therapistName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                        <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center;">
                            <h2 style="margin: 0;">🚨 BOTÓN DE PÁNICO ACADÉMICO ACTIVADO 🚨</h2>
                        </div>
                        <div style="padding: 30px;">
                            <p style="font-size: 16px;">Hola Equipo Clínico,</p>
                            
                            <p style="font-size: 16px;">El especialista <strong>${therapistName}</strong> ha presionado el Botón de Pánico Académico desde su panel de control.</p>
                            
                            <p style="font-size: 16px;">Esto indica que se encuentra frente a un caso clínico complejo que requiere supervisión o asistencia urgente (riesgo suicida, crisis severa, desregulación grave, etc.).</p>
                            
                            <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <strong>Acción Sugerida:</strong> Contactar al especialista a la brevedad para coordinar la asistencia o derivación.
                            </div>
                            
                            <p style="font-size: 14px; color: #777; margin-top: 30px;">Este es un mensaje automático del sistema de Psicólogos Ahora.</p>
                        </div>
                    </div>
                `
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Resend API Error: ${errorText}`);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error sending panic email:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
