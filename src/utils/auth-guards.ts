'use server'

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Valida si el usuario actual tiene el rol de Administrador.
 * Si no lo es, redirige al dashboard.
 */
export async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'Administrador_Gremio') {
    redirect('/dashboard');
  }
}
