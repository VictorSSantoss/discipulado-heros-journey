"use client";

import { ATTRIBUTE_MAP } from "@/constants/gameConfig";

interface MissionDisplayCardProps {
  mission: any;
  isTracked: boolean;
  onTogglePin: (id: string) => void;
  onComplete: (id: string) => void;
  isProcessing: boolean;
  isAdmin?: boolean; // ⚔️ Added Admin Gate
}

export default function MissionDisplayCard({ 
  mission, 
  isTracked, 
  onTogglePin, 
  onComplete, 
  isProcessing,
  isAdmin = true // Defaulting to true as per request
}: MissionDisplayCardProps) {
  const periodicity = (mission.periodicity || "NONE").toUpperCase();
  const isSpecial = ["DAILY", "WEEKLY", "MONTHLY", "EVENT"].includes(periodicity);
  
  const getBadgeLabel = () => {
    if (periodicity === "DAILY") return "DIÁRIO";
    if (periodicity === "WEEKLY") return "SEMANAL";
    if (periodicity === "MONTHLY") return "MENSAL";
    if (periodicity === "EVENT") return "EVENTO";
    return mission.type;
  };

  return (
    <div className={`bg-dark-bg/40 border p-6 rounded-2xl flex flex-col hover:border-white/20 transition-all group relative overflow-visible h-full ${
      isTracked ? 'border-brand/40 shadow-[0_0_20px_rgba(17,194,199,0.1)]' : isSpecial ? 'border-amber-500/30' : 'border-white/5'
    }`}>
      {/* Background clipping container for the top line */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${isTracked ? 'via-brand/40' : isSpecial ? 'via-amber-500/40' : 'via-white/10'} to-transparent`}></div>
      </div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className={`hud-label-tactical px-2.5 py-1 rounded-md text-[8px] uppercase tracking-widest font-black border ${
          isSpecial ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-white/5 text-gray-500 border-white/10'
        }`}>
          {getBadgeLabel()}
        </span>
        
        {/* Always visible pin button with glow effect */}
        <button 
          type="button"
          onClick={() => onTogglePin(mission.id)}
          className={`hud-label-tactical text-[10px] transition-all flex items-center gap-1.5 font-black drop-shadow-[0_0_8px_rgba(17,194,199,0.4)] ${
            isTracked ? 'text-brand opacity-100 scale-105' : 'text-white/40 hover:text-white/90'
          }`}
        >
          {isTracked ? '★ FIXADO' : '☆ FIXAR'}
        </button>
      </div>

      <h4 className="hud-title-md text-white text-xl mb-1 uppercase tracking-wider relative z-10">{mission.title}</h4>
      <p className="font-barlow text-gray-500 text-[11px] mb-6 flex-1 line-clamp-2 uppercase tracking-tighter leading-tight relative z-10">
        {mission.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 relative z-10">
        <div className="flex flex-col">
           <span className={`hud-value text-2xl leading-none ${isSpecial ? 'text-amber-400' : 'text-mission'}`}>+{mission.xpReward} XP</span>
           {mission.rewardAttribute && (
             <span className="text-[10px] text-brand/60 font-bold uppercase mt-1">
               +{mission.rewardAttrValue} {ATTRIBUTE_MAP[mission.rewardAttribute] || mission.rewardAttribute}
             </span>
           )}
        </div>

        {/* GATED: Conclusion only for Admins */}
        {isAdmin && (
          <button 
            type="button"
            onClick={() => onComplete(mission.id)} 
            disabled={isProcessing}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white hud-label-tactical px-4 py-2 rounded-lg text-[9px] uppercase tracking-widest transition-all disabled:opacity-30 shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-brand/5"
          >
            {isProcessing ? "..." : "CONCLUIR"}
          </button>
        )}
      </div>
    </div>
  );
}