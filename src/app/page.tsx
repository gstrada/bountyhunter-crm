import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6 text-center">
      <div className="max-w-3xl w-full space-y-8 bg-terminal-gray/50 p-10 border border-terminal-border backdrop-blur-sm relative overflow-hidden">
        {/* Decoración de esquina táctica */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-cyan" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-cyan" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-cyan" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-cyan" />

        <header className="space-y-2">
          <div className="inline-block px-3 py-1 border border-neon-green text-neon-green text-xs tracking-[0.3em] uppercase mb-4">
            Sistema de Seguridad de Nivel 4
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
            BOUNTY<span className="text-neon-green">HUNTER</span>
            <span className="block text-2xl md:text-3xl text-terminal-border mt-2 font-mono">CRM // GUILD_OS v1.0.4</span>
          </h1>
        </header>

        <p className="text-gray-400 max-w-xl mx-auto font-mono text-sm leading-relaxed">
          Bienvenido al portal central del Gremio de Caza-Recompensas. 
          Acceda para gestionar contratos, rastrear objetivos en el Borde Exterior y reclamar sus créditos galácticos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link 
            href="/login"
            className="group relative px-8 py-3 bg-neon-green text-terminal-black font-bold uppercase tracking-widest overflow-hidden transition-all hover:bg-neon-cyan"
          >
            <span className="relative z-10">Iniciar Sesión</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          </Link>
          
          <button className="px-8 py-3 border border-terminal-border text-gray-400 uppercase tracking-widest font-mono text-xs hover:text-white hover:border-white transition-colors">
            Solicitar Ingreso al Gremio
          </button>
        </div>

        <div className="pt-10 grid grid-cols-3 gap-4 border-t border-terminal-border">
          <div className="text-center">
            <span className="block text-neon-cyan text-xl font-bold">1.2k+</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-tighter font-mono">Contratos Activos</span>
          </div>
          <div className="text-center">
            <span className="block text-neon-amber text-xl font-bold">48h</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-tighter font-mono">Promedio de Pago</span>
          </div>
          <div className="text-center">
            <span className="block text-neon-red text-xl font-bold">Omega</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-tighter font-mono">Nivel de Alerta</span>
          </div>
        </div>
      </div>

      {/* Elemento decorativo flotante */}
      <div className="mt-8 flex items-center gap-2 text-[10px] text-terminal-border font-mono uppercase tracking-[0.2em] animate-pulse">
        <span>Escaneando credenciales biométricas</span>
        <span className="inline-block w-8 h-[1px] bg-terminal-border" />
        <span className="text-neon-cyan font-bold">[ READY ]</span>
      </div>
    </div>
  );
}
