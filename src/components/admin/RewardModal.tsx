"use client";

import { useState } from "react";
import Image from "next/image";
import { ATTRIBUTE_MAP, MISSION_CATEGORIES, GET_XP_MULTIPLIER, ICONS } from "@/constants/gameConfig";

interface Mission {
  id: string;
  title: string;
  type: string;
  xpReward: number;
  rewardAttribute: string | null;
  rewardAttrValue: number;
}

interface RewardModalProps {
  valente: any;
  missions: Mission[];
  onClose: () => void;
  onConfirm: (missionId: string) => void;
  isProcessing: boolean;
}

export default function RewardModal({ 
  valente, 
  missions, 
  onClose,
  onConfirm,
  isProcessing
}: RewardModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("TODAS");
  const [selectedMissionId, setSelectedMissionId] = useState("");

  const multiplier = GET_XP_MULTIPLIER();
  const isActive = multiplier.factor > 1;

  // 1. Filter Logic
  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "TODAS" || mission.type === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // 2. Selection & Preview Logic
  const selectedMission = missions.find(m => m.id === selectedMissionId);
  const baseXp = selectedMission ? selectedMission.xpReward : 0;
  const finalXpPreview = Math.floor(baseXp * multiplier.factor);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      {/* Container - overflow-visible to allow glow bleed */}
      <div className="bg-dark-bg border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-200 overflow-visible">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mission/40 to-transparent"></div>
        
        {/* HEADER - Refined Avatar Size */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-mission/20 border border-mission/40 overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <img 
                src={valente?.image && valente.image !== "" ? valente.image : "/images/placeholder.png"} 
                alt={valente?.name || "Hero"} 
                className="w-full h-full object-cover transition-all duration-500 hover:scale-110 brightness-[1.1] contrast-[1.1]" 
                onError={(e) => { e.currentTarget.src = "/images/man-silhouette.svg"; }}
              />
            </div>
            <div>
              <h2 className="hud-title-md text-4xl text-white m-0 tracking-tighter uppercase font-normal">DIRECIONAR MISSÃO</h2>
              <p className="hud-label-tactical text-[11px] text-mission mt-1 uppercase italic-none">
                ALVO: <span className="text-white font-bold">{valente.name}</span>
              </p>
            </div>
          </div>
          <button onClick={!isProcessing ? onClose : undefined} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors text-2xl bg-white/5 rounded-full border border-white/10">
            ✕
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="p-8 border-b border-white/5 space-y-6 overflow-visible shrink-0">
          <div className="relative group">
            {/* Radiant Glow Behind Icon */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center justify-center">
              <div 
                className="absolute w-[100px] h-[100px] opacity-70 pointer-events-none mix-blend-screen"
                style={{
                  background: 'radial-gradient(circle, rgba(16,185,129,0.6) 0%, rgba(16,185,129,0) 35%)'
                }}
              ></div>
              <Image 
                src={ICONS.search} 
                alt="" 
                width={65} 
                height={65} 
                className="relative z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
              />
            </div>
            
            <input 
              type="text" 
              placeholder="BUSCAR NO MURAL DE MISSÕES..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '90px' }} // FORCE text to the right
              className="w-full bg-mission/20 border border-white/10 p-5 rounded-xl text-white hud-label-tactical text-xs outline-none focus:border-mission/60 transition-all placeholder:opacity-50 font-normal shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
            />
          </div>
          
          <div className="relative overflow-visible">
            <div className="flex gap-3 overflow-x-auto px-4 py-4 pb-6 custom-category-scroll-mission overflow-visible">
              <button
                onClick={() => setFilterCategory("TODAS")}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full hud-label-tactical text-[10px] tracking-widest transition-all border uppercase font-normal ${
                  filterCategory === "TODAS" 
                  ? 'bg-mission/20 border-mission text-mission shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                  : 'bg-black/40 text-gray-500 border-white/10 hover:text-white'
                }`}
              >
                TODAS
              </button>
              {MISSION_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full hud-label-tactical text-[10px] tracking-widest transition-all border uppercase font-normal ${
                    filterCategory === cat 
                    ? 'bg-mission/20 border-mission text-mission shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                    : 'bg-black/40 text-gray-500 border-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MISSION LIST (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-black/20">
          {filteredMissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-50">
              <p className="hud-label-tactical text-sm text-gray-400 uppercase tracking-widest">Nenhuma missão encontrada</p>
            </div>
          ) : (
            filteredMissions.map((mission) => (
              <div 
                key={mission.id}
                onClick={() => setSelectedMissionId(mission.id)}
                className={`p-6 rounded-2xl cursor-pointer border transition-all group relative overflow-hidden ${
                  selectedMissionId === mission.id 
                  ? 'bg-mission/10 border-mission shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]' 
                  : 'bg-dark-surface border-white/5 hover:border-mission/40 hover:bg-mission/10'
                }`}
              >
                {/* Active Indicator Line */}
                {selectedMissionId === mission.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-mission shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                )}

                <div className="flex justify-between items-center relative z-10 gap-4">
                  <div className="flex-1">
                    <p className={`hud-title-md text-2xl transition-colors tracking-tight uppercase font-normal ${selectedMissionId === mission.id ? 'text-mission' : 'text-white group-hover:text-mission'}`}>
                      {mission.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="inline-block px-3 py-1 bg-black/40 border border-white/10 rounded-md hud-label-tactical text-[9px] text-gray-500 uppercase italic-none font-normal">
                        {mission.type}
                      </span>
                      
                      {/* RELIC LOGIC: ATTRIBUTE BADGE */}
                      {mission.rewardAttribute && mission.rewardAttrValue > 0 && (
                        <span className="inline-block px-3 py-1 bg-brand/10 border border-brand/30 rounded-md hud-label-tactical text-[9px] text-brand uppercase italic-none font-normal">
                          +{mission.rewardAttrValue} {ATTRIBUTE_MAP[mission.rewardAttribute]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="hud-value text-3xl text-mission drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] font-normal">
                      {mission.xpReward === 9999 ? 'LVL UP' : `+${mission.xpReward} XP`}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER: REWARD PREVIEW & ACTIONS */}
        <div className="p-8 bg-dark-bg/80 border-t border-white/5 rounded-b-2xl shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Intel Panel */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              {isActive && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg animate-pulse w-fit">
                  <span className="text-emerald-500 text-xs">⚡</span>
                  <span className="hud-label-tactical text-[10px] text-emerald-500 uppercase tracking-widest font-normal">
                    {multiplier.label} ATIVO
                  </span>
                </div>
              )}
              
              {selectedMission ? (
                <div className="flex flex-col gap-1">
                  <p className="hud-label-tactical text-gray-500 text-[10px] uppercase font-normal">
                    RECOMPENSA CALCULADA:
                  </p>
                  <div className="flex items-center gap-4">
                     <span className="text-white font-normal text-lg hud-value">+{finalXpPreview} XP</span>
                     {/* RELIC LOGIC: FOOTER PREVIEW */}
                     {selectedMission.rewardAttribute && selectedMission.rewardAttrValue > 0 && (
                       <>
                         <span className="text-white/20">|</span>
                         <span className="text-brand font-normal text-sm tracking-widest uppercase hud-value">
                           +{selectedMission.rewardAttrValue} {ATTRIBUTE_MAP[selectedMission.rewardAttribute]}
                         </span>
                       </>
                     )}
                  </div>
                </div>
              ) : (
                <p className="hud-label-tactical text-gray-600 text-[10px] uppercase font-normal">
                  Aguardando seleção...
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                type="button" 
                onClick={onClose} 
                disabled={isProcessing}
                className="hud-label-tactical text-xs tracking-widest text-gray-500 hover:text-white px-6 transition-colors uppercase font-normal"
              >
                Abortar
              </button>
              <button 
                onClick={() => selectedMissionId && onConfirm(selectedMissionId)}
                disabled={!selectedMissionId || isProcessing}
                className="flex-1 md:flex-none px-12 py-4 bg-mission/10 border border-mission/50 hover:bg-mission disabled:bg-white/5 disabled:border-white/5 disabled:text-gray-600 disabled:opacity-50 text-mission hover:text-white hud-title-md text-xl rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] tracking-wider font-normal uppercase"
              >
                {isProcessing ? "PROCESSANDO..." : "CONFIRMAR"}
              </button>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-category-scroll-mission::-webkit-scrollbar { height: 8px; }
        .custom-category-scroll-mission::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); margin: 0 40px; border-radius: 10px; }
        .custom-category-scroll-mission::-webkit-scrollbar-thumb { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); border-radius: 10px; }
      `}</style>
    </div>
  );
}