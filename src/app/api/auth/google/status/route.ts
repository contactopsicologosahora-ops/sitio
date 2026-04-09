import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'therapist_data.json');

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const therapistId = searchParams.get('therapistId') || '1';

    try {
        if (!fs.existsSync(DATA_FILE)) {
            return NextResponse.json({ isConnected: false });
        }
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        const allData = JSON.parse(fileContent);

        const therapistData = allData[therapistId];
        if (therapistData && therapistData.isGoogleConnected) {
            return NextResponse.json({ isConnected: true });
        }
        
        return NextResponse.json({ isConnected: false });
    } catch (e) {
        return NextResponse.json({ isConnected: false });
    }
}
