import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BountyHunter CRM | Galactic Guild",
  description: "Sistema de gestión táctica para el Gremio de Caza-Recompensas Galácticos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-terminal-black flex text-foreground`}
      >
        {/* @ts-expect-error Server Component */}
        <Sidebar />

        <div className="flex-1 relative flex flex-col min-h-screen border-t-2 border-neon-green ml-0 overflow-y-auto">
          {/* Grid de fondo sutil */}
          <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          
          <main className="flex-1 relative z-10">
            {children}
          </main>
          
          <footer className="border-t border-terminal-border py-4 px-6 text-[10px] uppercase tracking-widest text-gray-600 flex justify-between items-center bg-terminal-black/80 backdrop-blur-md relative z-10">
            <span>&copy; 2026 Galactic Bounty Hunter Guild - Sector 7</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-neon-green animate-pulse" />
                Sistemas Online
              </span>
              <span>Encripción: Nivel 5</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
