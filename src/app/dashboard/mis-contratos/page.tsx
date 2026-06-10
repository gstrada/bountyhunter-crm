import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { completeBounty } from "../bounty/actions";

export default async function MisContratosPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Obtener contratos del Hunter logueado
  const { data: bounties } = await supabase
    .from('bounties')
    .select('*, planetas(name)')
    .eq('hunter_id', user.id)
    .order('updated_at', { ascending: false });

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <header className="border-b border-terminal-border pb-6">
        <h1 className="text-2xl font-bold text-white tracking-tighter uppercase font-mono">
          Mis <span className="text-neon-cyan">Misiones Activas</span>
        </h1>
        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">
          Registro oficial de operaciones del Hunter
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {bounties && bounties.length > 0 ? (
          bounties.map((bounty) => (
            <div 
              key={bounty.id} 
              className={`bg-terminal-gray/20 border p-6 flex flex-col md:flex-row justify-between items-center gap-6 ${
                bounty.status === 'Completado' ? 'border-terminal-border opacity-60' : 'border-neon-cyan/30'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${bounty.status === 'Completado' ? 'bg-gray-600' : 'bg-neon-cyan animate-pulse'}`} />
                  <h3 className="text-lg font-bold text-white uppercase">{bounty.title}</h3>
                </div>
                <div className="flex gap-4 text-[10px] font-mono uppercase text-gray-400">
                  <span>Destino: <span className="text-white">{bounty.planetas?.name}</span></span>
                  <span>Recompensa: <span className="text-neon-amber">{bounty.reward} CR</span></span>
                  <span>Estado: <span className={bounty.status === 'Completado' ? 'text-gray-500' : 'text-neon-cyan'}>{bounty.status}</span></span>
                </div>
              </div>

              <div className="flex gap-4">
                <Link 
                  href={`/dashboard/bounty/${bounty.id}`}
                  className="px-4 py-2 border border-terminal-border text-gray-400 text-[10px] uppercase font-bold hover:text-white transition-all"
                >
                  Ver Detalles
                </Link>
                
                {bounty.status === 'Asignado' && (
                  <form action={async () => {
                    'use server'
                    await completeBounty(bounty.id);
                  }}>
                    <button className="px-6 py-2 bg-neon-cyan text-terminal-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">
                      Confirmar Eliminación / Entrega
                    </button>
                  </form>
                )}

                {bounty.status === 'Completado' && (
                  <div className="px-6 py-2 border border-neon-green/30 text-neon-green text-[10px] font-bold uppercase tracking-widest">
                    Liquidado ✓
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="border border-dashed border-terminal-border p-20 text-center space-y-4">
            <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">
              Su historial de misiones está vacío...
            </p>
            <Link href="/dashboard" className="text-neon-cyan text-[10px] uppercase font-mono underline">
              Buscar Contratos Disponibles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
