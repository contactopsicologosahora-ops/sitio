'use server'

import { createClient } from '@supabase/supabase-js';

// Helper function para crear un cliente supabase autenticado para acciones desde el servidor
// Requiere la inyección del token del cliente porque no se está usando cookies via @supabase/ssr
const createSecureClient = (accessToken: string) => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }
    );
};

// Validar que el usuario existe y extraer el terapeuta_id
const authorizeTherapist = async (supabase: any) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        throw new Error("Acceso denegado: Token de sesión inválido o expirado");
    }

    const { data: therapist, error: tError } = await supabase
        .from('terapeutas')
        .select('id')
        .eq('email', user.email)
        .single();
        
    if (tError || !therapist) {
        throw new Error("Acceso denegado: Perfil de terapeuta no encontrado");
    }

    return therapist.id;
};

// Acción Segura: Actualizar el estado de un lead/paciente
export async function updateLeadStatusAction(accessToken: string, leadId: number, status: string) {
    const supabase = createSecureClient(accessToken);
    const therapistId = await authorizeTherapist(supabase);

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
    const supabase = createSecureClient(accessToken);
    const therapistId = await authorizeTherapist(supabase);

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
    const supabase = createSecureClient(accessToken);
    const therapistId = await authorizeTherapist(supabase);

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
    const supabase = createSecureClient(accessToken);
    const therapistId = await authorizeTherapist(supabase);

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
    const supabase = createSecureClient(accessToken);
    const therapistId = await authorizeTherapist(supabase);

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
