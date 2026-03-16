"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* GLOBAL CONFIGURATION IMPORTS */
import { ESTRUTURAS, LEVEL_SYSTEM, ICONS } from "@/constants/gameConfig";

export default function ValentesClientView({ initialValentes }: { initialValentes: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const getTheme = (valenteStructure: string) => {
    const structureEntry = Object.values(ESTRUTURAS).find(
      (s) => s.label.toLowerCase() === valenteStructure.toLowerCase()
    );
    const activeStructure = structureEntry || ESTRUTURAS.GAD;
    return {
      color: activeStructure.color,
      label: activeStructure.label
    };
  };

  const filteredValentes = initialValentes.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.structure.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen px-4 py-6 max-w-7xl mx-auto flex flex-col text-white pb-20 font-barlow">
      
      <header className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-8">
        <div>
          <h1 className="hud-title-lg text-6xl text-white m-0 flex items-center gap-5 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <img src={ICONS.valentes} alt="" className="w-20 h-20 object-contain" />
            QUARTEL
          </h1>
          <p className="hud-label-tactical text-brand mt-2 italic-none text-[11px] tracking-[0.3em]">
            MONITORAMENTO DE HERÓIS E PATENTES
          </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-5 items-center">
          <div className="relative w-full sm:w-80 group">
            <input 
              type="text"
              placeholder="LOCALIZAR VALENTE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-surface border border-mission/30 rounded-full px-5 py-2 text-[15px] font-bebas text-white outline-none focus:border-mission/50 transition-all tracking-[0.2em] pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <img src={ICONS.search} alt="Search" className="w-12 h-12 object-contain grayscale brightness-200" />
            </div>
          </div> 

          <Link 
            href="/admin/valentes/create"
            className="bg-brand text-white hover:brightness-125 hud-title-md text-2xl px-10 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(17,194,199,0.4)] flex items-center leading-none"
          >
            + RECRUTAR
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredValentes.map((valente) => {
          const lvlInfo = [...LEVEL_SYSTEM].reverse().find(l => valente.totalXP >= l.minXP) || LEVEL_SYSTEM[0];
          const nextLvl = LEVEL_SYSTEM[LEVEL_SYSTEM.indexOf(lvlInfo) + 1];
          const theme = getTheme(valente.structure);
          const targetXP = nextLvl ? nextLvl.minXP : valente.totalXP;
          const xpPercent = nextLvl ? Math.min((valente.totalXP / targetXP) * 100, 100) : 100;

          return (
            <Link 
              key={valente.id} 
              href={`/admin/valentes/${valente.id}`}
              className="group relative bg-dark-surface-80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 shadow-2xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-dark-bg border-b border-white/5">
                <img 
                  src={valente.image || '/images/man-silhouette.svg'} 
                  alt={valente.name} 
                  className="w-full h-full transition-transform duration-700 group-hover:scale-110 object-cover object-top" 
                />
                
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2 pointer-events-none">
                  <div className="flex flex-col items-start gap-2">
                    <div 
                      className="px-3 h-8 flex items-center justify-center rounded-full backdrop-blur-2xl shadow-lg transition-all w-fit min-w-[60px]"
                      style={{ backgroundColor: `${theme.color}CC`, boxShadow: `0 0 15px ${theme.color}66` }}
                    >
                      <span className="hud-label-tactical text-white text-[9px] font-bold tracking-widest leading-none">
                        {theme.label}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault(); 
                        router.push(`/admin/valentes/${valente.id}/edit`);
                      }}
                      className="px-3 h-8 flex items-center justify-center gap-2 rounded-full backdrop-blur-md transition-all bg-black/60 border border-brand/30 hover:bg-brand hover:border-brand text-brand hover:text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 pointer-events-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                      <span className="hud-label-tactical text-[9px] font-bold uppercase tracking-widest">EDITAR</span>
                    </button>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="px-3 h-8 flex items-center justify-center gap-2 rounded-full backdrop-blur-md transition-all bg-black/40 border border-white/10">
                      <img src={lvlInfo.icon} alt="" className="w-6 h-6 object-contain" />
                      <span className="hud-label-tactical text-white text-[15px] font-bold uppercase opacity-90">
                        {lvlInfo.name.split(' ').pop()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-transparent to-black/40">
                {/* NAME & GUILDA ROW */}
                <div className="flex justify-between items-center mb-1 gap-2">
                  <h3 className="hud-title-md text-3xl text-white truncate group-hover:text-brand transition-colors duration-300 leading-tight uppercase max-w-[60%]">
                    {valente.name}
                  </h3>

                  {/* ENHANCED GUILDA IDENTITY BADGE WITH HOVER GLOW */}
                  {valente.managedBy?.guildaName && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-mission/25 to-mission/5 border border-mission/40 backdrop-blur-md shadow-[0_0_10px_rgba(16,185,129,0.1)] w-fit shrink-0 transition-all duration-500 group-hover:border-mission/60 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-[1.02]">
                      <span className="hud-label-tactical text-[10px] text-mission uppercase tracking-[0.15em] font-bold whitespace-nowrap">
                        {valente.managedBy.guildaName}
                      </span>
                      {valente.managedBy.guildaIcon && (
                        <img 
                          src={valente.managedBy.guildaIcon} 
                          alt="" 
                          className="w-6 h-6 object-contain brightness-110 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] transition-all duration-500 group-hover:brightness-150 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" 
                        />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-end mt-4 mb-3">
                  <span className="hud-label-tactical text-[9px] text-gray-500 uppercase tracking-widest">HONRA & XP</span>
                  <span className="hud-value text-2xl text-white leading-none">
                    {valente.totalXP} <span className="text-[10px] text-gray-600 hud-label-tactical">/ {nextLvl ? nextLvl.minXP : 'MAX'}</span>
                  </span>
                </div>

                <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/5 relative">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                        width: `${xpPercent}%`, 
                        backgroundColor: theme.color,
                        boxShadow: `0 0 20px ${theme.color}CC, 0 0 5px ${theme.color}` 
                    }}
                  />
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex justify-center">
                   <span className="hud-label-tactical text-brand opacity-80 group-hover:opacity-100 transition-opacity text-[10px] font-bold uppercase tracking-widest">
                     ABRIR FICHA DE COMBATE →
                   </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}