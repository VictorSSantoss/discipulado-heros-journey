import prisma from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";
import TavernaClientView from "./TavernaClientView";

/**
 * Main server component responsible for retrieving ranking data and calculating global statistics.
 */
export default async function TavernaPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ from?: string }> 
}) {
  const params = await searchParams;
  const returnUrl = params.from || '/admin/valentes';

  /**
   * Data retrieval for all players sorted by total experience points.
   */
  const rankedValentes = await prisma.valente.findMany({
    orderBy: { totalXP: 'desc' },
    include: { managedBy: { select: { guildaName: true, guildaIcon: true } } }
  });

  /**
   * Calculation of global experience across the entire player base.
   */
  const totalGlobalXP = rankedValentes.reduce((acc, v) => acc + v.totalXP, 0);
  
  /**
   * Grouping of experience totals per guilda to identify the current leader.
   */
  const guildTotals = rankedValentes.reduce((acc: Record<string, number>, v) => {
    const gName = v.managedBy?.guildaName || "Sem Guilda";
    acc[gName] = (acc[gName] || 0) + v.totalXP;
    return acc;
  }, {});

  const totalGuildas = Object.keys(guildTotals).filter(g => g !== "Sem Guilda").length;
  const topGuildaName = Object.entries(guildTotals)
    .filter(([name]) => name !== "Sem Guilda")
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "Nenhuma";

  /**
   * Retrieval of current user context for the guilda filter logic.
   */
  const currentUser = await prisma.valente.findFirst({
    where: { name: "Cadu" }, 
    select: { managedBy: { select: { guildaName: true, guildaIcon: true } } }
  });

  return (
    <main className="min-h-screen bg-[#08090a] text-white font-barlow relative overflow-y-auto custom-scrollbar">
      {/* Configuration for animations and optimized blur rendering */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glow-sweep-slow {
          0% { transform: translateX(-150%) skewX(-25deg); }
          100% { transform: translateX(250%) skewX(-25deg); }
        }
        .animate-glow-sweep-slow { animation: glow-sweep-slow 4s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
        
        .gpu-blur { 
          backface-visibility: hidden;
          perspective: 1000;
          transform: translateZ(0);
        }
      `}} />
      
      <div className="p-6 md:p-12 max-w-7xl mx-auto relative z-10">
        <div className="absolute top-8 left-6 md:left-12 z-50">
          <Link href={returnUrl} className="hud-label-tactical flex items-center gap-3 text-gray-500 hover:text-white transition-all bg-white/5 px-5 py-2 rounded-full border border-white/10">
            <span className="text-lg">←</span>
            <span>VOLTAR AO QUARTEL</span>
          </Link>
        </div>

        {/* Centralized header with high-contrast typography */}
        <header className="flex flex-col items-center text-center mb-10 pt-12">
          <h1 className="hud-title-lg text-7xl text-white m-0 tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] uppercase">
            A TAVERNA
          </h1>
          <div className="flex items-center justify-center gap-4 mt-6 opacity-60">
            <div className="h-px w-12 bg-mission"></div>
            <p className="hud-label-tactical text-mission tracking-[0.5em] text-[12px] uppercase font-black">
              Mural de Glória e Honra
            </p>
            <div className="h-px w-12 bg-mission"></div>
          </div>
        </header>

        {/* Tactical statistics dashboard with specific separation for leadership metrics */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex items-center gap-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-30" />
            
            <div className="flex flex-col gap-1">
               <span className="hud-label-tactical text-[9px] text-gray-500 uppercase tracking-widest font-black">Esforço Global</span>
               <div className="flex items-baseline gap-2">
                 <span className="hud-value text-3xl text-brand">{totalGlobalXP.toLocaleString('pt-BR')}</span>
                 <span className="hud-label-tactical text-[9px] text-brand/50 font-black">XP</span>
               </div>
            </div>

            <div className="w-px h-10 bg-white/10 self-center" />

            <div className="flex flex-col gap-1">
               <span className="hud-label-tactical text-[9px] text-gray-500 uppercase tracking-widest font-black">Facções Ativas</span>
               <div className="flex items-baseline gap-2">
                 <span className="hud-value text-3xl text-white">{totalGuildas}</span>
                 <span className="hud-label-tactical text-[9px] text-gray-500 font-black uppercase">Guildas</span>
               </div>
            </div>

            {/* Vertical separator between global stats and faction leadership */}
            <div className="w-px h-10 bg-white/10 self-center" />

            <div className="flex flex-col gap-1">
               <span className="hud-label-tactical text-[9px] text-gray-500 uppercase tracking-widest font-black">Liderança do Discipulado</span>
               <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-brand/10 border border-brand/20 shadow-[0_0_10px_rgba(17,194,199,0.15)]">
                  <div className="flex flex-col items-start leading-none">
                     <span className="hud-label-tactical text-[7px] text-white/50 uppercase font-black tracking-tighter">Ranking #1</span>
                     <span className="hud-label-tactical text-[10px] text-brand font-black uppercase tracking-widest mt-0.5">
                        {topGuildaName}
                     </span>
                  </div>
                  <span className="text-base leading-none">👑</span>
               </div>
            </div>
          </div>
        </div>

        <TavernaClientView 
          rankedValentes={rankedValentes} 
          userGuildaName={currentUser?.managedBy?.guildaName ?? undefined}
          userGuildaIcon={currentUser?.managedBy?.guildaIcon ?? undefined}
        />
      </div>
    </main>
  );
}