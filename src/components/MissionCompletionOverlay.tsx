"use client";

import { motion } from "framer-motion";
import { ICONS } from "@/constants/gameConfig";

interface MissionCompletionOverlayProps {
  mission: {
    title: string;
    xpReward: number;
    rewardAttribute?: string;
    rewardAttrValue?: number;
    rewardAttribute2?: string;
  };
  onComplete: () => void;
}

/**
 * High-fidelity Mission Completion Overlay.
 * Designed to be a "Ritual" that stays visible until the user interacts.
 */
export default function MissionCompletionOverlay({ mission, onComplete }: MissionCompletionOverlayProps) {
  if (!mission) return null;

  const isLvlUp = mission.xpReward === 9999;
  const missionColor = "16, 185, 129"; // Emerald Green RGB

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete} // Clicking anywhere dismisses the ritual
      className="fixed inset-0 z-[600] flex items-center justify-center cursor-pointer overflow-hidden bg-black/98 backdrop-blur-md"
    >
      {/* Background Decorative Element (Large transparent XP icon) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
        <span className="text-[40vw] font-black italic select-none">QUEST</span>
      </div>

      <div className="relative text-center max-w-none px-6 w-[95vw] h-full flex flex-col justify-center items-center z-10">
        
        {/* Top Tactical Line - Reaches edges */}
        <motion.div 
          initial={{ scaleX: 0 }} 
          animate={{ scaleX: 1 }} 
          transition={{ delay: 0.2, duration: 1.2, ease: "circOut" }}
          className="h-px w-full mb-[10vh] opacity-30" 
          style={{ background: `linear-gradient(90deg, transparent, rgba(${missionColor}, 1), transparent)` }}
        />

        {/* Header Label */}
        <motion.div
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-2 mb-[4vh]"
        >
          <span className="text-[10px] sm:text-[12px] tracking-[1em] uppercase font-black" 
                style={{ color: `rgb(${missionColor})`, textShadow: `0 0 20px rgba(${missionColor}, 0.5)` }}>
            Decreto Cumprido
          </span>
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: `rgb(${missionColor})` }} />
        </motion.div>

        {/* Mission Title - Cinematic Typography */}
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-white text-[clamp(2rem,7vh,5rem)] leading-none font-serif italic tracking-tighter mb-[6vh] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] px-4"
        >
          {mission.title}
        </motion.h1>
        
        {/* Rewards Block */}
        <div className="flex flex-col items-center gap-8 mb-[8vh] min-h-[120px]">
          
          {/* XP Display */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.9 }}
            className="flex flex-col items-center"
          >
             <div className="flex items-baseline gap-2">
                <span className="text-white text-6xl sm:text-8xl font-black tracking-tighter drop-shadow-lg">
                  {isLvlUp ? "LEVEL" : `+${mission.xpReward}`}
                </span>
                <span className="text-mission text-2xl sm:text-4xl font-black uppercase tracking-widest">
                  {isLvlUp ? "UP" : "XP"}
                </span>
             </div>
             <span className="hud-label-tactical text-gray-500 tracking-[0.4em] text-[10px] mt-2 uppercase">
               Experiência Adquirida
             </span>
          </motion.div>
        </div>

        {/* Interaction Button */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 1.4 }}
          className="group relative px-14 py-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-mission/50 transition-all shadow-2xl"
        >
          {/* Internal Glowing Line */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-mission opacity-50 shadow-[0_0_15px_#10b981]" />
          
          <span className="relative text-white uppercase text-[11px] tracking-[0.5em] font-black group-hover:text-mission transition-colors">
            Adicionar às Crônicas
          </span>
        </motion.div>

        {/* Bottom Tactical Line */}
        <motion.div 
          initial={{ scaleX: 0 }} 
          animate={{ scaleX: 1 }} 
          transition={{ delay: 0.2, duration: 1.2, ease: "circOut" }}
          className="h-px w-full mt-[10vh] opacity-30" 
          style={{ background: `linear-gradient(90deg, transparent, rgba(${missionColor}, 1), transparent)` }}
        />
        
        {/* Helper text */}
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 text-[9px] uppercase tracking-[0.3em] text-white"
        >
          Clique em qualquer lugar para prosseguir
        </motion.span>
      </div>
    </motion.div>
  );
}