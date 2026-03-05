"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ICONS, MISSION_CATEGORIES } from "@/constants/gameConfig";
import { completeMission, deleteMissionTemplate } from "@/app/actions/missionActions";

export default function MissoesClient({ initialMissions, valentes }: any) {
  const [missions, setMissions] = useState(initialMissions);
  const [activeFilter, setActiveFilter] = useState("TODAS");
  const [missionSearchQuery, setMissionSearchQuery] = useState(""); // New state for searching missions
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal State
  const [selectedMissionForModal, setSelectedMissionForModal] = useState<any>(null);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalSelectedValente, setModalSelectedValente] = useState("");

  // Filter logic for the mission grid
  const filteredMissions = useMemo(() => {
    return missions.filter((m: any) => 
      m.title.toLowerCase().includes(missionSearchQuery.toLowerCase())
    );
  }, [missions, missionSearchQuery]);

  const filteredModalValentes = valentes?.filter((v: any) => 
    v.name.toLowerCase().includes(modalSearchQuery.toLowerCase())
  ) || [];

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente arquivar esta missão das crônicas?")) {
      await deleteMissionTemplate(id);
      setMissions(missions.filter((m: any) => m.id !== id));
    }
  };

  const handleConfirmModal = async () => {
    if (!modalSelectedValente || !selectedMissionForModal) return;
    setIsProcessing(true);
    
    await completeMission(
      modalSelectedValente, 
      selectedMissionForModal.id, 
      selectedMissionForModal.xpReward, 
      selectedMissionForModal.title
    );
    
    setIsProcessing(false);
    setSelectedMissionForModal(null);
    setModalSelectedValente("");
    setModalSearchQuery("");
  };

  return (
    <main className="min-h-screen py-6 px-4 md:px-8 max-w-7xl mx-auto text-white font-barlow overflow-x-hidden relative">
      
      {/* CONTAINER 1: COMPACT HEADER WRAPPER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="title-block">
          <h1 className="hud-title-lg text-white m-0">
            MISSÕES DISPONÍVEIS
          </h1>
          <p className="hud-label-tactical mt-1">
            O Mural de Desafios do Reino
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* NEW MISSION SEARCH BAR */}
          <div className="relative w-full sm:w-64 group">
            <input 
              type="text"
              placeholder="BUSCAR MISSÃO..."
              value={missionSearchQuery}
              onChange={(e) => setMissionSearchQuery(e.target.value)}
              className="w-full bg-dark-bg/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-mission/50 transition-all font-barlow tracking-widest"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">
              🔍
            </div>
          </div>

          <Link 
            href="/admin/missoes/nova"
            className="bg-mission hover:brightness-110 text-white hud-title-md px-8 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 group shrink-0 w-full sm:w-auto justify-center"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-300 leading-none">+</span> 
            FORJAR MISSÃO
          </Link>
        </div>
      </header>

      {/* CONTAINER 2: PROTECTED FILTER TRACK */}
      <nav className="flex gap-2 overflow-x-auto pt-4 pb-4 mb-8 border-b border-white/5 custom-scrollbar px-2 -mt-4">
        <button
          onClick={() => setActiveFilter("TODAS")}
          className={`px-5 py-2 rounded-full hud-label-tactical border transition-all whitespace-nowrap backdrop-blur-md ${
            activeFilter === "TODAS" 
              ? "bg-mission/20 border-mission text-mission shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
              : "bg-dark-bg/60 border-white/5 text-gray-500 hover:text-white"
          }`}
        >
          VER TODAS
        </button>
        
        {MISSION_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-5 py-2 rounded-full hud-label-tactical border transition-all whitespace-nowrap backdrop-blur-md ${
              activeFilter === cat 
                ? "bg-mission/20 border-mission text-mission shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
                : "bg-dark-bg/60 border-white/5 text-gray-500 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* CONTAINER 3: DYNAMIC CONTENT GRID */}
      <div className="pb-20">
        
        {/* EMPTY DATABASE WARNING */}
        {missions.length === 0 ? (
          <div className="bg-dark-bg/40 border border-white/5 border-dashed rounded-2xl p-16 text-center flex flex-col items-center justify-center mt-8">
            <span className="text-6xl mb-4 opacity-20">📜</span>
            <h3 className="hud-title-md text-2xl text-white mb-2 opacity-50">NENHUMA MISSÃO NO BANCO DE DADOS</h3>
            <p className="hud-label-tactical text-gray-500">
              O cofre está vazio. Clique em <strong className="text-mission">"FORJAR MISSÃO"</strong> para criar o primeiro molde.
            </p>
          </div>
        ) : activeFilter === "TODAS" ? (
          MISSION_CATEGORIES.map((cat) => {
            const missionsInCat = filteredMissions.filter((m: any) => m.type === cat); 
            if (missionsInCat.length === 0) return null;

            return (
              <section key={cat} className="pt-8 first:pt-0">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="hud-title-md text-white m-0">
                    {cat}
                  </h2>
                  <div className="h-px bg-gradient-to-r from-white/10 to-transparent flex-1"></div>
                  <span className="font-staatliches tracking-widest text-mission text-xl opacity-80 leading-none">
                    {missionsInCat.length} DISPONÍVEIS
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {missionsInCat.map((mission: any) => (
                    <MissionCard 
                      key={mission.id} 
                      mission={mission} 
                      onDelete={() => handleDelete(mission.id)} 
                      onOpenModal={() => setSelectedMissionForModal(mission)}
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredMissions
              .filter((m: any) => m.type === activeFilter) 
              .map((mission: any) => (
                <MissionCard 
                  key={mission.id} 
                  mission={mission} 
                  onDelete={() => handleDelete(mission.id)} 
                  onOpenModal={() => setSelectedMissionForModal(mission)}
                />
              ))
            }
          </div>
        )}
      </div>

      {/* --- REWARD MODAL --- */}
      {selectedMissionForModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-bg/95 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mission to-transparent"></div>
            
            <div className="p-6 border-b border-white/10 bg-black/40">
              <h3 className="hud-title-md text-2xl text-white mb-1">CONCEDER RECOMPENSA</h3>
              <p className="hud-label-tactical text-mission uppercase tracking-widest">
                {selectedMissionForModal.title} 
                <span className="text-white/50 ml-2">({selectedMissionForModal.xpReward === 9999 ? 'LVL UP' : `+${selectedMissionForModal.xpReward} XP`})</span>
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="hud-label-tactical text-gray-400 mb-2 block">SELECIONAR VALENTE</label>
                <input 
                  type="text" 
                  placeholder="Buscar pelo nome..." 
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-mission font-barlow mb-3 transition-colors placeholder:text-gray-600"
                  autoFocus
                />
                
                <div className="max-h-48 overflow-y-auto custom-scrollbar border border-white/5 rounded-xl bg-black/20">
                  {filteredModalValentes.length > 0 ? (
                    filteredModalValentes.map((v: any) => (
                      <button
                        key={v.id}
                        onClick={() => setModalSelectedValente(v.id)}
                        className={`w-full text-left px-4 py-3 text-sm font-barlow uppercase tracking-widest border-b border-white/5 last:border-0 transition-colors ${
                          modalSelectedValente === v.id 
                            ? 'bg-mission/20 text-mission border-mission/50' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {v.name}
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-xs uppercase tracking-widest">
                      Nenhum valente encontrado
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-black/40 flex gap-3">
              <button 
                onClick={() => {
                  setSelectedMissionForModal(null);
                  setModalSelectedValente("");
                  setModalSearchQuery("");
                }}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hud-title-md transition-all"
              >
                CANCELAR
              </button>
              <button 
                onClick={handleConfirmModal}
                disabled={!modalSelectedValente || isProcessing}
                className="flex-1 py-3 rounded-xl bg-mission text-dark-bg hover:brightness-125 hud-title-md shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
              >
                {isProcessing ? "PROCESSANDO..." : "CONFIRMAR"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

/**
 * MissionCard Sub-Component
 * Fixed: Glow bleeding out by using a contained overflow container for the background.
 */
function MissionCard({ mission, onDelete, onOpenModal }: { mission: any, onDelete: () => void, onOpenModal: () => void }) {
  const isLvlUp = mission.xpReward === 9999; 
  const isActive = true;

  return (
    <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col hover:border-mission/30 transition-all shadow-xl group relative overflow-hidden">
      
      {/* PERFECTLY CLIPPED GLOW CONTAINER - Fixed with overflow-hidden on parent */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute -top-12 -left-12 w-40 h-40 blur-[50px] opacity-10 rounded-full ${
          isLvlUp ? 'bg-brand' : 'bg-xp'
        }`}></div>
      </div>

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-col mb-6">
          <div className={`hud-value flex items-end ${
            isLvlUp ? 'text-brand drop-shadow-[0_0_12px_rgba(17,194,199,0.4)]' : 'text-xp drop-shadow-[0_0_12px_rgba(234,88,12,0.4)]'
          }`}>
            {!isLvlUp && <span className="text-3xl mr-1 opacity-60 mb-1">+</span>}
            <span>{isLvlUp ? 'LVL UP' : mission.xpReward}</span>
            {!isLvlUp && <span className="font-barlow font-black text-sm ml-1.5 opacity-60 mb-1.5 uppercase tracking-widest">XP</span>}
          </div>

          <div className="flex items-center gap-2 mt-3 bg-dark-bg/60 w-fit px-2.5 py-1 rounded-lg border border-white/5">
            <span className={`w-1.5 h-1.5 rounded-full ${
              isActive ? 'bg-mission animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'bg-gray-600'
            }`}></span>
            <span className="hud-label-tactical text-[8px] text-gray-400">
              {isActive ? 'Molde Disponível' : 'Quest Arquivada'}
            </span>
          </div>
        </div>

        <h3 className="hud-title-md text-white mb-3 leading-tight group-hover:text-mission transition-colors">
          {mission.title}
        </h3>

        <p className="font-barlow text-gray-500 text-[13px] mb-8 flex-1 leading-relaxed border-l border-white/10 pl-4">
          {mission.description || "Challenge entry under observation."}
        </p>

        {/* --- ACTIONS WRAPPER --- */}
        <div className="flex flex-col gap-3 pt-5 border-t border-white/5 mt-auto relative z-20">
          
          <button 
            onClick={onOpenModal}
            className="w-full bg-mission/10 text-mission border border-mission/30 hover:bg-mission hover:text-white py-3 rounded-xl hud-title-md transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            CONCEDER XP
          </button>

          {/* EDIT/DELETE BUTTONS */}
          <div className="flex gap-2 mt-1">
            <Link 
              href={`/admin/missoes/${mission.id}/edit`}
              className="flex-1 bg-dark-bg/80 border border-white/10 text-gray-500 hover:text-mission hover:border-mission/40 py-2.5 rounded-xl hud-label-tactical text-[9px] transition-all text-center flex items-center justify-center"
            >
              EDITAR QUEST
            </Link>
            <button 
              onClick={onDelete}
              className="px-4 bg-dark-bg/80 border border-red-900/20 hover:bg-red-900/10 hover:border-red-500 transition-all rounded-xl flex items-center justify-center group"
            >
              <img 
                src={ICONS.trash} 
                alt="Excluir" 
                className="w-4 h-4 object-contain opacity-50 group-hover:opacity-100 transition-opacity" 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}