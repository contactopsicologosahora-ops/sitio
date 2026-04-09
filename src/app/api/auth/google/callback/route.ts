import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'therapist_data.json');

function getAvailabilityData() {
    try {
        if (!fs.existsSync(DATA_FILE)) return {};
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch {
        return {};
    }
}

export async function GET(request: Request) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback` : 'http://localhost:3000/api/auth/google/callback'
  );

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const therapistId = searchParams.get('state');

  if (!code || !therapistId) {
    return NextResponse.json({ error: 'Falta código o ID de terapeuta' }, { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    const allData = getAvailabilityData();
    if (!allData[therapistId]) {
      allData[therapistId] = {};
    }
    
    allData[therapistId].googleTokens = tokens;
    allData[therapistId].isGoogleConnected = true;

    fs.writeFileSync(DATA_FILE, JSON.stringify(allData, null, 2), 'utf-8');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/dashboard/terapeuta?tab=agenda&googleConnect=success`);

  } catch (error) {
    console.error('Error al obtener tokens de Google', error);
    return NextResponse.json({ error: 'Fallo autenticación con Google' }, { status: 500 });
  }
}
