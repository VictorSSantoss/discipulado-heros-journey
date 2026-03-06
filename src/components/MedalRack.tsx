"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ICONS } from "@/constants/gameConfig"; 

interface MedalRackProps {
  medals: {
    medal: {
      id: string;
      name: string;
      icon: string;
      rarity: string;
      description: string;
      requirement: number;
    };
    awardedAt: Date;
  }[];
  catalog?: any[]; 
  currentXp?: number; 
}

export default function MedalRack({ medals, catalog = [], currentXp = 0 }: MedalRackProps) {
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const totalSlots = 6;
  const earnedCount = medals.length;
  const emptySlots = Math.max(0, totalSlots - earnedCount);

  const earnedMedalIds = new Set(medals.map(m => m.medal.id));

  return (
    <>
      <div className="bg-dark-bg/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
        
        {/* FIXED: Pushed to background (z-0) and made extremely subtle (opacity-[0.02]) */}
        <div className="absolute -right-6 -top-6 opacity-[0.02] pointer-events-none rotate-[15deg] z-0">
           <img src={ICONS.patentes} className="w-32 h-32 object-contain" alt="" />
        </div>

        {/* --- STABILIZED HEADER --- */}
        {/* FIXED: Explicitly set relative z-10 to stay on top */}
        <div className="flex flex-row justify-between items-center mb-8 relative z-10 gap-4">
          <div className="flex flex-col gap-1 min-w-fit">
            <h3 className="hud-label-tactical text-[10px] text-gray-500 uppercase tracking-[0.2em] whitespace-nowrap">
              Medalhas de Honra
            </h3>
            <div className="flex items-baseline gap-2">
               <span className="hud-value text-brand text-3xl drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                {earnedCount}
              </span>
              <span className="text-white/20 hud-label-tactical text-[10px] whitespace-nowrap">/ {totalSlots} COLETADAS</span>
            </div>
          </div>

          <button 
            onClick={() => setIsCodexOpen(true)}
            className="group flex items-center gap-1 px-2 py-0 bg-brand/10 border border-brand/20 rounded-xl hover:bg-brand/20 hover:border-brand/50 transition-all shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            <span className="hud-label-tactical text-[10px] text-brand tracking-widest uppercase font-bold">
              VER CODEX
            </span>
            <img 
              src={ICONS.codex} 
              className="w-12 h-12 object-contain opacity-80 group-hover:scale-110 transition-transform brightness-200" 
              alt="Codex" 
            />
          </button>
        </div>

        {/* --- MEDALS GRID --- */}
        {/* FIXED: Explicitly set relative z-10 to stay on top */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 relative z-10">
          {medals.map((vm, index) => (
            <div 
              key={index}
              className="group relative aspect-square flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:border-brand/50 hover:bg-brand/5 transition-all cursor-help"
            >
              <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
                <Image 
                  src={vm.medal.icon} 
                  alt={vm.medal.name} 
                  fill 
                  className="object-contain drop-shadow-[0_0_8px_rgba(17,194,199,0.3)]"
                />
              </div>

              {/* TOOLTIP */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-3 bg-dark-bg border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                <p className="hud-label-tactical text-[10px] text-brand mb-1">{vm.medal.rarity}</p>
                <p className="hud-title-md text-xs text-white mb-1">{vm.medal.name}</p>
                <p className="text-[9px] text-gray-400 leading-tight mb-2">{vm.medal.description}</p>
                <p className="text-[8px] text-gray-500 border-t border-white/5 pt-1 uppercase whitespace-nowrap">
                  Conquistado em: {new Date(vm.awardedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}

          {emptySlots > 0 && [...Array(emptySlots)].map((_, i) => (
            <div 
              key={`empty-${i}`}
              className="aspect-square flex items-center justify-center bg-black/20 border border-dashed border-white/5 rounded-xl grayscale opacity-30 cursor-pointer hover:opacity-50 transition-opacity"
              onClick={() => setIsCodexOpen(true)}
            >
              <div className="w-8 h-8 rounded-full bg-white/5" />
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL (Unchanged) --- */}
      <AnimatePresence>
        {isCodexOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-dark-bg border border-brand/30 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                <div>
                  <h2 className="hud-title-md text-white text-2xl uppercase tracking-widest flex items-center gap-3">
                    <span className="text-brand">●</span> Codex de Medalhas
                  </h2>
                  <p className="hud-label-tactical text-gray-400 mt-1">Acervo completo de honrarias do Reino</p>
                </div>
                <button 
                  onClick={() => setIsCodexOpen(false)}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
                {catalog.length === 0 ? (
                  <div className="text-center py-10 opacity-30 hud-label-tactical uppercase">Catálogo não encontrado</div>
                ) : (
                  catalog.map((medal) => {
                    const isEarned = earnedMedalIds.has(medal.id);
                    const progress = Math.min((currentXp / medal.requirement) * 100, 100);

                    return (
                      <div 
                        key={medal.id} 
                        className={`flex gap-4 p-4 rounded-xl border transition-all ${
                          isEarned 
                            ? 'bg-brand/5 border-brand/30' 
                            : 'bg-white/[0.02] border-white/5 opacity-70 hover:opacity-100 grayscale hover:grayscale-0'
                        }`}
                      >
                        <div className="w-16 h-16 shrink-0 relative flex items-center justify-center bg-dark-bg rounded-lg border border-white/10">
                          <Image src={medal.icon} alt={medal.name} fill className="object-contain p-2" />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="hud-title-md text-white text-lg">{medal.name}</h3>
                            <span className={`hud-label-tactical text-[9px] px-2 py-0.5 rounded-sm border ${
                              isEarned ? 'border-brand text-brand' : 'border-gray-600 text-gray-500'
                            }`}>
                              {medal.rarity}
                            </span>
                          </div>
                          <p className="text-xs font-barlow text-gray-400 mb-3">{medal.description}</p>
                          
                          {!isEarned && (
                            <div className="w-full">
                              <div className="flex justify-between items-end mb-1">
                                <span className="hud-label-tactical text-[8px] text-gray-500 uppercase tracking-widest">Requisito: {medal.requirement} XP</span>
                                <span className="hud-value text-[10px] text-gray-400">{Math.floor(progress)}%</span>
                              </div>
                              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-brand transition-all duration-1000" 
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
        )}
      </AnimatePresence>
    </>
  );
}