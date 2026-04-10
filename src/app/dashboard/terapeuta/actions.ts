'use server'

import { createClient } from '@supabase/supabase-js';

// Usamos Service Role Key para saltar RLS ya que implementamos auth manual personalizado
const createSecureClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
};

// Validar que el usuario existe y extraer el terapeuta_id
const authorizeTherapist = async (supabase: any, accessToken: string) => {
    // En nuestro auth manual, el accessToken es simplemente el email del terapeuta validado
    const email = accessToken;

    if (!email) {
        throw new Error("Acceso denegado: Token de sesión inválido o expirado");
    }

    const { data: therapist, error: tError } = await supabase
        .from('terapeutas')
        .select('id')
        .eq('email', email)
        .single();
        
    if (tError || !therapist) {
        throw new Error("Acceso denegado: Perfil de terapeuta no encontrado");
    }

    return therapist.id;
};

// Acción Segura: Actualizar el estado de un lead/paciente
export async function updateLeadStatusAction(accessToken: string, leadId: number, status: string) {
    const supabase = createSecureClient();
    const therapistId = await authorizeTherapist(supabase, accessToken);

    // Solo actualizar si el terapeuta_id coincide
    const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId)
        .eq('therapist_id', therapistId); // Blindaje duro a nivel de acción de servidor

    if (error) {
        console.error("DLP - Intento fallido de actualizar paciente:", error);
        return { success: false, error: 'No se pudo actualizar el registro' };
    }
    
    return { success: true };
}

// Acción Segura: Asociar pago de Encuadrado
export async function matchPaymentAction(accessToken: string, paymentId: string, leadId: number) {
    const supabase = createSecureClient();
    const therapistId = await authorizeTherapist(supabase, accessToken);

    // 1. Verificar si el pago le pertenece a ESE terapeuta
    const { data: payment, error: pError } = await supabase
        .from('payments')
        .select('id')
        .eq('id', paymentId)
        .eq('therapist_id', therapistId)
        .single();

    if (pError || !payment) {
        return { success: false, error: 'Pago no autorizado o no encontrado' };
    }

    // 2. Ejecutar vinculación del pago
    const { error: updateError } = await supabase
        .from('payments')
        .update({ status: 'matched', patient_id: leadId })
        .eq('id', paymentId);

    if (updateError) return { success: false, error: 'Hubo un error al guardar' };

    // 3. Ejecutar actualización del paciente
    // Obtenemos los pormenores del paciente
    const { data: lead } = await supabase
        .from('leads')
        .select('sessions')
        .eq('id', leadId)
        .eq('therapist_id', therapistId)
        .single();

    if (lead) {
        const newSessions = (lead.sessions || 0) + 1;
        await supabase.from('leads')
            .update({ sessions: newSessions })
            .eq('id', leadId);
    }
    
    return { success: true };
}

// Acción Segura: Guardar el perfil público
export async function saveProfileAction(accessToken: string, profileData: any) {
    const supabase = createSecureClient();
    const therapistId = await authorizeTherapist(supabase, accessToken);

    const { error } = await supabase
        .from('terapeutas')
        .update({ 
            price: profileData.price, 
            title: profileData.title, 
            bio: profileData.bio,
            tags: profileData.tags,
            education: profileData.education,
            impact: profileData.impact,
            methodology: profileData.methodology,
            quote: profileData.quote,
            button_text: profileData.button_text,
            duration: profileData.duration
        })
        .eq('id', therapistId);

    if (error) {
        console.error("DLP - Fallo al actualizar el perfil:", error);
        return { success: false, error: 'Ocurrió un error al intentar actualizar' };
    }

    return { success: true };
}

// Acción Segura: Marcar comunicado como leído
export async function markAnnouncementReadAction(accessToken: string, announcementId: string) {
    const supabase = createSecureClient();
    const therapistId = await authorizeTherapist(supabase, accessToken);

    // Intentamos hacer upsert
    const { error } = await supabase
        .from('therapist_announcements')
        .upsert(
            { announcement_id: announcementId, therapist_id: therapistId, is_read: true, is_hidden: false, read_at: new Date().toISOString() },
            { onConflict: 'announcement_id, therapist_id' }
        );

    if (error) {
        console.error("Error al marcar como leído:", error);
        return { success: false, error: 'No se pudo procesar la acción' };
    }

    return { success: true };
}

// Acción Segura: Ocultar comunicado
export async function hideAnnouncementAction(accessToken: string, announcementId: string) {
    const supabase = createSecureClient();
    const therapistId = await authorizeTherapist(supabase, accessToken);

    // Actualizamos el registro existente para poner oculto = true
    const { error } = await supabase
        .from('therapist_announcements')
        .update({ is_hidden: true })
        .eq('announcement_id', announcementId)
        .eq('therapist_id', therapistId);

    if (error) {
        console.error("Error al ocultar comunicado:", error);
        return { success: false, error: 'No se pudo ocultar el aviso' };
    }

    return { success: true };
}

// ==== ACCIONES DE LECTURA (Bypass RLS) ====
export async function getTherapistInfoAction(accessToken: string) {
    const supabase = createSecureClient();
    try {
        const therapistId = await authorizeTherapist(supabase, accessToken);
        const { data, error } = await supabase.from('terapeutas').select('id, name, email, image, price, title, bio, tags, education, impact, methodology, quote, button_text, duration').eq('id', therapistId).single();
        if (error) throw error;
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getLeadsAction(accessToken: string) {
    const supabase = createSecureClient();
    try {
        const therapistId = await authorizeTherapist(supabase, accessToken);
        let { data, error } = await supabase.from('leads').select('id, name, email, phone, status, theme, sessions, created_at').eq('therapist_id', therapistId).order('created_at', { ascending: false });
        if (error) {
            const fallback = await supabase.from('leads').select('id, name, email, phone, status, theme, sessions, created_at').eq('terapeuta_id', therapistId).order('created_at', { ascending: false });
            if (fallback.data) data = fallback.data;
        }
        return { success: true, data: data || [] };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getPendingPaymentsAction(accessToken: string) {
    const supabase = createSecureClient();
    try {
        const therapistId = await authorizeTherapist(supabase, accessToken);
        const { data, error } = await supabase
            .from('payments')
            .select('id, amount, encuadrado_patient_name, encuadrado_patient_email, payment_date')
            .eq('status', 'pending_match')
            .eq('therapist_id', therapistId)
            .order('created_at', { ascending: false });
        return { success: true, data: data || [] };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getAnnouncementsAction(accessToken: string) {
     const supabase = createSecureClient();
     try {
         const therapistId = await authorizeTherapist(supabase, accessToken);
         const { data, error } = await supabase
                .from('announcements')
                .select(`
                    *,
                    therapist_announcements(is_read, is_hidden, therapist_id)
                `)
                .order('created_at', { ascending: false });
         if (data && !error) {
                const mappedAnnouncements = data.map((ann: any) => {
                    const status = ann.therapist_announcements?.find((s: any) => s.therapist_id === therapistId) || {};
                    return { ...ann, is_read: status.is_read || false, is_hidden: status.is_hidden || false };
                }).filter((ann: any) => !ann.is_hidden);
                return { success: true, data: mappedAnnouncements };
         }
         return { success: true, data: [] };
     } catch (e: any) {
         return { success: false, error: e.message };
     }
}
