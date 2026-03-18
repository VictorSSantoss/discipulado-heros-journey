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
    <div className="fixed inset-0 z-[500] flex items-center justify-center pointer-events-auto overflow-hidden bg-black/95">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="fixed inset-0 backdrop-blur-2xl pointer-events-none" 
      />

      <div className="relative text-center max-w-none px-6 w-[90vw] h-full flex flex-col justify-center items-center z-10">
        
        <motion.div 
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2, duration: 1 }}
          className="h-px w-full mb-[8vh] opacity-40 shrink-0" 
          style={{ background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 0.8), transparent)` }}
        />

        <motion.span 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-[10px] sm:text-[12px] tracking-[0.8em] uppercase mb-[4vh] block font-bold shrink-0" 
          style={{ color: `rgb(${baseColor})`, textShadow: `0 0 15px rgba(${baseColor}, 0.8)` }}
        >
          Nova Relíquia Descoberta
        </motion.span>
        
        <div className="relative mb-[4vh] w-[30vh] h-[30vh] max-w-[320px] max-h-[320px] flex items-center justify-center shrink-0">
           <motion.div
             initial={{ scale: 0.5, opacity: 0 }} 
             animate={{ scale: 2.1, opacity: 0.9 }} 
             transition={{ delay: 0.1, duration: 0.8 }}
             className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
           >
               <img src={rayImageSrc} alt="" className="w-full h-full object-contain mix-blend-screen max-w-none" />
           </motion.div>

           <motion.div 
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 0.95, opacity: 1 }} 
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative w-full h-full z-10"
           >
              <div className="relative w-full h-full">
                <Image src={relic.icon} alt={relic.name} fill priority className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,1)]" />
              </div>
           </motion.div>
        </div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-white text-[clamp(2.5rem,8vh,6rem)] leading-none font-serif italic tracking-tighter mb-[2vh] drop-shadow-2xl px-4 shrink-0"
        >
          {relic.name}
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.0 }}
          className="font-barlow text-gray-400 max-w-lg mx-auto leading-relaxed mb-[4vh] text-sm sm:text-lg px-6 shrink-0"
        >
          {relic.description}
        </motion.p>

        <motion.button 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2 }}
          onClick={onComplete}
          className="group relative px-10 py-4 overflow-hidden rounded-full border border-white/20 hover:border-white/50 transition-all shadow-2xl shrink-0"
        >
          <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
          <span className="relative text-white uppercase text-[10px] tracking-[0.4em] font-bold">
            Adicionar à Coleção
          </span>
        </motion.button>

        <motion.div 
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2, duration: 1 }}
          className="h-px w-full mt-[8vh] opacity-40 shrink-0" 
          style={{ background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 0.8), transparent)` }}
        />
      </div>
    </div>
  );
}