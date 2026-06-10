'use client'

import { useState } from "react";
import { processBountyText } from "../actions";

export default function IngestaForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setResult(null);

    const res = await processBountyText(formData);

    if (res?.error) {
      setError(res.error);
    } else {
      setResult(res?.data);
    }
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Formulario de Entrada */}
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-mono text-neon-cyan tracking-widest">
            Mensaje Raw del Cliente
          </label>
          <textarea
            name="rawText"
            required
            rows={10}
            className="w-full bg-black border border-terminal-border p-4 text-white font-mono text-sm focus:border-neon-cyan outline-none transition-all"
            placeholder="Ej: Necesito que alguien elimine a un contrabandista en Tatooine. Ofrezco 5000 créditos. Es muy peligroso..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 font-bold uppercase tracking-widest text-xs transition-all ${
            loading 
              ? "bg-terminal-gray text-gray-500 cursor-not-allowed" 
              : "bg-neon-cyan text-terminal-black hover:bg-white"
          }`}
        >
          {loading ? "Procesando Transmisión..." : "Analizar y Publicar Contrato"}
        </button>

        {error && (
          <div className="p-4 border border-neon-red/50 bg-neon-red/10 text-neon-red text-[10px] font-mono uppercase">
            [ ERROR ]: {error}
          </div>
        )}
      </form>

      {/* Vista Previa del Resultado */}
      <div className="border border-terminal-border bg-terminal-gray/10 p-6 relative min-h-[300px]">
        <div className="absolute top-2 right-2 text-[8px] text-gray-700 font-mono uppercase">Preview_Output</div>
        
        {!result && !loading && (
          <div className="h-full flex items-center justify-center text-gray-600 font-mono text-[10px] uppercase text-center italic">
            Esperando análisis de datos...
          </div>
        )}

        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-terminal-border w-3/4" />
            <div className="h-4 bg-terminal-border w-1/2" />
            <div className="h-20 bg-terminal-border w-full" />
          </div>
        )}

        {result && (
          <div className="space-y-4 font-mono animate-in fade-in duration-500">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 uppercase">Título Generado:</span>
              <p className="text-neon-green text-sm font-bold uppercase">{result.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase">Planeta:</span>
                <p className="text-white text-sm">{result.planeta_name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase">Recompensa:</span>
                <p className="text-neon-amber text-sm font-bold">{result.reward} CR</p>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 uppercase">Nivel de Peligro:</span>
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 w-4 ${i < result.danger_level ? 'bg-neon-red' : 'bg-terminal-border'}`} 
                  />
                ))}
              </div>
            </div>
            <div className="p-3 border-t border-terminal-border mt-4">
              <p className="text-[10px] text-gray-400 leading-relaxed italic">
                &quot;{result.description}&quot;
              </p>
            </div>
            <div className="pt-2 text-center text-neon-green text-[10px] font-bold uppercase tracking-tighter">
              ✓ Contrato inyectado en el Database con éxito
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
