"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface RelicDiscoveryProps {
  relic: {
    id: string;
    name: string;
    icon: string;
    rarity: string;
    description: string;
  };
  onComplete: () => void;
}

const rarityRayMap: Record<string, string> = {
  LEGENDARY: "/images/ray-legendary.png", 
  RARE: "/images/ray-rare.png",           
  COMMON: "/images/ray-common.png",       
};

const rarityColorMap: Record<string, string> = {
  LEGENDARY: "255, 170, 0", 
  RARE: "59, 130, 246", 
  COMMON: "255, 255, 255", 
};

const normalizeRarity = (rarity: string) => {
  const str = (rarity || "").toUpperCase().trim();
  if (str.includes("LEND") || str.includes("LEGEND")) return "LEGENDARY";
  if (str.includes("RAR")) return "RARE";
  return "COMMON";
};

export default function RelicDiscoveryOverlay({ relic, onComplete }: RelicDiscoveryProps) {
  if (!relic) return null;

  const normalizedRarity = normalizeRarity(relic.rarity);
  const baseColor = rarityColorMap[normalizedRarity];
  const rayImageSrc = rarityRayMap[normalizedRarity];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete}
      className="fixed inset-0 z-[600] flex items-center justify-center cursor-pointer pointer-events-auto overflow-hidden bg-black/95 backdrop-blur-2xl"
    >
      {/* Taverna-Style Ambient Blur - Sweeping green atmosphere */}
      <div 
        className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-mission/20 via-mission/5 to-transparent blur-[100px] pointer-events-none opacity-60"
      />

      <div className="relative text-center max-w-none px-6 w-[95vw] h-full flex flex-col justify-center items-center z-10">
        
        {/* Top Tactical Line */}
        <motion.div 
          initial={{ scaleX: 0 }} 
          animate={{ scaleX: 1 }} 
          transition={{ delay: 0.2, duration: 1.2, ease: "circOut" }}
          className="h-px w-full mb-[8vh] opacity-50 shrink-0" 
          style={{ background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 1), transparent)` }}
        />

        {/* Subtitle Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-2 mb-[4vh] shrink-0"
        >
          <span 
            className="text-[10px] sm:text-[12px] tracking-[1em] uppercase font-black" 
            style={{ color: `rgb(${baseColor})`, textShadow: `0 0 20px rgba(${baseColor}, 0.8)` }}
          >
            Nova Relíquia Descoberta
          </span>
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: `rgb(${baseColor})`, boxShadow: `0 0 10px rgb(${baseColor})` }} />
        </motion.div>
        
        {/* The Artifact Container */}
        <div className="relative mb-[4vh] w-[30vh] h-[30vh] max-w-[320px] max-h-[320px] flex items-center justify-center shrink-0">
           
           {/* Static Atmospheric Rays */}
           <motion.div
             initial={{ scale: 0.5, opacity: 0 }} 
             animate={{ scale: 2.2, opacity: 0.7 }} 
             transition={{ 
                scale: { delay: 0.1, duration: 1.2, ease: "easeOut" },
                opacity: { delay: 0.1, duration: 1.2 }
             }}
             className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
           >
               <img src={rayImageSrc} alt="" className="w-full h-full object-contain mix-blend-screen max-w-none scale-150" />
           </motion.div>

           {/* 🚀 Silky Smooth Floating Relic Icon */}
           <motion.div 
              initial={{ scale: 0, opacity: 0, y: 0 }} 
              animate={{ scale: 1, opacity: 1, y: -15 }} 
              transition={{ 
                scale: { delay: 0.5, duration: 0.8, type: "spring", bounce: 0.4 },
                opacity: { delay: 0.5, duration: 0.8 },
                y: { 
                  delay: 1.5, 
                  duration: 2.5, 
                  repeat: Infinity, 
                  repeatType: "mirror", 
                  ease: "easeInOut" 
                }
              }}
              style={{ willChange: "transform" }}
              className="relative w-full h-full z-10"
           >
              <Image 
                src={relic.icon} 
                alt={relic.name} 
                fill 
                priority 
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,1)] brightness-110 contrast-110" 
              />
           </motion.div>
        </div>

        {/* Title */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.8 }}
          className="text-white text-[clamp(2.5rem,7vh,5.5rem)] leading-none font-serif italic tracking-tighter mb-[2vh] drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] px-4 shrink-0"
        >
          {relic.name}
        </motion.h1>
        
        {/* Description */}
        <motion.p 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 1.0 }}
          className="font-barlow text-gray-400 max-w-lg mx-auto leading-relaxed mb-[6vh] text-sm sm:text-lg px-6 shrink-0"
        >
          {relic.description}
        </motion.p>

        {/* Action Prompt */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 1.2 }}
          className="group relative px-12 py-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all shadow-2xl shrink-0"
        >
          <div className="absolute bottom-0 left-0 w-full h-[2px] opacity-60" style={{ backgroundColor: `rgb(${baseColor})`, boxShadow: `0 0 15px rgb(${baseColor})` }} />
          <span className="relative text-white uppercase text-[11px] tracking-[0.4em] font-black">
            Adicionar à Coleção
          </span>
        </motion.div>

        {/* Bottom Tactical Line */}
        <motion.div 
          initial={{ scaleX: 0 }} 
          animate={{ scaleX: 1 }} 
          transition={{ delay: 0.2, duration: 1.2, ease: "circOut" }}
          className="h-px w-full mt-[10vh] opacity-50 shrink-0" 
          style={{ background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 1), transparent)` }}
        />

        {/* Helper text */}
        <motion.span 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.4 }} 
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 text-[9px] uppercase tracking-[0.3em] text-white animate-pulse"
        >
          Clique em qualquer lugar para prosseguir
        </motion.span>
      </div>
    </motion.div>
  );
}