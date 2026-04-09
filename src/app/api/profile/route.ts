import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROFILE_DATA_FILE = path.join(process.cwd(), 'therapist_profiles.json');

function getProfileData() {
    try {
        if (!fs.existsSync(PROFILE_DATA_FILE)) {
            return {};
        }
        const fileContent = fs.readFileSync(PROFILE_DATA_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading profile data file:', error);
        return {};
    }
}

export async function GET(request: Request) {
    const allData = getProfileData();
    return NextResponse.json(allData);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { therapistId, profile } = body;

        if (!therapistId || !profile) {
            return NextResponse.json({ error: 'Missing therapistId or profile data' }, { status: 400 });
        }

        const allData = getProfileData();
        allData[therapistId] = profile;

        fs.writeFileSync(PROFILE_DATA_FILE, JSON.stringify(allData, null, 2), 'utf-8');

        return NextResponse.json({ success: true, profile });
    } catch (error) {
        console.error('Error writing profile data file:', error);
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}
