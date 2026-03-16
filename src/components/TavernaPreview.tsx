"use client";

import Link from "next/link"; 
import { ESTRUTURAS } from "@/constants/gameConfig";

export default function TavernaPreview({ ranking = [] }: { ranking?: any[] }) {
  // Renders a loading state if the ranking data array is empty or undefined
  if (!ranking || ranking.length === 0) {
    return (
      <div className="p-8 text-center hud-label-tactical opacity-30 animate-pulse">
        SINCROZINANDO DADOS...
      </div>
    );
  }

  // Determines the visual icon or numeric rank to display based on the player's index in the array
  const getRankDisplay = (index: number) => {
    switch (index) {
      case 0: 
        return <img src="/images/ranking-icon.svg" alt="1º" className="w-6 h-6 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] animate-bounce-slow" />;
      case 1: 
        return <img src="/images/ranking-icon.svg" alt="2º" className="w-6 h-6 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" />;
      case 2: 
        return <img src="/images/ranking-icon.svg" alt="3º" className="w-6 h-6 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" />;
      default: 
        return <span className="hud-value text-xs text-gray-500 ml-1">#{index + 1}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 font-barlow relative overflow-hidden">
      {/* HUD ANIMATIONS & SCROLLBAR STYLING */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.05; transform: scale(1); filter: blur(5px); }
          50% { opacity: 0.1; transform: scale(1.01); filter: blur(7px); }
        }
        @keyframes glow-sweep-fast {
          0% { transform: translateX(-150%) skewX(-25deg); }
          100% { transform: translateX(250%) skewX(-25deg); }
        }
        .animate-glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }
        .animate-glow-sweep-fast { animation: glow-sweep-fast 2.5s ease-in-out infinite; }

        /* Custom Scrollbar Styling - Making the slider visible with Mission color */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981; /* mission color hex for full visibility */
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #34d399; /* brighter mission color on hover */
        }
      `}} />

      <div className="flex items-center justify-between mb-4">
        <h3 className="hud-label-tactical text-gray-400 tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
          RANKING GLOBAL
        </h3>
        
        <Link 
          href="/taverna" 
          className="hud-label-tactical text-[9px] text-brand/60 border border-brand/20 px-2 py-1 rounded-md hover:bg-brand/10 hover:text-brand hover:border-brand/40 transition-all uppercase tracking-tighter"
        >
          Ver Taverna →
        </Link>
      </div>

      <div className="space-y-4 pr-1">
        {ranking.map((player, index) => {
          const structureData = Object.values(ESTRUTURAS).find(
            s => s.label === player.structure
          ) || ESTRUTURAS.GAD;

          const isTop3 = index < 3;
          const isChampion = index === 0;

          return (
            <div 
              key={player.id} 
              className={`relative flex items-center justify-between group transition-all duration-300 p-2 rounded-xl 
                ${isChampion ? 'bg-yellow-500/[0.03]' : ''} 
                ${isTop3 && !isChampion ? 'bg-white/[0.02]' : ''}`}
            >
              
              {isChampion && (
                <>
                  <div className="absolute inset-0 opacity-10 blur-lg rounded-xl z-0" style={{ backgroundColor: structureData.color }} />
                  <div className="absolute inset-0 animate-glow-pulse rounded-xl z-0" style={{ backgroundColor: structureData.color }} />
                </>
              )}

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-9 flex justify-center items-center shrink-0">
                  {getRankDisplay(index)}
                </div>

                <div className={`relative w-10 h-10 rounded-full overflow-hidden bg-dark-bg shrink-0 border
                    ${isChampion ? 'border-brand/50' : 'border-white/5'}`}>
                    <img 
                      src={player.image || '/images/man-silhouette.svg'} 
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                      alt=""
                    />
                </div>

                <div className="flex flex-col items-start">
                  {/* GUILDA BADGE WITH SWEEP & INTERACTIVE HOVER */}
                  {player.managedBy?.guildaName && (
                    <div className="relative flex items-center gap-1.5 px-2.5 py-1 mb-1 rounded-md bg-gradient-to-r from-mission/25 to-mission/5 border border-mission/40 backdrop-blur-sm shadow-[0_0_10px_rgba(16,185,129,0.1)] w-fit overflow-hidden transition-all duration-500 group-hover:border-mission/60 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-[1.02]">
                      
                      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-glow-sweep-fast" />
                      </div>

                      <span className="hud-label-tactical text-[9px] text-mission uppercase tracking-widest font-bold relative z-10">
                        {player.managedBy.guildaName}
                      </span>
                      {player.managedBy.guildaIcon && (
                        <img 
                          src={player.managedBy.guildaIcon} 
                          alt="" 
                          className="w-4 h-4 object-contain brightness-110 relative z-10 transition-all duration-500 group-hover:brightness-125" 
                        />
                      )}
                    </div>
                  )}

                  {/* Name section with Crown for Champion */}
                  <div className="flex items-center gap-2">
                    <span className={`hud-value text-sm transition-colors 
                      ${isChampion ? 'text-brand' : isTop3 ? 'text-white' : 'text-gray-400'}`}>
                      {player.name}
                    </span>
                    
                    {isChampion && (
                      <img 
                        src="/images/crown-icon.svg"
                        alt="Champion" 
                        className="w-4 h-4 object-contain drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="hud-label-tactical text-[9px] uppercase tracking-tighter" style={{ color: structureData.color }}>
                      {player.structure}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right relative z-10">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5">
                    <span className={`hud-value text-sm transition-all duration-500
                      ${isChampion ? 'text-brand drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-white'}
                    `}>
                      {player.totalXP.toLocaleString('pt-BR')}
                    </span>
                    
                    {/* VERIFIED BATTLE LOG ICON */}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      className={`w-3 h-3 ${isChampion ? 'text-brand' : 'text-gray-600'} opacity-40 group-hover:opacity-80 transition-opacity`}
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span className="hud-label-tactical text-[8px] text-gray-600 uppercase tracking-widest">XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}