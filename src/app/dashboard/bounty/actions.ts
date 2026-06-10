'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function acceptBounty(bountyId: string, currentVersion: number) {
  const supabase = await createClient();

  // 1. Verificar sesión del Hunter
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Acceso no autorizado");

  /**
   * CONTROL DE CONCURRENCIA OPTIMISTA (Anti Double-Booking)
   * Intentamos actualizar el contrato solo si la versión coincide y el estado es 'Disponible'.
   * Si otro Hunter lo aceptó antes, la versión habrá cambiado y esta consulta afectará a 0 filas.
   */
  const { data, error, count } = await supabase
    .from('bounties')
    .update({ 
      status: 'Asignado', 
      hunter_id: user.id,
      version: currentVersion + 1 
    })
    .eq('id', bountyId)
    .eq('version', currentVersion) // Clave para la concurrencia optimista
    .eq('status', 'Disponible')    // Doble verificación de estado
    .select();

  if (error) {
    console.error("Error al aceptar contrato:", error);
    return { error: "Fallo en la comunicación con la red del Gremio." };
  }

  // Si no se actualizó ninguna fila, es porque alguien más lo aceptó primero
  if (!data || data.length === 0) {
    return { error: "CONCURRENCIA_FALLIDA: El contrato ya ha sido reclamado por otro Hunter." };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/bounty/${bountyId}`);
  
  return { success: true };
}

export async function completeBounty(bountyId: string) {
  const supabase = await createClient();

  // 1. Verificar sesión y contrato
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Acceso no autorizado");

  const { data: bounty, error: bError } = await supabase
    .from('bounties')
    .select('reward, status, hunter_id')
    .eq('id', bountyId)
    .single();

  if (bError || !bounty) return { error: "Contrato no encontrado." };
  if (bounty.hunter_id !== user.id) return { error: "No eres el Hunter asignado a esta misión." };
  if (bounty.status === 'Completado') return { error: "Este contrato ya ha sido liquidado." };

  // 2. Transacción de finalización (Actualizar estado y sumar créditos)
  // Nota: En una app real de alto volumen usaríamos un RPC de Postgres para atomicidad total.
  
  // A: Marcar como completado
  const { error: updateError } = await supabase
    .from('bounties')
    .update({ status: 'Completado' })
    .eq('id', bountyId);

  if (updateError) return { error: "Error al cerrar el expediente." };

  // B: Sumar créditos al perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('creditos_galacticos')
    .eq('id', user.id)
    .single();

  const nuevosCreditos = (profile?.creditos_galacticos || 0) + bounty.reward;

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ creditos_galacticos: nuevosCreditos })
    .eq('id', user.id);

  if (profileError) return { error: "Error al transferir créditos a su cuenta." };

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/mis-contratos');
  revalidatePath(`/dashboard/bounty/${bountyId}`);
  
  return { success: true, reward: bounty.reward };
}
