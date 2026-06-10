import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { acceptBounty } from "../actions";

export default async function BountyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Verificar sesión
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Obtener detalles del contrato con el planeta
  const { data: bounty } = await supabase
    .from('bounties')
    .select('*, planetas(*)')
    .eq('id', id)
    .single();

  if (!bounty) notFound();

  const isOwner = bounty.hunter_id === user.id;
  const isAvailable = bounty.status === 'Disponible';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Link 
        href="/dashboard" 
        className="text-[10px] text-gray-500 uppercase font-mono hover:text-neon-cyan transition-colors flex items-center gap-2"
      >
        <span>← Volver al Panel de Operaciones</span>
      </Link>

      <div className="bg-terminal-gray/20 border border-terminal-border p-8 relative overflow-hidden">
        {/* Decoración Táctica */}
        <div className={`absolute top-0 right-0 w-1 h-full ${isAvailable ? 'bg-neon-green' : 'bg-neon-amber'}`} />
        
        <header className="space-y-4 relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-neon-cyan font-mono uppercase tracking-[0.3em]">Expediente de Contrato</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tighter">{bounty.title}</h1>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-gray-500 uppercase font-mono">Recompensa</span>
              <span className="text-3xl font-bold text-neon-amber font-mono">{bounty.reward} CR</span>
            </div>
          </div>

          <div className="flex gap-6 border-y border-terminal-border/50 py-4">
            <div>
              <span className="block text-[10px] text-gray-500 uppercase font-mono">Planeta</span>
              <span className="text-white font-bold uppercase">{bounty.planetas?.name}</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 uppercase font-mono">Sector</span>
              <span className="text-white font-bold uppercase">{bounty.planetas?.sector}</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 uppercase font-mono">Peligro</span>
              <span className="text-neon-red font-bold uppercase">Nivel {bounty.planetas?.danger_level}</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 uppercase font-mono">Estado</span>
              <span className={`${isAvailable ? 'text-neon-green' : 'text-neon-amber'} font-bold uppercase`}>{bounty.status}</span>
            </div>
          </div>
        </header>

        <div className="mt-8 space-y-6 relative z-10">
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono italic">Descripción de la Misión:</h2>
            <p className="text-gray-300 leading-relaxed font-mono text-sm border-l-2 border-terminal-border pl-4">
              {bounty.raw_description}
            </p>
          </div>

          {/* Acción: Aceptar Contrato */}
          <div className="pt-8 flex flex-col items-center">
            {isAvailable ? (
              <form action={async () => {
                'use server'
                const res = await acceptBounty(bounty.id, bounty.version);
                if (res.error) {
                  // Redirigir con error si falla la concurrencia
                  redirect(`/dashboard/bounty/${bounty.id}?error=${encodeURIComponent(res.error)}`);
                }
              }}>
                <button className="px-12 py-4 bg-neon-green text-terminal-black font-bold uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                  Aceptar Contrato y Bloquear Transmisión
                </button>
              </form>
            ) : isOwner ? (
              <div className="p-4 border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan text-xs uppercase font-mono tracking-widest">
                ✓ Eres el Hunter asignado a esta misión
              </div>
            ) : (
              <div className="p-4 border border-terminal-border bg-terminal-gray/30 text-gray-500 text-xs uppercase font-mono tracking-widest">
                Contrato asignado a otro Hunter
              </div>
            )}
            
            <p className="mt-4 text-[9px] text-gray-600 font-mono uppercase text-center max-w-xs">
              Al aceptar, usted se compromete con las reglas del gremio. 
              El fallo en la misión resultará en la pérdida de reputación galáctica.
            </p>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute bottom-0 right-0 p-2 opacity-5 font-mono text-[60px] font-bold text-white pointer-events-none select-none uppercase tracking-tighter">
          {bounty.planetas?.name}
        </div>
      </div>
    </div>
  );
}
