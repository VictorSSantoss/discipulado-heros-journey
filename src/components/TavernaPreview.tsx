"use client";

import { ESTRUTURAS } from "@/constants/gameConfig";

export default function TavernaPreview({ ranking = [] }: { ranking?: any[] }) {
  if (!ranking || ranking.length === 0) {
    return (
      <div className="p-8 text-center hud-label-tactical opacity-30 animate-pulse">
        SINCROZINANDO DADOS...
      </div>
    );
  }

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
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.05; transform: scale(1); filter: blur(5px); }
          50% { opacity: 0.1; transform: scale(1.01); filter: blur(7px); }
        }
        .animate-glow-pulse {
          animation: glow-pulse 4s ease-in-out infinite;
        }
      `}} />

      <div className="flex items-center justify-between mb-4">
        <h3 className="hud-label-tactical text-gray-400 tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
          RANKING GLOBAL
        </h3>
        <span className="hud-label-tactical text-[10px] opacity-30">TOP 5 VALENTES</span>
      </div>

      <div className="space-y-4">
        {ranking.map((player, index) => {
          const structureData = Object.values(ESTRUTURAS).find(
            s => s.label === player.structure
          ) || ESTRUTURAS.GAD;

          const isTop3 = index < 3;
          const isChampion = index === 0;
          const isRunnerUp = index === 1 || index === 2;

          return (
            <div 
              key={player.id} 
              className={`relative flex items-center justify-between group transition-all duration-300 p-2 rounded-xl 
                ${isChampion ? 'bg-yellow-500/[0.03]' : ''} 
                ${isTop3 && !isChampion ? 'bg-white/[0.02]' : ''}`}
            >
              
              {/* Champion Pulsing Glow Layer */}
              {isChampion && (
                <>
                  {/* Base Glow */}
                  <div 
                    className="absolute inset-0 opacity-10 blur-lg rounded-xl z-0"
                    style={{ backgroundColor: structureData.color }}
                  />
                  {/* Pulsing Energy Layer */}
                  <div 
                    className="absolute inset-0 animate-glow-pulse rounded-xl z-0"
                    style={{ backgroundColor: structureData.color }}
                  />
                </>
              )}

              {isTop3 && !isChampion && (
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity blur-xl rounded-xl z-0"
                  style={{ backgroundColor: structureData.color }}
                />
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

                <div className="flex flex-col">
                  <span className={`hud-value text-sm transition-colors 
                    ${isChampion ? 'text-brand drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]' : isTop3 ? 'text-white' : 'text-gray-400'}`}>
                    {player.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="hud-label-tactical text-[9px] uppercase tracking-tighter" 
                      style={{ color: structureData.color }}
                    >
                      {player.structure}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right relative z-10">
              <div className="flex flex-col">
                <span className={`hud-value text-sm transition-all duration-500
                  ${isChampion ? 'text-brand drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-white'}
                  ${index === 1 ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]' : ''}
                  ${index === 2 ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' : ''}
                `}>
                  {player.totalXP.toLocaleString('pt-BR')}
                </span>
                <span className="hud-label-tactical text-[8px] text-gray-600 uppercase">PONTOS XP</span>
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}