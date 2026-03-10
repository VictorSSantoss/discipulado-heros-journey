"use client";

import { useState } from "react";
import { ATTRIBUTE_MAP, MISSION_CATEGORIES, GET_XP_MULTIPLIER } from "@/constants/gameConfig";

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      {/* Container */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-3xl shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-200">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mission to-transparent"></div>
        
        {/* HEADER */}
        <div className="p-6 border-b border-white/5 bg-black/40 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-mission/20 border border-mission/40 overflow-hidden">
              <img src={valente.image || "/images/placeholder.png"} alt="Hero" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="hud-title-md text-2xl text-white m-0 tracking-widest">DIRECIONAR MISSÃO</h2>
              <p className="hud-label-tactical text-[10px] text-mission mt-1 uppercase">
                Alvo: {valente.name}
              </p>
            </div>
          </div>
          <button onClick={!isProcessing ? onClose : undefined} className="text-gray-500 hover:text-white transition-colors text-2xl">
            ✕
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="p-6 border-b border-white/5 space-y-5 bg-black/20 shrink-0">
          <div className="relative">
            <input 
              type="text" 
              placeholder="BUSCAR NO MURAL DE MISSÕES..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/60 border border-white/10 p-4 pl-12 rounded-xl text-white hud-label-tactical text-xs outline-none focus:border-mission/50 transition-all shadow-inner placeholder:opacity-30 uppercase tracking-widest"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">⌕</span>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            <button
              onClick={() => setFilterCategory("TODAS")}
              className={`whitespace-nowrap px-5 py-2 rounded-full hud-label-tactical text-[10px] transition-all border uppercase ${
                filterCategory === "TODAS" 
                ? 'bg-mission border-mission text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                : 'bg-black/60 text-gray-500 border-white/5 hover:text-white'
              }`}
            >
              TODAS
            </button>
            {MISSION_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full hud-label-tactical text-[10px] transition-all border uppercase ${
                  filterCategory === cat 
                  ? 'bg-mission border-mission text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                  : 'bg-black/60 text-gray-500 border-white/5 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* MISSION LIST (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/10">
          {filteredMissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-50">
              <span className="text-4xl mb-4">📭</span>
              <p className="hud-label-tactical text-sm text-gray-400 uppercase tracking-widest">Nenhuma missão encontrada</p>
            </div>
          ) : (
            filteredMissions.map((mission) => (
              <div 
                key={mission.id}
                onClick={() => setSelectedMissionId(mission.id)}
                className={`p-5 rounded-xl cursor-pointer border transition-all duration-300 relative overflow-hidden ${
                  selectedMissionId === mission.id 
                  ? 'bg-mission/10 border-mission shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] scale-[1.01]' 
                  : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {/* Active Indicator Line */}
                {selectedMissionId === mission.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-mission shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                )}

                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <p className="hud-title-md text-xl text-gray-200 uppercase tracking-wide">{mission.title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="hud-label-tactical text-[9px] text-gray-500 uppercase border border-white/10 px-2 py-0.5 rounded-sm bg-black/40">
                        {mission.type}
                      </span>
                      
                      {/* ATTRIBUTE BADGE */}
                      {mission.rewardAttribute && mission.rewardAttrValue > 0 && (
                        <span className="hud-label-tactical text-[9px] text-brand uppercase border border-brand/30 px-2 py-0.5 rounded-sm bg-brand/10">
                          +{mission.rewardAttrValue} {ATTRIBUTE_MAP[mission.rewardAttribute]}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="hud-value text-3xl text-mission drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] shrink-0">
                    {mission.xpReward === 9999 ? 'LVL UP' : `+${mission.xpReward} XP`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER: REWARD PREVIEW & ACTIONS */}
        <div className="p-6 bg-black/60 border-t border-white/5 shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Intel Panel */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              {isActive && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg animate-pulse w-fit">
                  <span className="text-emerald-500 text-xs">⚡</span>
                  <span className="hud-label-tactical text-[9px] text-emerald-500 uppercase">
                    {multiplier.label} ATIVO
                  </span>
                </div>
              )}
              
              {selectedMission ? (
                <div className="flex flex-col gap-1">
                  <p className="hud-label-tactical text-gray-500 text-[10px] uppercase">
                    RECOMPENSA CALCULADA:
                  </p>
                  <div className="flex items-center gap-4">
                     <span className="text-white font-bold text-lg font-mono">+{finalXpPreview} XP</span>
                     {selectedMission.rewardAttribute && selectedMission.rewardAttrValue > 0 && (
                       <>
                         <span className="text-white/20">|</span>
                         <span className="text-brand font-bold text-sm tracking-widest uppercase">
                           +{selectedMission.rewardAttrValue} {ATTRIBUTE_MAP[selectedMission.rewardAttribute]}
                         </span>
                       </>
                     )}
                  </div>
                </div>
              ) : (
                <p className="hud-label-tactical text-gray-600 text-[10px] uppercase">
                  Aguardando seleção de missão...
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                type="button" 
                onClick={onClose} 
                disabled={isProcessing}
                className="hud-label-tactical text-xs text-gray-500 hover:text-white px-6 py-4 transition-colors uppercase disabled:opacity-30 border border-transparent hover:border-white/10 rounded-xl"
              >
                Abortar
              </button>
              <button 
                onClick={() => selectedMissionId && onConfirm(selectedMissionId)}
                disabled={!selectedMissionId || isProcessing}
                className="flex-1 md:flex-none px-10 py-4 bg-mission/10 border border-mission/50 hover:bg-mission disabled:bg-white/5 disabled:border-white/5 disabled:text-gray-600 disabled:opacity-50 text-mission hover:text-white hud-title-md text-xl rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                {isProcessing ? "PROCESSANDO..." : "CONFIRMAR"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}