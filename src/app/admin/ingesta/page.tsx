import { verifyAdmin } from "@/utils/auth-guards";
import IngestaForm from "./IngestaForm";

export default async function IngestaPage() {
  // Ejecutar el guard en el servidor. 
  // Si no es admin, verifyAdmin lanzará una redirección nativa de Next.js.
  await verifyAdmin();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="space-y-2 border-b border-terminal-border pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tighter uppercase font-mono">
          Terminal de <span className="text-neon-cyan">Ingesta IA</span>
        </h1>
        <p className="text-xs text-gray-500 font-mono uppercase">
          Procesamiento de transmisiones civiles no estructuradas
        </p>
      </header>

      <IngestaForm />
    </div>
  );
}
