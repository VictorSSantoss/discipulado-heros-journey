"use client";

import { useState } from "react";
import EditLevelModal from "@/components/EditLevelModal";
import AddLevelModal from "@/components/AddLevelModal";

/* GLOBAL CONFIGURATION IMPORTS */
/* Synchronizes level progression rules and UI icons from the central configuration. */
import { LEVEL_SYSTEM, ICONS } from "@/constants/gameConfig";

interface Level {
  id: number;
  name: string;
  minXP: number;
  icon: string;
}

/**
 * PatentesPage Component
 * Administrative interface for managing the kingdom's leveling and progression system.
 * Integrated with the centralized HUD Typography System for global style control.
 */
export default function PatentesPage() {
  /* STATE MANAGEMENT */
  const [levels, setLevels] = useState<Level[]>(
    LEVEL_SYSTEM.map((lvl, index) => ({
      id: index + 1,
      name: lvl.name,
      minXP: lvl.minXP,
      icon: lvl.icon
    }))
  );
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  /* MODAL HANDLERS */
  const handleEditClick = (level: Level) => {
    setSelectedLevel(level);
    setIsEditModalOpen(true);
  };

  const handleSaveLevel = (updatedLevel: Level) => {
    setLevels((prev) => prev.map((lvl) => (lvl.id === updatedLevel.id ? updatedLevel : lvl)));
    setIsEditModalOpen(false);
  };

  const handleAddLevel = (newLevel: Level) => {
    setLevels((prev) => [...prev, newLevel].sort((a, b) => a.minXP - b.minXP));
    setIsAddModalOpen(false);
  };

  /* METRICS CALCULATION */
  const maxXP = Math.max(...levels.map(l => l.minXP));
  const totalRanks = levels.length;

  return (
    <>
      <main className="min-h-screen p-6 max-w-6xl mx-auto flex flex-col pb-20 text-white font-barlow">
        {/* PAGE_MASTER_WRAPPER */}
        
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* HIERARCHY_HEADER_BLOCK */}
          <div>
            <h1 className="hud-title-lg text-white m-0 flex items-center gap-4">
              <img src={ICONS.patentes} className="w-12 h-12 object-contain" alt="Patentes" /> 
              HIERARQUIA DO REINO
            </h1>
            <p className="hud-label-tactical mt-2 italic tracking-[0.3em]">
              Gestão de Níveis e Progressão de XP
            </p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto bg-brand hover:brightness-110 text-dark-bg hud-title-md px-8 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(17,194,199,0.3)]"
          >
            + FORJAR NOVO NÍVEL
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* SUMMARY_METRICS_GRID */}
          
          <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 border-l-4 border-l-brand p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <p className="hud-label-tactical">TOTAL DE PATENTES</p>
            <p className="hud-value text-white mt-1 text-4xl">{totalRanks} <span className="text-sm hud-label-tactical text-gray-400 italic-none">NÍVEIS</span></p>
          </div>
          
          <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 border-l-4 border-l-xp p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <p className="hud-label-tactical">META DE ASCENSÃO</p>
            <p className="hud-value text-xp mt-1 text-4xl">{maxXP} <span className="text-sm hud-label-tactical text-gray-600 italic-none">XP</span></p>
          </div>
          
          <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 border-l-4 border-l-mission p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <p className="hud-label-tactical">ESTADO DO SISTEMA</p>
            <p className="hud-value text-mission mt-1 text-4xl uppercase">ATIVO</p>
          </div>
        </div>

        <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* HIERARCHY_LIST_WRAPPER */}
          
          <div className="grid grid-cols-12 gap-4 p-5 bg-dark-bg/80 border-b border-white/10">
            {/* TABLE_COLUMN_LABELS */}
            <div className="col-span-2 hud-label-tactical text-center">ÍCONE</div>
            <div className="col-span-6 hud-label-tactical">DESIGNAÇÃO DA PATENTE</div>
            <div className="col-span-2 hud-label-tactical text-center">REQUISITO (XP)</div>
            <div className="col-span-2 hud-label-tactical text-right">CONTROLE</div>
          </div>

          <div className="flex flex-col divide-y divide-white/5">
            {/* RANKS_ITERATION_AREA */}
            {levels.map((level, index) => (
              <div key={level.id} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/[0.02] transition-all group relative">
                
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="col-span-2 flex justify-center">
                  {/* RANK_ICON_VIEWPORT */}
                  <div 
                    onClick={() => handleEditClick(level)}
                    className="w-16 h-16 bg-dark-bg/80 border border-white/10 hover:border-brand rounded-xl flex items-center justify-center cursor-pointer transition-all relative overflow-hidden shadow-inner"
                  >
                    <img 
                      src={level.icon} 
                      alt={level.name} 
                      className="w-12 h-12 object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)] transition-transform group-hover:scale-110" 
                    />
                    
                    <div className="absolute inset-0 bg-dark-bg/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <span className="hud-label-tactical text-white">EDITAR</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-6 flex flex-col">
                  {/* RANK_IDENTITY_META */}
                  <span className="hud-label-tactical text-brand mb-1 tracking-[0.3em]">RANK 0{index + 1}</span>
                  <span className="hud-title-md text-white">{level.name}</span>
                </div>

                <div className="col-span-2 flex justify-center">
                  {/* XP_REQUIREMENT_INDICATOR */}
                  <div className="bg-dark-bg/80 border border-white/10 px-4 py-3 rounded-xl w-full text-center shadow-inner">
                    <span className="hud-value text-xp text-3xl drop-shadow-[0_0_10px_rgba(234,88,12,0.3)]">{level.minXP}</span>
                    <span className="block hud-label-tactical text-gray-500 mt-1">XP ACUMULADO</span>
                  </div>
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  {/* ACTION_CONTROLS_BLOCK */}
                  <button 
                    onClick={() => handleEditClick(level)}
                    className="group-hover:bg-brand group-hover:text-dark-bg text-gray-400 hud-label-tactical bg-dark-bg/60 px-5 py-2.5 border border-white/10 group-hover:border-brand rounded-xl transition-all shadow-lg italic-none"
                  >
                    EDITAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <EditLevelModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveLevel} level={selectedLevel} />
      <AddLevelModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddLevel} />
    </>
  );
}