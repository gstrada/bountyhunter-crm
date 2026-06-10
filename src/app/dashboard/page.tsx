import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '../login/actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch inicial de contratos (Bounties)
  const { data: bounties } = await supabase
    .from('bounties')
    .select('*, planetas(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header del Dashboard */}
      <header className="flex justify-between items-center border-b border-terminal-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tighter uppercase font-mono">
            Panel de <span className="text-neon-green">Operaciones</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">
            Identidad Confirmada: <span className="text-neon-cyan">{user.email}</span>
          </p>
        </div>
        
        <form action={signOut}>
          <button className="px-4 py-2 border border-neon-red/30 text-neon-red text-[10px] uppercase font-mono hover:bg-neon-red hover:text-terminal-black transition-all">
            Desconectar Terminal
          </button>
        </form>
      </header>

      {/* Grid de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Contratos Disponibles', value: bounties?.length || 0, color: 'text-neon-cyan' },
          { label: 'Créditos en Juego', value: '45.2k', color: 'text-neon-amber' },
          { label: 'Sectores Activos', value: '12', color: 'text-white' },
          { label: 'Reputación Gremio', value: 'A+', color: 'text-neon-green' },
        ].map((stat, i) => (
          <div key={i} className="bg-terminal-gray/30 border border-terminal-border p-4">
            <span className="block text-[10px] text-gray-500 uppercase font-mono mb-1">{stat.label}</span>
            <span className={`text-2xl font-bold ${stat.color} font-mono`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Lista de Contratos */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
          <span className="h-2 w-2 bg-neon-green rounded-full animate-ping" />
          Transmisiones de Contratos Entrantes
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {bounties && bounties.length > 0 ? (
            bounties.map((bounty) => (
              <div 
                key={bounty.id} 
                className="group bg-terminal-gray/20 border border-terminal-border p-5 hover:border-neon-green transition-all relative overflow-hidden"
              >
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">{bounty.title}</h3>
                    <div className="flex gap-4 mt-2 text-[10px] font-mono uppercase text-gray-500">
                      <span>Planeta: <span className="text-neon-cyan">{bounty.planetas?.name || 'Desconocido'}</span></span>
                      <span>Recompensa: <span className="text-neon-amber">{bounty.reward} CR</span></span>
                      <span>Estado: <span className={bounty.status === 'Disponible' ? 'text-neon-green' : 'text-neon-amber'}>{bounty.status}</span></span>
                    </div>
                  </div>
                  <Link 
                    href={`/dashboard/bounty/${bounty.id}`}
                    className="px-4 py-2 bg-terminal-border text-white text-[10px] uppercase font-bold hover:bg-neon-green hover:text-terminal-black transition-all"
                  >
                    Ver Detalles
                  </Link>
                </div>
                {/* Decoración de fondo al hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 blur-3xl rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))
          ) : (
            <div className="border border-dashed border-terminal-border p-20 text-center space-y-4">
              <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">
                No hay transmisiones activas en este sector...
              </p>
              <button className="text-neon-cyan text-[10px] uppercase font-mono underline">
                Refrescar Frecuencia
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
