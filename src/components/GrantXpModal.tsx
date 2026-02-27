"use client";

import { useState } from "react";
import { mockMissions } from "@/lib/mockData";

// 1. PROFESSIONAL STANDARD: Names match exactly with [id]/page.tsx
interface GrantXpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGrant: (amount: number) => void; // Changed from onGrantXp
  valenteName: string;
}

export default function GrantXpModal({ isOpen, onClose, onGrant, valenteName }: GrantXpModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMissionId, setSelectedMissionId] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("TODAS");

  if (!isOpen) return null;

  const categories = ["TODAS", "Hábitos Espirituais", "Evangelismo e Liderança", "Conhecimento", "Estrutura e Participação", "Eventos e Especiais"];

  const filteredMissions = mockMissions.filter(mission => {
    const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "TODAS" || mission.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mission = mockMissions.find(m => m.id === selectedMissionId);
    
    if (mission) {
      // 2. THE LOGIC FIX: If it's a direct level up, we grant enough XP to fill the bar (2000)
      const xpValue = mission.xpReward === 'LVL UP DIRETO' ? 2000 : mission.xpReward as number;
      
      onGrant(xpValue); // Sends the exact number back to the profile page
      setSelectedMissionId(""); // Resets selection for next time
      setSearchTerm("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1c19] border border-gray-700 rounded-sm w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-[#232622] flex justify-between items-center">
          <div>
            <h2 className="font-bebas text-3xl text-white tracking-widest leading-none">CONCEDER XP</h2>
            <p className="font-barlow text-[#ea580c] font-bold text-xs uppercase tracking-widest mt-1">
              Recompensar {valenteName}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-gray-800 space-y-3">
          <input 
            type="text" 
            placeholder="BUSCAR MISSÃO..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#232622] border border-gray-700 p-3 rounded-sm text-white font-barlow text-sm outline-none focus:border-[#ea580c] transition-colors"
          />
          
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-sm font-barlow font-bold text-[10px] uppercase tracking-widest transition-all ${
                  filterCategory === cat ? 'bg-[#ea580c] text-white' : 'bg-[#232622] text-gray-400 border border-gray-700 hover:border-gray-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Missions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {filteredMissions.length === 0 ? (
            <p className="text-center text-gray-500 font-barlow italic py-10">Nenhuma missão encontrada...</p>
          ) : (
            filteredMissions.map((mission) => (
              <div 
                key={mission.id}
                onClick={() => setSelectedMissionId(mission.id)}
                className={`p-3 rounded-sm cursor-pointer border transition-all ${
                  selectedMissionId === mission.id ? 'bg-[#ea580c]/20 border-[#ea580c]' : 'bg-[#232622] border-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-barlow font-bold text-gray-200 text-sm">{mission.title}</p>
                    <p className="font-barlow text-gray-500 text-[10px] uppercase tracking-widest">{mission.category}</p>
                  </div>
                  <span className="font-bebas text-xl text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]">
                    {mission.xpReward === 'LVL UP DIRETO' ? 'LVL UP' : `+${mission.xpReward} XP`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#232622] border-t border-gray-800 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white transition-colors font-barlow font-bold uppercase text-xs tracking-widest px-4">
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!selectedMissionId}
            className="px-8 py-2 bg-[#ea580c] hover:bg-[#c2410c] disabled:bg-gray-700 disabled:text-gray-500 text-white font-barlow font-bold rounded-sm uppercase text-xs tracking-widest transition-colors shadow-lg"
          >
            Confirmar Recompensa
          </button>
        </div>

      </div>
    </div>
  );
}