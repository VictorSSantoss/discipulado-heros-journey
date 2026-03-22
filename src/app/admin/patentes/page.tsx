"use client";

import { useState, useEffect } from "react";
import EditLevelModal from "@/components/EditLevelModal";
import AddLevelModal from "@/components/AddLevelModal";
import { ICONS } from "@/constants/gameConfig";

/* Interface representing the Patente model from the database */
interface Patente {
  id: string;
  level: number;
  title: string;
  xpRequired: number;
  tierColor: string;
  iconUrl: string;
}

/**
 * PatentesPage Component
 * Provides an administrative interface to manage the 50-level hierarchy.
 */
export default function PatentesPage() {
  const [patentes, setPatentes] = useState<Patente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatente, setSelectedPatente] = useState<Patente | null>(null);

  /* Fetches the list of ranks from the backend API on component mount */
  useEffect(() => {
    async function fetchPatentes() {
      try {
        const response = await fetch('/api/patentes');
        
        if (!response.ok) {
          const text = await response.text();
          console.error("Server returned an error:", text);
          return;
        }

        const data = await response.json();
        setPatentes(data);
      } catch (error) {
        console.error("Failed to load ranks:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPatentes();
  }, []);

  const handleEditClick = (patente: Patente) => {
    setSelectedPatente(patente);
    setIsEditModalOpen(true);
  };

  const handleSavePatente = (updated: Patente) => {
    setPatentes((prev) => 
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setIsEditModalOpen(false);
  };

  /* Dispatches a DELETE request and updates the local list */
  const handleDeletePatente = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar esta patente? Isso pode afetar os Valentes vinculados a ela.")) {
      return;
    }

    try {
      const response = await fetch(`/api/patentes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPatentes(prev => prev.filter(p => p.id !== id));
      } else {
        console.error("Failed to delete rank on the server.");
      }
    } catch (error) {
      console.error("Network error during deletion:", error);
    }
  };

  const handleAddPatente = (newPatente: Patente) => {
    setPatentes((prev) => 
      [...prev, newPatente].sort((a, b) => a.level - b.level)
    );
    setIsAddModalOpen(false);
  };

  const maxXP = patentes.length > 0 ? Math.max(...patentes.map(p => p.xpRequired)) : 0;
  const totalRanks = patentes.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
        <p className="hud-label-tactical animate-pulse">CARREGANDO HIERARQUIA...</p>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen p-6 max-w-6xl mx-auto flex flex-col pb-20 text-white font-barlow">
        
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="hud-title-lg text-white m-0 flex items-center gap-4">
              <img src={ICONS.patentes} className="w-12 h-12 object-contain" alt="Patentes" /> 
              PATENTES DO REINO
            </h1>
            <p className="hud-label-tactical mt-2 italic tracking-[0.3em]">
              Gestão Dinâmica de Progressão e Títulos
            </p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto bg-brand hover:brightness-110 text-dark-bg hud-title-md px-8 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(17,194,199,0.3)]"
          >
            + FORJAR NOVO NÍVEL
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 border-l-4 border-l-brand p-6 rounded-2xl">
            <p className="hud-label-tactical text-gray-400">TOTAL DE NÍVEIS</p>
            <p className="hud-value text-white mt-1 text-4xl">{totalRanks}</p>
          </div>
          
          <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 border-l-4 border-l-xp p-6 rounded-2xl">
            <p className="hud-label-tactical text-gray-400">REQUISITO MÁXIMO</p>
            <p className="hud-value text-xp mt-1 text-4xl">{maxXP.toLocaleString()} XP</p>
          </div>
          
          <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 border-l-4 border-l-mission p-6 rounded-2xl">
            <p className="hud-label-tactical text-gray-400">ESTADO DO MOTOR</p>
            <p className="hud-value text-mission mt-1 text-4xl uppercase">DINÂMICO</p>
          </div>
        </div>

        {/* Ranks Table */}
        <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-5 bg-dark-bg/80 border-b border-white/10">
            <div className="col-span-2 hud-label-tactical text-center">ÍCONE</div>
            <div className="col-span-5 hud-label-tactical">RANK E DESIGNAÇÃO</div>
            <div className="col-span-2 hud-label-tactical text-center">XP NECESSÁRIO</div>
            <div className="col-span-3 hud-label-tactical text-right pr-4">AÇÕES</div>
          </div>

          <div className="flex flex-col divide-y divide-white/5">
            {patentes.map((patente) => (
              <div 
                key={patente.id} 
                className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/[0.02] transition-all group relative"
              >
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 transition-opacity opacity-50 group-hover:opacity-100" 
                  style={{ backgroundColor: patente.tierColor }}
                ></div>

                <div className="col-span-2 flex justify-center">
                  <div 
                    onClick={() => handleEditClick(patente)}
                    className="w-16 h-16 bg-dark-bg/80 border border-white/10 hover:border-brand rounded-xl flex items-center justify-center cursor-pointer transition-all relative overflow-hidden"
                    style={{ borderColor: `${patente.tierColor}33` }}
                  >
                    <img src={patente.iconUrl} alt="" className="w-12 h-12 object-contain transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-dark-bg/90 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="hud-label-tactical text-white text-[10px]">VER</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-5 flex flex-col">
                  <span className="hud-label-tactical mb-1 tracking-[0.3em]" style={{ color: patente.tierColor }}>
                    RANK {patente.level < 10 ? `0${patente.level}` : patente.level}
                  </span>
                  <span className="hud-title-md text-white">{patente.title}</span>
                </div>

                <div className="col-span-2 flex justify-center">
                  <div className="bg-dark-bg/80 border border-white/10 px-4 py-3 rounded-xl w-full text-center">
                    <span className="hud-value text-xp text-2xl" style={{ color: patente.tierColor }}>
                      {patente.xpRequired.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* ACTIONS COLUMN: Adjusted to 3 cols to fit both buttons comfortably */}
                <div className="col-span-3 flex justify-end items-center gap-3 pr-2">
                  <button 
                    onClick={() => handleEditClick(patente)}
                    className="text-gray-400 hud-label-tactical bg-dark-bg/60 px-5 py-2.5 border border-white/10 hover:border-white/40 rounded-xl transition-all"
                  >
                    AJUSTAR
                  </button>
                  
                  {/* INTEGRATED DELETE BUTTON */}
                  <button 
                    onClick={() => handleDeletePatente(patente.id)}
                    className="text-red-500 hover:text-red-400 transition-colors p-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/30"
                    title="Deletar Patente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedPatente && (
        <EditLevelModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSave={handleSavePatente} 
          patente={selectedPatente} 
        />
      )}

      <AddLevelModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddPatente} 
        nextLevel={patentes.length + 1} 
      />
    </>
  );
}