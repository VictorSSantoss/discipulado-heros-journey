"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ESTRUTURAS, ICONS, MISSION_CATEGORIES } from "@/constants/gameConfig";
import { completeMission, deleteMissionTemplate } from "@/app/actions/missionActions";

export default function MissoesClient({ initialMissions, valentes }: any) {
  const sortedInitialMissions = [...initialMissions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const [missions, setMissions] = useState(sortedInitialMissions);
  const [activeFilter, setActiveFilter] = useState("TODAS");
  const [missionSearchQuery, setMissionSearchQuery] = useState(""); 
  const [isProcessing, setIsProcessing] = useState(false);

  // --- DELETE & UNDO STATES ---
  const [missionToConfirm, setMissionToConfirm] = useState<any>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<any>(null);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- MODAL STATE ---
  const [selectedMissionForModal, setSelectedMissionForModal] = useState<any>(null);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalSelectedValente, setModalSelectedValente] = useState("");

  const filteredMissions = useMemo(() => {
    return missions.filter((m: any) => 
      m.title.toLowerCase().includes(missionSearchQuery.toLowerCase())
    );
  }, [missions, missionSearchQuery]);

  const filteredModalValentes = valentes?.filter((v: any) => 
    v.name.toLowerCase().includes(modalSearchQuery.toLowerCase())
  ) || [];

  const handleDeleteClick = (mission: any) => {
    setMissionToConfirm(mission);
  };

  // --- LOGIC: STAGE 2 (Confirm -> Show Undo) ---
  const handleConfirmDelete = () => {
    if (!missionToConfirm) return;

    // Force finalize if another delete is already in the queue
    if (pendingDelete) {
      finalizeDeletion();
    }

    const mission = missionToConfirm;
    setPendingDelete(mission);
    setMissions((prev: any) => prev.filter((m: any) => m.id !== mission.id));
    setMissionToConfirm(null);
    setShowUndo(true);
  };

  // NEW: Reliable timer effect
  useEffect(() => {
    if (showUndo && pendingDelete) {
      // Clear any existing timer first
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      
      // Set the 6-second fuse
      deleteTimerRef.current = setTimeout(() => {
        finalizeDeletion();
      }, 6000);
    }

    return () => { if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current); };
  }, [showUndo, pendingDelete]);

  const finalizeDeletion = async () => {
    // We capture the ID locally before cleaning up state
    const idToDelete = pendingDelete?.id;
    
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    setPendingDelete(null);
    setShowUndo(false);

    if (idToDelete) {
      await deleteMissionTemplate(idToDelete);
    }
  };

  const handleUndo = () => {
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    if (pendingDelete) {
      setMissions((prev: any) => [...prev, pendingDelete].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      setPendingDelete(null);
      setShowUndo(false);
    }
  };

  const handleConfirmModal = async () => {
    if (!modalSelectedValente || !selectedMissionForModal) return;
    setIsProcessing(true);
    await completeMission(modalSelectedValente, selectedMissionForModal.id);
    setIsProcessing(false);
    setSelectedMissionForModal(null);
    setModalSelectedValente("");
    setModalSearchQuery("");
  };

  return (
    <main className="min-h-screen py-6 px-4 md:px-8 max-w-7xl mx-auto text-white font-barlow overflow-x-hidden relative">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="title-block">
          <h1 className="hud-title-lg text-white m-0">MISSÕES DISPONÍVEIS</h1>
          <p className="hud-label-tactical mt-1">O Mural de Desafios do Reino</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-55 group">
            <input 
              type="text"
              placeholder="BUSCAR MISSÃO..."
              value={missionSearchQuery}
              onChange={(e) => setMissionSearchQuery(e.target.value)}
              className="w-full bg-dark-surface border border-mission/30 rounded-full px-5 py-2 text-[15px] font-bebas text-white outline-none focus:border-mission/50 transition-all tracking-[0.2em] pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <img 
                src={ICONS.search}
                alt="Search" 
                className="w-12 h-12 object-contain opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all grayscale brightness-200"
              />
            </div>
          </div>

          <Link 
            href="/admin/missoes/create"
            className="bg-mission hover:brightness-110 text-white hud-title-md px-8 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 group shrink-0 w-full sm:w-auto justify-center"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-300 leading-none">+</span> 
            FORJAR MISSÃO
          </Link>
        </div>
      </header>

      {/* FILTERS */}
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

      {/* GRID */}
      <div className="pb-20">
        {missions.length === 0 ? (
          <div className="bg-dark-bg/40 border border-white/5 border-dashed rounded-2xl p-16 text-center flex flex-col items-center justify-center mt-8">
            <span className="text-6xl mb-4 opacity-20">📜</span>
            <h3 className="hud-title-md text-2xl text-white mb-2 opacity-50">NENHUMA MISSÃO NO BANCO DE DADOS</h3>
          </div>
        ) : activeFilter === "TODAS" ? (
          MISSION_CATEGORIES.map((cat) => {
            const missionsInCat = filteredMissions.filter((m: any) => m.type === cat); 
            if (missionsInCat.length === 0) return null;

            return (
              <section key={cat} className="pt-8 first:pt-0">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="hud-title-md text-white m-0">{cat}</h2>
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
                      onDelete={() => handleDeleteClick(mission)} 
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
                  onDelete={() => handleDeleteClick(mission)} 
                  onOpenModal={() => setSelectedMissionForModal(mission)}
                />
              ))
            }
          </div>
        )}
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {missionToConfirm && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-bg/95 border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden relative p-8 text-center"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              <span className="text-4xl mb-4 block">⚠️</span>
              <h3 className="hud-title-md text-2xl text-white mb-2 uppercase">Arquivar Missão?</h3>
              <p className="font-barlow text-gray-400 mb-8">
                A missão <span className="text-white">"{missionToConfirm.title}"</span> será removida do mural público.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setMissionToConfirm(null)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hud-title-md transition-all"
                >
                  CANCELAR
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white hover:bg-red-500 hud-title-md shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
                >
                  CONFIRMAR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- UNDO NOTIFICATION --- */}
      <AnimatePresence>
        {showUndo && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-dark-surface border border-mission/50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 group"
          >
            <div className="flex flex-col">
              <span className="hud-label-tactical text-[10px] text-gray-500 uppercase">Sistema</span>
              <p className="text-white text-sm font-barlow m-0">Missão deletada. <strong>{pendingDelete?.title}</strong></p>
            </div>
            
            {/* FIXED: Increased pl-10 to give the line more room from the button */}
            <div className="flex items-center gap-4 border-l border-white/10 pl-10">
              <button 
                onClick={handleUndo}
                className="bg-mission text-dark-bg px-4 py-1.5 rounded-lg hud-title-md text-xs hover:brightness-110 transition-all"
              >
                DESFAZER
              </button>
              <button 
                onClick={finalizeDeletion}
                className="text-gray-500 hover:text-white transition-colors p-1"
                title="Fechar e Deletar Agora"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- REWARD MODAL (Fully Intact) --- */}
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
 */
function MissionCard({ mission, onDelete, onOpenModal }: any) {
  const isLvlUp = mission.xpReward === 9999; 
  const isActive = true;

  return (
    <div 
      className={`p-6 rounded-2xl flex flex-col border transition-all shadow-xl group relative overflow-hidden backdrop-blur-xl
        ${isLvlUp ? 'border-brand/20 hover:border-brand/50' : 'border-white/5 hover:border-mission/30'}
      `}
      style={{
        backgroundColor: 'rgba(10, 10, 10, 0.4)',
        backgroundImage: `radial-gradient(circle at 0% 0%, ${isLvlUp ? 'rgba(17,194,199,0.15)' : 'rgba(234,88,12,0.15)'} 0%, transparent 50%)`
      }}
    >
      <div className="relative flex flex-col h-full">
        <div className="flex flex-col mb-6">
          <div className={`hud-value flex items-end ${
            isLvlUp ? 'text-brand drop-shadow-[0_0_12px_rgba(17,194,199,0.4)]' : 'text-xp drop-shadow-[0_0_12px_rgba(234,88,12,0.4)]'
          }`}>
            {!isLvlUp && <span className="text-3xl mr-1 opacity-60 mb-1">+</span>}
            <span>{isLvlUp ? 'LVL UP' : mission.xpReward}</span>
            {!isLvlUp && <span className="font-barlow font-black text-sm ml-1.5 opacity-60 mb-1.5 uppercase tracking-widest">XP</span>}
          </div>
          <div className="flex items-center gap-2 mt-3 bg-dark-bg/60 w-fit px-2.5 py-1 rounded-lg border border-white/5">
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-mission animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'bg-gray-600'}`}></span>
            <span className="hud-label-tactical text-[8px] text-gray-400">{isActive ? 'Missão Disponível' : 'Quest Arquivada'}</span>
          </div>
        </div>
        <h3 className="hud-title-md text-white mb-3 leading-tight group-hover:text-mission transition-colors">{mission.title}</h3>
        <p className="font-barlow text-gray-500 text-[13px] mb-8 flex-1 leading-relaxed border-l border-white/10 pl-4">{mission.description || "Challenge entry under observation."}</p>
        <div className="flex flex-col gap-3 pt-5 border-t border-white/5 mt-auto relative z-20">
          <button onClick={onOpenModal} className="w-full bg-mission/10 text-mission border border-mission/30 hover:bg-mission hover:text-white py-3 rounded-xl hud-title-md transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">CONCEDER XP</button>
          <div className="flex gap-2 mt-1">
            <Link href={`/admin/missoes/${mission.id}/edit`} className="flex-1 bg-dark-bg/80 border border-white/10 text-gray-500 hover:text-mission hover:border-mission/40 py-2.5 rounded-xl hud-label-tactical text-[9px] transition-all text-center flex items-center justify-center">EDITAR QUEST</Link>
            <button onClick={onDelete} className="px-4 bg-dark-bg/80 border border-red-900/20 hover:bg-red-900/10 hover:border-red-500 transition-all rounded-xl flex items-center justify-center group">
              <img src={ICONS.trash} alt="Excluir" className="w-8 h-8 object-contain transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}