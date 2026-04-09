import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

const DATA_FILE = path.join(process.cwd(), 'therapist_data.json');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback` : 'http://localhost:3000/api/auth/google/callback'
);

function getAvailabilityData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
            const initial: Record<string, string[]> = {};
            days.forEach((d) => {
                if (d !== 'Dom' && d !== 'Sab') initial[d] = ['09:00', '10:00', '11:00', '15:00', '16:00'];
                else initial[d] = [];
            });
            return { 1: initial, 2: initial, 3: initial };
        }
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch {
        return {};
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const therapistId = searchParams.get('therapistId') || '1';

    const allData = getAvailabilityData();
    const therapistData = allData[therapistId] || Object.values(allData)[0] || {};
    
    // Limpiar props
    const rawAvailability: Record<string, string[]> = {};
    const daysArr = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    daysArr.forEach(d => {
        if (therapistData[d]) rawAvailability[d] = therapistData[d];
        else rawAvailability[d] = [];
    });

    if (!therapistData.isGoogleConnected || !therapistData.googleTokens) {
        return NextResponse.json(rawAvailability);
    }

    try {
        oauth2Client.setCredentials(therapistData.googleTokens);
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // Consultamos la disponibilidad para los próximos 7 días como aproximación al UI actual
        const timeMin = new Date();
        const timeMax = new Date();
        timeMax.setDate(timeMax.getDate() + 7);

        const freeBusyRes = await calendar.freebusy.query({
            requestBody: {
                timeMin: timeMin.toISOString(),
                timeMax: timeMax.toISOString(),
                items: [{ id: 'primary' }]
            }
        });

        const busyBlocks = freeBusyRes.data.calendars?.['primary']?.busy || [];

        // Hacemos un cruce: Transformamos blocks ocupados en [Dia, Hora]
        // y removemos esos pares de nuestro rawAvailability
        const finalAvailability = { ...rawAvailability };

        busyBlocks.forEach((block: any) => {
            if (block.start && block.end) {
                const startDate = new Date(block.start);
                // Si el evento cae en la misma hora (ej 10:xx), la removemos
                const dayStr = daysArr[startDate.getDay()];
                const hourStr = `${startDate.getHours().toString().padStart(2, '0')}:00`;
                
                if (finalAvailability[dayStr]) {
                    finalAvailability[dayStr] = finalAvailability[dayStr].filter(h => h !== hourStr);
                }
            }
        });

        // Actualizamos los tokens si google los refrescó silenciosamente
        if (oauth2Client.credentials.access_token !== therapistData.googleTokens.access_token) {
            therapistData.googleTokens = oauth2Client.credentials;
            allData[therapistId] = therapistData;
            fs.writeFileSync(DATA_FILE, JSON.stringify(allData, null, 2), 'utf-8');
        }

        return NextResponse.json(finalAvailability);
        
    } catch (error) {
        console.error("Google Calendar Error:", error);
        // Fallback a disponibilidad de BD si falla GC
        return NextResponse.json(rawAvailability);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { therapistId, availability } = body;

        const allData = getAvailabilityData();
        if (!allData[therapistId]) allData[therapistId] = {};
        
        const daysArr = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
        daysArr.forEach(d => {
            if (availability[d]) allData[therapistId][d] = availability[d];
        });

        fs.writeFileSync(DATA_FILE, JSON.stringify(allData, null, 2), 'utf-8');
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
