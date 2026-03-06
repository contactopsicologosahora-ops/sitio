// Simple in-memory storage for demonstration. 
// In a real app, this would be a database.

export const metricsData = {
    visits: {
        total: 0,
        unique: 0,
        therapistsView: 0
    },
    therapists: [
        { id: 1, name: "Dr. Roberto Bolton", chosen: 0, profilViews: 0 },
        { id: 2, name: "Dra. Elena Pardo", chosen: 0, profilViews: 0 },
        { id: 3, name: "Lic. Marcos Sierra", chosen: 0, profilViews: 0 },
    ],
    leads: [
        { id: 'L1', therapistId: 2, therapistName: "Dra. Elena Pardo", patientName: "Juan Perez", status: 'potential', date: '2026-03-03' },
        { id: 'L2', therapistId: 1, therapistName: "Dr. Roberto Bolton", patientName: "Maria Garcia", status: 'patient', date: '2026-03-01' },
        { id: 'L3', therapistId: 1, therapistName: "Dr. Roberto Bolton", patientName: "Carlos Lopez", status: 'lost', date: '2026-02-28' },
    ]
};

export type LeadStatus = 'potential' | 'patient' | 'lost';
