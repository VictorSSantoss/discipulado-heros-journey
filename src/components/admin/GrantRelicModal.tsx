"use client";

import { useState } from "react";
import Image from "next/image";
import { ICONS } from "@/constants/gameConfig";

interface Relic {
  id: string;
  name: string;
  icon: string;
  rarity: string;
  description: string;
  ruleParams?: { type: string; value?: number; attr?: string }[];
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

export default function GrantRelicModal({ 
  valente, 
  catalog, 
  earnedMedals,
  onClose,
  onConfirm,
  isProcessing
}: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRelicId, setSelectedRelicId] = useState("");

  const earnedIds = new Set(earnedMedals.map((m: any) => m.medal?.id || m.reliquia?.id));
  
  const availableRelics = (catalog as Relic[]).filter((relic: Relic) => {
    if (earnedIds.has(relic.id)) return false;
    const isManual = !relic.ruleParams || 
                    relic.ruleParams.length === 0 || 
                    relic.ruleParams[0]?.type === "MANUAL";
    if (!isManual) return false;
    return relic.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedRelic = availableRelics.find((r: Relic) => r.id === selectedRelicId);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[600] flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-3xl shadow-[0_0_60px_rgba(0,0,0,1)] flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-200 overflow-visible font-barlow">
        
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent"></div>
        
        {/* HEADER */}
        <div className="p-8 border-b border-white/5 bg-black/40 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand/10 border border-brand/30 overflow-hidden shadow-[0_0_15px_rgba(17,194,199,0.3)]">
              <img 
                src={valente?.image && valente.image !== "" ? valente.image : "/images/placeholder.png"} 
                alt="" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.currentTarget.src = "/images/man-silhouette.svg"; }}
              />
            </div>
            <div>
              <h2 className="hud-title-md text-4xl text-white m-0 tracking-tighter uppercase font-normal">CONCEDER RELÍQUIA</h2>
              <p className="hud-label-tactical text-[11px] text-brand mt-1 uppercase italic-none">
                ALVO: <span className="text-white font-bold">{valente.name}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors text-2xl bg-white/5 rounded-full border border-white/10">✕</button>
        </div>

        {/* SEARCH BAR */}
        <div className="p-8 border-b border-white/5 bg-black/20 shrink-0 relative">
          <div className="absolute left-10 top-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center justify-center w-12 h-12">
            <div 
              className="absolute w-[100px] h-[100px] opacity-70 pointer-events-none mix-blend-screen"
              style={{ background: 'radial-gradient(circle, rgba(17,194,199,0.6) 0%, rgba(17,194,199,0) 35%)' }}
            />
            <Image src={ICONS.search} alt="" width={45} height={45} className="relative z-10 drop-shadow-[0_0_5px_rgba(17,194,199,0.5)]" />
          </div>
          <input 
            type="text" 
            placeholder="BUSCAR NO ACERVO..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '80px' }}
            className="w-full bg-black/60 border border-white/10 p-5 rounded-xl text-white hud-label-tactical text-xs outline-none focus:border-brand/60 transition-all placeholder:opacity-50 font-normal shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] uppercase tracking-widest"
          />
        </div>

        {/* RELICS LIST */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-black/10">
          {availableRelics.map((relic: Relic) => {
            const normalizedRarity = normalizeRarity(relic.rarity);
            const rayImageSrc = rarityRayMap[normalizedRarity];
            const baseColor = rarityColorMap[normalizedRarity];
            const isSelected = selectedRelicId === relic.id;

            return (
              <div 
                key={relic.id} 
                onClick={() => setSelectedRelicId(relic.id)}
                className={`group flex gap-8 p-6 transition-all duration-300 rounded-2xl relative cursor-pointer border overflow-hidden ${
                  isSelected 
                    ? 'bg-brand/10 border-brand shadow-[0_0_30px_rgba(17,194,199,0.2)] scale-[1.01]' 
                    : 'bg-black/40 border-white/10 hover:border-white/30 hover:-translate-y-1'
                }`}
              >
                {/* ⚔️ THE OVERLAY LOCKER: High z-index to sit on top of text and icon */}
                {!isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100]">
                    {/* Discrete Central Glow */}
                    <div className="absolute w-64 h-64 bg-white/[0.03] blur-3xl rounded-full transition-all duration-300" />
                    
                    {/* Big Locker Image */}
                    <div className="relative drop-shadow-[0_15px_30px_rgba(0,0,0,1)]">
                        <Image src="/images/locker-icon.svg" alt="Locked" width={140} height={140} />
                    </div>
                  </div>
                )}

                {/* ICON AREA (Pushed back/Blurred when locked) */}
                <div className={`w-28 h-28 shrink-0 relative flex items-center justify-center pointer-events-none z-10 transition-all duration-500 ${!isSelected ? 'grayscale brightness-[0.2] opacity-30 blur-[4px]' : ''}`}>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0 transition-all duration-700 ${isSelected ? 'opacity-100 scale-[2.2]' : 'opacity-20 scale-[1.5]'}`}>
                     <img src={rayImageSrc} alt="" className="w-full h-full object-contain mix-blend-screen" />
                  </div>
                  
                  <div className="relative w-20 h-20 z-10">
                    <Image 
                      src={relic.icon} 
                      alt={relic.name} 
                      fill 
                      className={`object-contain transition-all duration-500 ${isSelected ? 'drop-shadow-[0_0_20px_rgba(17,194,199,0.6)] scale-110' : 'drop-shadow-lg'}`} 
                    />
                  </div>
                </div>
                
                {/* TEXT INFO (Pushed back/Blurred when locked) */}
                <div className={`flex-1 flex flex-col justify-center gap-1 relative z-10 transition-all duration-500 ${!isSelected ? 'opacity-20 blur-[3px]' : ''}`}>
                  <div className="flex justify-between items-center mb-1 gap-4">
                    <h3 className={`hud-title-md text-2xl transition-colors ${isSelected ? 'text-brand' : 'text-white'}`}>
                      {relic.name}
                    </h3>
                    
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
                  </div>
                  
                  <p className="font-barlow text-sm text-gray-400 leading-relaxed italic-none max-w-[95%]">
                    {relic.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="p-8 bg-black/60 border-t border-white/5 rounded-b-2xl shrink-0">
          <div className="flex justify-between items-center gap-8">
            <div className="flex flex-col gap-1 min-h-[50px] justify-center flex-1">
              <p className="hud-label-tactical text-gray-500 text-[10px] uppercase font-normal tracking-widest">STATUS DE VÍNCULO:</p>
              {selectedRelic ? (
                <p className="font-normal text-lg hud-title-md tracking-wider uppercase text-brand animate-pulse">
                  VINCULAR {selectedRelic.name}
                </p>
              ) : (
                <p className="font-normal text-lg hud-title-md tracking-wider uppercase text-gray-600">
                  AGUARDANDO SELEÇÃO...
                </p>
              )}
            </div>
            <div className="flex gap-4 shrink-0">
              <button onClick={onClose} className="hud-label-tactical text-xs tracking-widest text-gray-500 hover:text-white px-6 py-4 uppercase font-normal transition-colors">Abortar</button>
              <button 
                onClick={() => selectedRelicId && onConfirm(selectedRelicId)}
                disabled={!selectedRelicId || isProcessing}
                className="px-12 py-4 bg-brand/10 border border-brand/50 hover:bg-brand disabled:bg-white/5 disabled:border-white/5 disabled:text-gray-600 disabled:opacity-50 text-brand hover:text-white hud-title-md text-xl rounded-xl transition-all shadow-[0_0_20px_rgba(17,194,199,0.2)]"
              >
                {isProcessing ? "PROCESSANDO..." : "CONCEDER ARTEFATO"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}