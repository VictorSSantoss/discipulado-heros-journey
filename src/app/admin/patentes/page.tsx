"use client";

import { useState } from "react";
import EditLevelModal from "@/components/EditLevelModal";
import AddLevelModal from "@/components/AddLevelModal";

interface Level {
  id: number;
  name: string;
  minXP: number;
  icon: string;
}

const initialLevels: Level[] = [
  { id: 1, name: 'Valente de Nível 0', minXP: 0, icon: '/images/level-0.svg' },
  { id: 2, name: 'Valente de Nível 1', minXP: 1000, icon: '/images/level-1.svg' },
  { id: 3, name: 'Valente de Nível 2', minXP: 2000, icon: '/images/level-2.svg' },
  { id: 4, name: 'Valente de Nível 3', minXP: 3500, icon: '/images/level-3.svg' },
  { id: 5, name: 'Valente Especial', minXP: 5000, icon: '/images/level-special.svg' },
  { id: 6, name: 'Herói do Reino', minXP: 8000, icon: '/images/level-hero.svg' }
];

export default function PatentesPage() {
  const [levels, setLevels] = useState<Level[]>(initialLevels);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

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

  // Stats for the summary bar
  const maxXP = Math.max(...levels.map(l => l.minXP));
  const totalRanks = levels.length;

  return (
    <>
      <main className="min-h-screen p-6 max-w-6xl mx-auto flex flex-col pb-20">
        
        {/* ENHANCED HEADER */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-bebas text-5xl tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(234,88,12,0.2)] m-0 flex items-center gap-4">
              <span className="text-[#ea580c] text-4xl">🏆</span> Hierarquia do Reino
            </h1>
            <p className="font-barlow text-gray-400 mt-1 uppercase tracking-widest font-bold">Gestão de Níveis e Progressão de XP</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto bg-[#ea580c] hover:bg-[#c2410c] text-white font-barlow font-bold px-8 py-3 rounded-sm tracking-widest uppercase text-xs shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            + Forjar Novo Nível
          </button>
        </header>

        {/* NEW SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#232622] border-l-4 border-[#ea580c] p-4 shadow-lg">
            <p className="font-barlow text-gray-500 text-[10px] uppercase font-black tracking-widest">Total de Patentes</p>
            <p className="font-staatliches text-3xl text-white">{totalRanks} Níveis</p>
          </div>
          <div className="bg-[#232622] border-l-4 border-cyan-500 p-4 shadow-lg">
            <p className="font-barlow text-gray-500 text-[10px] uppercase font-black tracking-widest">Meta de Ascensão</p>
            <p className="font-staatliches text-3xl text-white">{maxXP} XP</p>
          </div>
          <div className="bg-[#232622] border-l-4 border-purple-500 p-4 shadow-lg">
            <p className="font-barlow text-gray-500 text-[10px] uppercase font-black tracking-widest">Estado do Sistema</p>
            <p className="font-staatliches text-3xl text-green-400 uppercase tracking-widest">Ativo</p>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="bg-[#1a1c19] border border-gray-800 rounded-sm shadow-2xl overflow-hidden animate-fade-in">
          
          <div className="grid grid-cols-12 gap-4 p-4 bg-[#232622] border-b border-gray-800">
            <div className="col-span-2 font-barlow text-gray-500 text-[10px] uppercase font-black tracking-widest text-center">Ícone</div>
            <div className="col-span-6 font-barlow text-gray-500 text-[10px] uppercase font-black tracking-widest">Designação da Patente</div>
            <div className="col-span-2 font-barlow text-gray-500 text-[10px] uppercase font-black tracking-widest text-center">Requisito (XP)</div>
            <div className="col-span-2 font-barlow text-gray-500 text-[10px] uppercase font-black tracking-widest text-right">Controle</div>
          </div>

          <div className="flex flex-col divide-y divide-gray-800">
            {levels.map((level, index) => (
              <div key={level.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-[#232622]/80 transition-all group relative">
                
                {/* Visual Step Indicator (Timeline) */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ea580c] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="col-span-2 flex justify-center">
                  <div 
                    onClick={() => handleEditClick(level)}
                    className="w-16 h-16 bg-[#1a1c19] border border-gray-700 hover:border-[#ea580c] rounded-sm flex items-center justify-center cursor-pointer transition-all relative overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]"
                  >
                    <span className="text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      {index === 0 ? '🛡️' : index === 1 ? '⚔️' : index === 2 ? '🏹' : index === 3 ? '🦅' : index === 4 ? '🦁' : '👑'}
                    </span>
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-barlow text-white uppercase font-black tracking-widest">EDIT</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-6 flex flex-col">
                  <span className="font-barlow text-[#ea580c] text-[10px] font-black tracking-[0.2em] mb-1">RANK 0{index + 1}</span>
                  <span className="font-bebas text-3xl text-white tracking-widest leading-none">{level.name}</span>
                </div>

                <div className="col-span-2 flex justify-center">
                  <div className="bg-[#232622] border border-gray-800 px-4 py-2 rounded-sm w-full text-center shadow-lg">
                    <span className="font-staatliches text-2xl text-cyan-400 tracking-wider leading-none">{level.minXP}</span>
                    <span className="block text-[8px] font-barlow text-gray-600 uppercase font-black tracking-tighter mt-1">XP ACUMULADO</span>
                  </div>
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  <button 
                    onClick={() => handleEditClick(level)}
                    className="group-hover:bg-[#ea580c] group-hover:text-white text-gray-400 font-barlow font-bold text-[10px] uppercase tracking-widest bg-[#232622] px-4 py-2 border border-gray-700 group-hover:border-[#ea580c] rounded-sm transition-all"
                  >
                    Editar
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