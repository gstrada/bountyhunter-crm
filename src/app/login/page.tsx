import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string; error: string }>
}) {
  const params = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6">
      <div className="max-w-md w-full space-y-8 bg-terminal-gray p-8 border border-terminal-border relative">
        {/* Decoración Táctica */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-neon-cyan" />

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tighter text-white uppercase font-mono">
            Verificación de <span className="text-neon-cyan">Identidad</span>
          </h2>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
            Protocolo de Acceso Seguro // Guild_Auth
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-gray-400 font-mono mb-1">
                Identificador de Transmisión (Email)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-black border border-terminal-border p-3 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                placeholder="hunter@guild.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[10px] uppercase tracking-widest text-gray-400 font-mono mb-1">
                Código de Encriptación (Password)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-black border border-terminal-border p-3 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {params?.error && (
            <div className="p-3 border border-neon-red/50 bg-neon-red/10 text-neon-red text-[10px] uppercase font-mono text-center animate-pulse">
              [ ERROR ]: {params.error}
            </div>
          )}

          {params?.message && (
            <div className="p-3 border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan text-[10px] uppercase font-mono text-center">
              [ INFO ]: {params.message}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              formAction={login}
              className="w-full py-3 bg-neon-cyan text-terminal-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
            >
              Validar Acceso
            </button>
            <button
              formAction={signup}
              className="w-full py-3 border border-terminal-border text-gray-400 font-mono uppercase tracking-widest text-[10px] hover:text-white hover:border-white transition-colors"
            >
              Registrar Nuevo Hunter
            </button>
          </div>
        </form>

        <div className="text-center pt-4">
          <p className="text-[10px] text-gray-600 font-mono uppercase tracking-tighter">
            * El acceso no autorizado será rastreado por cazadores de nivel S.
          </p>
        </div>
      </div>
    </div>
  )
}
