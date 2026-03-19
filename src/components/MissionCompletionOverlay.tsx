"use client";

import { motion } from "framer-motion";
import { ATTRIBUTE_MAP } from "@/constants/gameConfig";

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

export default function MissionCompletionOverlay({ mission, onComplete }: MissionCompletionOverlayProps) {
  if (!mission) return null;

  const isLvlUp = mission.xpReward === 9999;
  const missionColor = "16, 185, 129"; // Emerald Green RGB

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete} // Click anywhere to dismiss
      className="fixed inset-0 z-[600] flex items-center justify-center cursor-pointer pointer-events-auto overflow-hidden bg-black/98 backdrop-blur-2xl"
    >
      {/* 🌿 Taverna-Style Ambient Blur - Sweeping green atmosphere from top */}
      <div 
        className="absolute top-0 left-0 w-full h-[65vh] bg-gradient-to-b from-mission/25 via-mission/5 to-transparent blur-[110px] pointer-events-none opacity-70"
      />

      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] z-0">
        <span className="text-[35vw] font-black italic select-none tracking-tighter">DECRETO</span>
      </div>

      <div className="relative text-center max-w-none px-6 w-[95vw] h-full flex flex-col justify-center items-center z-10">
        
        {/* Top Tactical Line */}
        <motion.div 
          initial={{ scaleX: 0 }} 
          animate={{ scaleX: 1 }} 
          transition={{ delay: 0.2, duration: 1.2, ease: "circOut" }}
          className="h-px w-full mb-[10vh] opacity-40" 
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
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: `rgb(${missionColor})`, boxShadow: `0 0 10px rgb(${missionColor})` }} />
        </motion.div>

        {/* Mission Title */}
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-white text-[clamp(2rem,7vh,5.5rem)] leading-none font-serif italic tracking-tighter mb-[6vh] drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] px-4"
        >
          {mission.title}
        </motion.h1>
        
        {/* Rewards Block */}
        <div className="flex flex-col items-center gap-6 mb-[8vh] min-h-[140px]">
          
          {/* 🚀 Silky Smooth Floating XP Display */}
          <motion.div 
            initial={{ y: 0, opacity: 0 }} 
            animate={{ opacity: 1, y: -12 }} 
            transition={{ 
              opacity: { delay: 0.9, duration: 0.8 },
              y: { 
                delay: 1.5, 
                duration: 2.8, 
                repeat: Infinity, 
                repeatType: "mirror", 
                ease: "easeInOut" 
              } 
            }}
            style={{ willChange: "transform" }}
            className="flex flex-col items-center"
          >
             <div className="flex items-baseline gap-2">
                <span className="text-white text-6xl sm:text-[6.5rem] font-black tracking-tighter drop-shadow-2xl brightness-110">
                  {isLvlUp ? "LEVEL" : `+${mission.xpReward}`}
                </span>
                <span className="text-mission text-3xl sm:text-5xl font-black uppercase tracking-widest drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">
                  {isLvlUp ? "UP" : "XP"}
                </span>
             </div>
             <span className="hud-label-tactical text-gray-400 tracking-[0.4em] text-[11px] mt-4 uppercase font-bold">
               Honra e Glória Adquiridas
             </span>
          </motion.div>

          {/* Attribute Reward Badges */}
          {(mission.rewardAttribute || mission.rewardAttribute2) && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: 1.2, type: "spring", bounce: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mt-4"
            >
              {mission.rewardAttribute && (
                <div className="px-6 py-2.5 border border-mission/40 bg-mission/10 rounded-xl backdrop-blur-xl flex items-center gap-3 shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
                  <span className="text-mission font-black text-2xl leading-none">+{mission.rewardAttrValue || 1}</span>
                  <span className="text-white text-[11px] tracking-[0.2em] uppercase font-black">
                    {ATTRIBUTE_MAP[mission.rewardAttribute] || mission.rewardAttribute}
                  </span>
                </div>
              )}
              
              {mission.rewardAttribute2 && (
                <div className="px-6 py-2.5 border border-mission/40 bg-mission/10 rounded-xl backdrop-blur-xl flex items-center gap-3 shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
                  <span className="text-mission font-black text-2xl leading-none">+{mission.rewardAttrValue || 1}</span>
                  <span className="text-white text-[11px] tracking-[0.2em] uppercase font-black">
                    {ATTRIBUTE_MAP[mission.rewardAttribute2] || mission.rewardAttribute2}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Action Button HUD Element */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 1.5 }}
          className="group relative px-2 py-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all shadow-2xl"
        >
          <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-mission shadow-[0_0_20px_#10b981] brightness-125" />
          <span className="relative text-white uppercase text-[12px] tracking-[0.6em] font-black">
            Arquivar Recompensa
          </span>
        </motion.div>

        {/* Bottom Tactical Line */}
        <motion.div 
          initial={{ scaleX: 0 }} 
          animate={{ scaleX: 1 }} 
          transition={{ delay: 0.2, duration: 1.2, ease: "circOut" }}
          className="h-px w-full mt-[10vh] opacity-40" 
          style={{ background: `linear-gradient(90deg, transparent, rgba(${missionColor}, 1), transparent)` }}
        />
        
        {/* Helper text */}
        <motion.span 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.5 }} 
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 text-[10px] uppercase tracking-[0.4em] text-white animate-pulse font-medium"
        >
          Toque em qualquer lugar para prosseguir
        </motion.span>
      </div>
    </motion.div>
  );
}