"use client";

import { useState } from "react";
import Link from "next/link";
import { mockValentes } from "@/lib/mockData";

/* GLOBAL CONFIGURATION IMPORTS */
import { ESTRUTURAS, LEVEL_SYSTEM, ICONS } from "@/constants/gameConfig";

/**
 * ValentesList Component
 * Optimized with a side-by-side tactical header for Faction and Rank.
 */
export default function ValentesList() {
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

  const filteredValentes = mockValentes.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.structure.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen px-4 py-6 max-w-7xl mx-auto flex flex-col text-white pb-20 font-barlow bg-[#050505]">
      
      <header className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-8">
        <div>
          <h1 className="hud-title-lg text-6xl text-white m-0 flex items-center gap-5 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <img 
              src={ICONS.valentes} 
              alt="" 
              className="w-16 h-16 object-contain" 
            />
            QUARTEL
          </h1>
          <p className="hud-label-tactical text-brand mt-2 italic-none text-[11px] tracking-[0.3em]">
            MONITORAMENTO DE HERÓIS E PATENTES
          </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-5 items-center">
          <div className="relative flex-1 md:w-80">
            <input 
              type="text" 
              placeholder="LOCALIZAR VALENTE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-xl text-white hud-label-tactical text-sm transition-all placeholder:text-gray-500 shadow-inner outline-none focus:border-brand italic-none"
            />
          </div>

          <Link 
            href="/admin/valentes/novo"
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
              <div className="relative aspect-[4/5] overflow-hidden bg-dark-bg border-b border-white/5 flex items-center justify-center">
                
                <img 
                  src={valente.image || '/images/man-silhouette.svg'} 
                  alt="" 
                  onError={(e) => { 
                    e.currentTarget.onerror = null; 
                    e.currentTarget.src = '/images/man-silhouette.svg'; 
                  }}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 opacity-100" 
                />
                
                {/* TACTICAL_HEADER_WRAPPER: Positions Estrutura and Level side-by-side at the top */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2">
                  
                  {/* ESTRUTURA_BADGE: Vivid, borderless pill */}
                  <div 
                    className="px-3 h-8 flex items-center justify-center rounded-full backdrop-blur-2xl shadow-lg transition-all w-fit min-w-[60px]"
                    style={{ 
                      backgroundColor: `${theme.color}CC`,
                      boxShadow: `0 0 15px ${theme.color}66` 
                    }}
                  >
                     <span className="hud-label-tactical text-white text-[9px] font-bold italic-none tracking-widest leading-none whitespace-nowrap">
                       {theme.label}
                     </span>
                  </div>

                  {/* LEVEL_CONTAINER: Horizontal, ultra-transparent Mission glass */}
                  <div 
                    className="px-3 h-8 flex items-center justify-center gap-2 rounded-full backdrop-blur-md transition-all group-hover:bg-mission/10"
                    style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }} 
                  >
                    <img 
                      src={lvlInfo.icon} 
                      alt="" 
                      className="w-4 h-4 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
                    />
                    <span className="hud-label-tactical text-white text-[10px] font-bold italic-none leading-none opacity-90">
                      {lvlInfo.name.split(' ').pop()}
                    </span>
                  </div>

                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-transparent to-black/40">
                <h3 className="hud-title-md text-3xl text-white mb-1 truncate group-hover:text-brand transition-colors leading-tight">
                  {valente.name}
                </h3>
                
                <div className="flex justify-between items-end mt-4 mb-3">
                  <span className="hud-label-tactical text-[9px] text-gray-500">HONRA & XP</span>
                  <span className="hud-value text-2xl text-white leading-none">
                    {valente.totalXP} <span className="text-[10px] text-gray-600 hud-label-tactical italic-none">/ {nextLvl ? nextLvl.minXP : 'MAX'}</span>
                  </span>
                </div>

                <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/5 relative">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 relative"
                    style={{ 
                        width: `${xpPercent}%`, 
                        backgroundColor: theme.color,
                        boxShadow: `0 0 20px ${theme.color}CC, 0 0 5px ${theme.color}` 
                    }}
                  >
                     <div className="absolute inset-0 opacity-50 mix-blend-screen" style={{ backgroundColor: theme.color }}></div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex justify-center">
                   <span className="hud-label-tactical text-brand opacity-80 group-hover:opacity-100 transition-opacity text-[10px] font-bold">
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