export interface TherapistMetrics {
    supervisionAttendance: boolean; // Asistencia a supervisión clínica (+20)
    weeklyAvailabilityHours: number; // Disponibilidad semanal (hasta +15)
    seniorityMonths: number; // Permanencia en Psicólogos Ahora (hasta +24)
    patientAdherence: number; // Porcentaje de adherencia 0-100 (hasta +30)
}

export interface TherapistWithMetrics {
    id: number;
    name: string;
    metrics?: TherapistMetrics;
    [key: string]: any;
}

export function calculateTherapistScore(therapist: TherapistWithMetrics): number {
    let score = 0;

    if (therapist.metrics) {
        const {
            supervisionAttendance,
            weeklyAvailabilityHours,
            seniorityMonths,
            patientAdherence
        } = therapist.metrics;

        if (supervisionAttendance) {
            score += 20;
        }

        // Cap at 30 hours for scoring purposes (max 15 points)
        score += Math.min(weeklyAvailabilityHours, 30) * 0.5;

        // Cap at 24 months for scoring purposes (max 24 points)
        score += Math.min(seniorityMonths, 24) * 1.0;

        score += (patientAdherence / 100) * 30; // Max 30 points
    }

    // Manual Overrides requested by User:
    // "siempre deben estar un poco más arriba Esteban, paola y manuel."
    const nameLower = therapist.name.toLowerCase();
    
    if (nameLower.includes("esteban") || nameLower.includes("paola") || nameLower.includes("manuel")) {
        score += 100; // Gran bono para asegurar los primeros lugares
    }

    // "siempre un poquito más abajo en la lista la Vero y la fran"
    if (nameLower.includes("verónica") || nameLower.includes("vero") || nameLower.includes("fran")) {
        score -= 50; // Penalización para asegurar que aparezcan más abajo
    }

    return score;
}
