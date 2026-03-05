"use client";

import { useState } from "react";
import { mockMissions } from "@/lib/mockData";
import { GET_XP_MULTIPLIER } from "@/constants/gameConfig";

interface GrantXpModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Atualizado para aceitar o motivo (reason) exigido pelo ProfileClient
  onGrant: (amount: number, reason: string) => void; 
  valenteName: string;
}

export default function GrantXpModal({ isOpen, onClose, onGrant, valenteName }: GrantXpModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMissionId, setSelectedMissionId] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("TODAS");

  const multiplier = GET_XP_MULTIPLIER();
  const isActive = multiplier.factor > 1;

  if (!isOpen) return null;

  const categories = ["TODAS", "Hábitos Espirituais", "Evangelismo e Liderança", "Conhecimento", "Estrutura e Participação", "Eventos e Especiais"];

  const filteredMissions = mockMissions.filter(mission => {
    const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "TODAS" || mission.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedMission = mockMissions.find(m => m.id === selectedMissionId);
  const baseXp = selectedMission 
    ? (selectedMission.xpReward === 'LVL UP DIRETO' ? 2000 : selectedMission.xpReward as number)
    : 0;
  const finalXpPreview = Math.floor(baseXp * multiplier.factor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMission) {
      // Integração: Enviando o valor calculado e o Título da Missão como motivo
      onGrant(finalXpPreview, `Missão: ${selectedMission.title}`);
      
      setSelectedMissionId("");
      setSearchTerm("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-bg border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-xp/40 to-transparent"></div>
        
        <div className="p-6 border-b border-white/5 bg-dark-bg/80 flex justify-between items-center">
          <div>
            <h2 className="hud-title-md text-3xl text-white m-0">CONCEDER XP</h2>
            <p className="hud-label-tactical text-sm text-white/50 mt-1 italic-none">
              Recompensar {valenteName}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl">
            ✕
          </button>
        </div>

        <div className="p-6 border-b border-white/5 space-y-5">
          <input 
            type="text" 
            placeholder="BUSCAR MISSÃO..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-bg/60 border border-white/10 p-5 rounded-xl text-white hud-label-tactical text-sm outline-none focus:border-xp/50 transition-all shadow-inner placeholder:opacity-20 italic-none"
          />
          
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full hud-label-tactical text-[11px] transition-all border italic-none ${
                  filterCategory === cat 
                  ? 'bg-xp border-xp text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' 
                  : 'bg-dark-bg/60 text-gray-500 border-white/5 hover:text-white'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {filteredMissions.length === 0 ? (
            <p className="hud-label-tactical text-lg text-center text-gray-500 py-12 italic-none">Nenhuma missão encontrada...</p>
          ) : (
            filteredMissions.map((mission) => (
              <div 
                key={mission.id}
                onClick={() => setSelectedMissionId(mission.id)}
                className={`p-5 rounded-xl cursor-pointer border transition-all shadow-md ${
                  selectedMissionId === mission.id 
                  ? 'bg-xp/10 border-xp shadow-[inset_0_0_15px_rgba(234,88,12,0.1)]' 
                  : 'bg-dark-bg/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="hud-title-md text-xl text-gray-200">{mission.title}</p>
                    <p className="hud-label-tactical text-[11px] mt-2 italic-none text-gray-500">{mission.category}</p>
                  </div>
                  <span className="hud-value text-3xl text-brand drop-shadow-[0_0_10px_rgba(17,194,199,0.5)]">
                    {mission.xpReward === 'LVL UP DIRETO' ? 'LVL UP' : `+${mission.xpReward} XP`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-dark-bg/80 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            <div className="flex flex-col gap-1">
              {isActive && (
                <div className="flex items-center gap-2 bg-brand/10 border border-brand/30 px-3 py-1 rounded-lg animate-pulse w-fit">
                  <span className="text-brand text-xs">⚡</span>
                  <span className="hud-label-tactical text-[10px] text-brand">
                    {multiplier.label} ATIVO
                  </span>
                </div>
              )}
              
              {selectedMissionId && (
                <p className="hud-label-tactical text-gray-400 text-xs italic-none">
                  VALOR FINAL: <span className="text-white text-sm">+{finalXpPreview} XP</span>
                </p>
              )}
            </div>

            <div className="flex gap-5 w-full md:w-auto">
              <button 
                type="button" 
                onClick={onClose} 
                className="hud-label-tactical text-sm text-gray-500 hover:text-white px-5 transition-colors italic-none"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!selectedMissionId}
                className="flex-1 md:flex-none px-12 py-3.5 bg-xp hover:brightness-110 disabled:bg-gray-800 disabled:text-gray-600 disabled:opacity-50 text-white hud-title-md text-xl rounded-xl transition-all shadow-[0_0_25px_rgba(234,88,12,0.4)]"
              >
                Confirmar Recompensa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}