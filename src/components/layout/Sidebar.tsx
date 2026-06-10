import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Sidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, creditos_galacticos')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'Administrador_Gremio';
  const credits = profile?.creditos_galacticos || 0;

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Mis Contratos', href: '/dashboard/mis-contratos', icon: '📜' },
  ];

  if (isAdmin) {
    menuItems.push({ name: 'Ingesta IA', href: '/admin/ingesta', icon: '🤖' });
  }

  return (
    <aside className="w-64 border-r border-terminal-border bg-terminal-black flex flex-col h-full sticky top-0">
      <div className="p-6 border-b border-terminal-border">
        <span className="text-xl font-bold tracking-tighter text-white uppercase">
          Bounty<span className="text-neon-green">Net</span>
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-mono text-gray-500 hover:text-neon-cyan hover:bg-terminal-gray/30 transition-all border border-transparent hover:border-neon-cyan/30"
          >
            <span>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-terminal-border bg-terminal-gray/10 space-y-3">
        {/* Contador de Créditos */}
        <div className="px-2 py-2 border border-neon-amber/20 bg-neon-amber/5 rounded-sm">
          <span className="block text-[8px] text-gray-500 uppercase font-mono tracking-tighter">Créditos Galácticos</span>
          <span className="text-sm font-bold text-neon-amber font-mono tracking-tighter">
            {new Intl.NumberFormat('en-US').format(credits)} CR
          </span>
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
          <div className="overflow-hidden">
            <p className="text-[10px] text-gray-400 uppercase font-mono truncate">{user.email}</p>
            <p className="text-[8px] text-neon-cyan uppercase font-mono">{profile?.role || 'Hunter'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
