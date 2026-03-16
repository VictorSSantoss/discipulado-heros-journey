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
  /* Extraction of search parameters to handle return navigation logic */
  const params = await searchParams;
  const returnUrl = params.from || '/admin/valentes';

  /**
   * Data retrieval for all players sorted by total experience points.
   * Includes relation to the managing user to access guilda naming and iconography.
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

  /* Extraction of count for distinct guildas with experience contributions */
  const totalGuildas = Object.keys(guildTotals).filter(g => g !== "Sem Guilda").length;
  
  /* Determination of the guilda name with the highest cumulative experience points */
  const topGuildaName = Object.entries(guildTotals)
    .filter(([name]) => name !== "Sem Guilda")
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "Nenhuma";

  /**
   * Identification of the iconography associated with the leading guilda.
   * Searches the ranked dataset for the first instance of the top-ranked guilda name.
   */
  const topGuildaIcon = rankedValentes.find(v => v.managedBy?.guildaName === topGuildaName)?.managedBy?.guildaIcon;

  /**
   * Retrieval of current user context for the guilda filter logic.
   */
  const currentUser = await prisma.valente.findFirst({
    where: { name: "Cadu" }, 
    select: { managedBy: { select: { guildaName: true, guildaIcon: true } } }
  });

  return (
    <main className="min-h-screen bg-[#08090a] text-white font-barlow relative overflow-y-auto custom-scrollbar">
      {/* Global styles for holographic animations and custom scrollbar behavior */}
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
        {/* Navigation control for returning to the previous administrative context */}
        <div className="absolute top-8 left-6 md:left-12 z-50">
          <Link href={returnUrl} className="hud-label-tactical flex items-center gap-3 text-gray-500 hover:text-white transition-all bg-white/5 px-5 py-2 rounded-full border border-white/10">
            <span className="text-lg">←</span>
            <span>VOLTAR AO QUARTEL</span>
          </Link>
        </div>

        {/* Page header using the standardized high-prestige typography system */}
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

        {/* Global statistics module displaying cumulative experience and leadership data */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex items-center gap-12 shadow-2xl relative overflow-hidden group">
            {/* Top decorative accent with brand color gradient */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-30" />
            
            {/* Display for total accumulated experience points across the realm */}
            <div className="flex flex-col gap-1">
               <span className="hud-label-tactical text-[9px] text-gray-500 uppercase tracking-widest font-black">Esforço Global</span>
               <div className="flex items-baseline gap-2">
                 <span className="hud-value text-3xl text-brand">{totalGlobalXP.toLocaleString('pt-BR')}</span>
                 <span className="hud-label-tactical text-[9px] text-brand/50 font-black">XP</span>
               </div>
            </div>

            {/* Vertical separator for data column organization */}
            <div className="w-px h-10 bg-white/10 self-center" />

            {/* Display for the total number of distinct active guildas */}
            <div className="flex flex-col gap-1">
               <span className="hud-label-tactical text-[9px] text-gray-500 uppercase tracking-widest font-black">Facções Ativas</span>
               <div className="flex items-baseline gap-2">
                 <span className="hud-value text-3xl text-white">{totalGuildas}</span>
                 <span className="hud-label-tactical text-[9px] text-gray-500 font-black uppercase">Guildas</span>
               </div>
            </div>

            {/* Vertical separator for leadership metric isolation */}
            <div className="w-px h-10 bg-white/10 self-center" />

            {/* Section identifying the top-ranked guilda by name and emblem */}
            <div className="flex flex-col gap-1">
               <span className="hud-label-tactical text-[9px] text-gray-500 uppercase tracking-widest font-black">Top Ranking</span>
               <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-brand/10 border border-brand/20 shadow-[0_0_10px_rgba(17,194,199,0.15)]">
                  <div className="flex flex-col items-start leading-none">
                     <span className="hud-label-tactical text-[9px] text-white/50 uppercase font-black tracking-tighter">Ranking #1</span>
                     <span className="hud-label-tactical text-[12px] text-brand font-black uppercase tracking-widest mt-0.5">
                        {topGuildaName}
                     </span>
                  </div>
                  {/* Floating insignia container using the calculated topGuildaIcon variable */}
                  <div className="w-9 h-9 flex items-center justify-center">
                    <img 
                      src={topGuildaIcon || "/images/ranking-icon.svg"} 
                      alt="" 
                      className="w-full h-full object-contain brightness-110 drop-shadow-[0_0_5px_rgba(17,194,199,0.5)]" 
                    />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Client-side view component for ranking interaction and detailed list rendering */}
        <TavernaClientView 
          rankedValentes={rankedValentes} 
          userGuildaName={currentUser?.managedBy?.guildaName ?? undefined}
          userGuildaIcon={currentUser?.managedBy?.guildaIcon ?? undefined}
        />
      </div>
    </main>
  );
}