"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CodexProps {
  catalog: any[];
  earnedMedals: any[];
  currentXp: number;
  onClose: () => void;
}

// ⚔️ MAP YOUR ACTUAL IMAGE FILES HERE
const rarityRayMap: Record<string, string> = {
  LEGENDARY: "/images/ray-legendary.png", 
  RARE: "/images/ray-rare.png",           
  COMMON: "/images/ray-common.png",       
};

// ⚔️ Color Map to tint the Rarity Tags dynamically
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

export default function RelicCodexModal({ catalog, earnedMedals, currentXp = 0, onClose }: CodexProps) {
  const earnedMedalIds = new Set(earnedMedals.map(m => m.medal.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-dark-bg/95 border border-brand/30 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden"
        >
          <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/40">
            <div>
              <h2 className="hud-title-md text-white text-3xl uppercase tracking-widest flex items-center gap-3">
                <span className="text-brand">●</span> Codex de Relíquias
              </h2>
              <p className="hud-label-tactical text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px]">
                Acervo Completo de Honrarias e Artefatos do Reino
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand/50 transition-all hover:bg-brand/10 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6 overflow-x-hidden">
            {catalog.length === 0 ? (
              <div className="text-center py-20 opacity-30 hud-label-tactical uppercase text-[10px] tracking-[0.2em] text-gray-500">
                Catálogo Vazio
              </div>
            ) : (
              catalog.map((medal) => {
                const isEarned = earnedMedalIds.has(medal.id);
                const req = medal.requirement || 1; 
                const progress = Math.max(0, Math.min((currentXp / req) * 100, 100)) || 0;
                
                // ⚔️ Normalize rarity for both the ray image and the tag color
                const normalizedRarity = normalizeRarity(medal.rarity);
                const rayImageSrc = rarityRayMap[normalizedRarity];
                const baseColor = rarityColorMap[normalizedRarity];

                return (
                  <div 
                    key={medal.id} 
                    // ⚔️ Added 'group' and hover effects to lift the entire row
                    className={`group flex gap-6 p-6 transition-all duration-500 rounded-2xl relative ${
                      isEarned 
                        ? 'bg-black/80 border border-brand/20 shadow-lg hover:border-brand/50 hover:-translate-y-1 hover:bg-black/90 hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] cursor-pointer' 
                        : 'bg-black/40 border border-white/5 opacity-60 hover:opacity-100 grayscale hover:grayscale-0'
                    }`}
                  >
                    {/* ⚔️ THE BF1 RAY CONTAINER */}
                    <div className="w-28 h-28 shrink-0 relative flex items-center justify-center pointer-events-none">
                        
                      {isEarned && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
                           <img 
                             src={rayImageSrc}
                             alt=""
                             className="w-full h-full object-contain mix-blend-screen scale-[2.0] opacity-80 group-hover:opacity-100 group-hover:scale-[2.4] transition-all duration-700"
                             onError={(e) => e.currentTarget.style.display = 'none'}
                           />
                        </div>
                      )}
                      
                      {/* ⚔️ The Icon slightly scales up and bobs up on hover */}
                      <div className="relative w-[90%] h-[90%] z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                        <Image 
                          src={medal.icon} 
                          alt={medal.name} 
                          fill 
                          className={`object-contain ${
                            isEarned 
                              ? 'drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]' 
                              : 'opacity-40'
                          }`} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center gap-1.5 relative z-10">
                      <div className="flex justify-between items-start">
                        <h3 className="hud-title-md text-white text-xl transition-colors group-hover:text-brand">{medal.name}</h3>
                        
                        {/* ⚔️ UNIFIED GLOWING RARITY PILL */}
                        {isEarned ? (
                          <div className="relative z-10 flex items-center justify-center px-6 py-1.5 rounded-full backdrop-blur-xl overflow-hidden shrink-0"
                            style={{ 
                              background: `linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(${baseColor}, 0.2) 100%)`,
                              boxShadow: `inset 0 0 12px rgba(${baseColor}, 0.2), 0 4px 15px rgba(0, 0, 0, 0.5)`
                            }}>
                            <div className="absolute top-0 left-0 w-full h-[1px] opacity-40" style={{ background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 1), transparent)` }} />
                            <span className="hud-label-tactical text-[11px] font-black tracking-[0.3em] text-white uppercase relative z-10"
                              style={{ textShadow: `0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(${baseColor}, 1)` }}>
                              {normalizedRarity === "LEGENDARY" ? "LENDÁRIA" : normalizedRarity === "RARE" ? "RARA" : "COMUM"}
                            </span>
                          </div>
                        ) : (
                          <div className="relative z-10 flex items-center justify-center px-6 py-1.5 rounded-full backdrop-blur-xl overflow-hidden shrink-0 bg-black/50 border border-white/5">
                            <span className="hud-label-tactical text-[11px] font-black tracking-[0.3em] text-gray-600 uppercase relative z-10">
                              {normalizedRarity === "LEGENDARY" ? "LENDÁRIA" : normalizedRarity === "RARE" ? "RARA" : "COMUM"}
                            </span>
                          </div>
                        )}

                      </div>
                      
                      <p className="font-barlow text-sm text-gray-400 mb-2">{medal.description}</p>
                      
                      {!isEarned && (
                        <div className="w-full mt-auto transition-opacity duration-500">
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="hud-label-tactical text-[8px] text-gray-500 uppercase tracking-widest">Requisito: {medal.requirement} XP</span>
                            <span className="hud-value text-[11px] text-gray-500 group-hover:text-white transition-colors">{Math.floor(progress)}<span className="text-[10px]">%</span></span>
                          </div>
                          <div className="h-1 w-full bg-black/70 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="h-full bg-gray-500 transition-all duration-1000 rounded-full group-hover:bg-white/80" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}