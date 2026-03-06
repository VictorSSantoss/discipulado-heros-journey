"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* GLOBAL CONFIGURATION IMPORTS */
import { ESTRUTURAS, LEVEL_SYSTEM, ICONS } from "@/constants/gameConfig";

/**
 * ValentesClientView Component
 * Receives live database data and renders the tactical HUD.
 */
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

  // Filtering the live database data
  const filteredValentes = initialValentes.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.structure.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen px-4 py-6 max-w-7xl mx-auto flex flex-col text-white pb-20 font-barlow">
      
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
          <div className="relative w-full sm:w-80 group">
            <input 
              type="text"
              placeholder="LOCALIZAR VALENTE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-surface border border-mission/30 rounded-full px-5 py-2 text-[15px] font-bebas text-white outline-none focus:border-mission/50 transition-all tracking-[0.2em] pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <img 
                src={ICONS.search}
                alt="Search" 
                className="w-12 h-12 object-contain opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all grayscale brightness-200"
              />
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
                {/* PORTRAIT RENDERER */}
                <img 
                  src={valente.image || '/images/man-silhouette.svg'} 
                  alt={valente.name} 
                  onError={(e) => { 
                    e.currentTarget.onerror = null; 
                    e.currentTarget.src = '/images/man-silhouette.svg'; 
                  }}
                  // Changed: Removed p-4, switched to object-cover and object-top for better face framing
                  className={`w-full h-full transition-transform duration-700 group-hover:scale-110 
                    ${valente.image ? 'object-cover object-top' : 'object-contain p-8 opacity-40'}`} 
                />

                {/* GRADIENT OVERLAY: Makes the name easier to read and adds depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent opacity-60" />
                
                {/* HUD BADGES OVERLAY */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2 pointer-events-none">
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

                  <div className="flex flex-col items-end gap-2 pointer-events-auto">
                    {/* LEVEL BADGE */}
                    <div 
                      className="px-3 h-8 flex items-center justify-center gap-2 rounded-full backdrop-blur-md transition-all bg-black/40 border border-white/10"
                    >
                      <img 
                        src={lvlInfo.icon} 
                        alt="" 
                        className="w-4 h-4 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
                      />
                      <span className="hud-label-tactical text-white text-[10px] font-bold italic-none leading-none opacity-90 uppercase">
                        {lvlInfo.name.split(' ').pop()}
                      </span>
                    </div>

                    {/* QUICK EDIT SHORTCUT */}
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevents the Link from triggering
                        router.push(`/admin/valentes/${valente.id}/edit`);
                      }}
                      className="px-3 h-8 flex items-center justify-center gap-2 rounded-full backdrop-blur-md transition-all bg-black/60 border border-brand/30 hover:bg-brand hover:border-brand text-brand hover:text-white opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0"
                      title="Calibrar Ficha"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                      <span className="hud-label-tactical text-[9px] font-bold italic-none leading-none uppercase tracking-widest">
                        EDITAR
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-transparent to-black/40">
                <h3 className="hud-title-md text-3xl text-white mb-1 truncate group-hover:text-brand transition-colors leading-tight uppercase">
                  {valente.name}
                </h3>
                
                <div className="flex justify-between items-end mt-4 mb-3">
                  <span className="hud-label-tactical text-[9px] text-gray-500 uppercase tracking-widest">HONRA & XP</span>
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