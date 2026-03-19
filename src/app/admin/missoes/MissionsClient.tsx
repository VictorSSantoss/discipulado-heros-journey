"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ICONS, MISSION_CATEGORIES, ATTRIBUTE_MAP } from "@/constants/gameConfig";
import { completeMission, deleteMissionTemplate } from "@/app/actions/missionActions";
import { toggleTrackedMission } from "@/app/actions/valenteActions";

/**
 * Permission interface to define available interactions for the current user.
 */
export interface MissionPermissions {
  canManage: boolean;
  valenteId?: string;
}

/**
 * Wrapper component to facilitate search parameter access and provide a loading fallback.
 */
function MissionsWrapper(props: any) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-bg" />}>
      <MissoesContent {...props} />
    </Suspense>
  );
}

/**
 * Primary logical component for filtering, searching, and displaying missions.
 */
function MissoesContent({ 
  initialMissions, 
  valentes,
  permissions = { canManage: true }
}: {
  initialMissions: any[],
  valentes?: any[],
  permissions?: MissionPermissions
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const sortedInitialMissions = [...initialMissions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const [missions, setMissions] = useState(sortedInitialMissions);
  const [activeFilter, setActiveFilter] = useState("TODAS");
  const [missionSearchQuery, setMissionSearchQuery] = useState(""); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const [missionToConfirm, setMissionToConfirm] = useState<any>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<any>(null);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedMissionForModal, setSelectedMissionForModal] = useState<any>(null);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalSelectedValente, setModalSelectedValente] = useState("");

  // Notification state for the pin limit
  const [pinLimitNotice, setPinLimitNotice] = useState<string | null>(null);

  // Auto-clear pin limit notice
  useEffect(() => {
    if (pinLimitNotice) {
      const timer = setTimeout(() => setPinLimitNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [pinLimitNotice]);

  useEffect(() => {
    if (highlightId) {
      setActiveFilter("TODAS");
      setMissionSearchQuery("");
      setHighlightedId(highlightId);

      const timer = setTimeout(() => {
        const element = document.getElementById(highlightId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [highlightId]);

  useEffect(() => {
    if (!highlightedId) return;

    const handleGlobalClick = () => {
      setHighlightedId(null);
    };

    const timeout = setTimeout(() => {
      window.addEventListener("click", handleGlobalClick);
    }, 200);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [highlightedId]);

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

  const handleConfirmDelete = () => {
    if (!missionToConfirm) return;
    if (pendingDelete) finalizeDeletion();

    const mission = missionToConfirm;
    setPendingDelete(mission);
    setMissions((prev: any) => prev.filter((m: any) => m.id !== mission.id));
    setMissionToConfirm(null);
    setShowUndo(true);
  };

  useEffect(() => {
    if (showUndo && pendingDelete) {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = setTimeout(() => finalizeDeletion(), 6000);
    }
    return () => { if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current); };
  }, [showUndo, pendingDelete]);

  const finalizeDeletion = async () => {
    const idToDelete = pendingDelete?.id;
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    setPendingDelete(null);
    setShowUndo(false);
    if (idToDelete) await deleteMissionTemplate(idToDelete);
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

  // Handles the logic for a player tracking a mission
  const handleTogglePin = async (missionId: string) => {
    if (!permissions.valenteId) return;
    
    const result = await toggleTrackedMission(permissions.valenteId, missionId);
    if (result.success) {
      router.refresh();
    } else if (result.message) {
      setPinLimitNotice(result.message);
    }
  };

  return (
    <main className="min-h-screen py-6 px-4 md:px-8 max-w-7xl mx-auto text-white font-barlow overflow-x-hidden relative">
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes target-pulse {
          0% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0.7); transform: scale(1.05); }
          50% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); transform: scale(1.06); }
          100% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0); transform: scale(1.05); }
        }
        .mission-highlight-active {
          animation: target-pulse 2s infinite ease-in-out;
          border-color: #10b981 !important;
          z-index: 50 !important;
        }
      `}} />

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="title-block">
          <h1 className="hud-title-lg text-white m-0 uppercase tracking-widest">
            {permissions.canManage ? "Gerenciar Missões" : "Mural de Decretos"}
          </h1>
          <p className="hud-label-tactical mt-1">Acervo de Desafios Ativos no Reino</p>
        </div>
        
        {permissions.canManage && (
          <Link 
            href="/admin/missoes/create"
            className="bg-mission hover:brightness-110 text-white hud-title-md px-8 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 group shrink-0 w-full md:w-auto justify-center"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-300 leading-none">+</span> 
            FORJAR MISSÃO
          </Link>
        )}
      </header>

      <div className="relative mb-8 max-w-2xl">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <img src={ICONS.search} alt="" className="w-[62px] h-[62px] drop-shadow-[0_0_8px_rgba(17,194,199,0.5)] object-contain" />
        </div>
        <input 
          type="text"
          placeholder="BUSCAR NO MURAL DE DESAFIOS..."
          value={missionSearchQuery}
          onChange={(e) => setMissionSearchQuery(e.target.value)}
          style={{ paddingLeft: '90px' }} 
          className="w-full bg-brand/10 border border-white/10 rounded-xl py-5 pr-6 text-xs font-barlow tracking-widest outline-none focus:border-mission/60 transition-all text-white placeholder:text-gray-600 uppercase shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
        />
      </div>

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

      <div className="pb-20">
        {missions.length === 0 ? (
          <div className="bg-dark-bg/40 border border-white/5 border-dashed rounded-2xl p-16 text-center flex flex-col items-center justify-center mt-8">
            <h3 className="hud-title-md text-2xl text-white mb-2 opacity-50 uppercase tracking-widest">Nenhuma missão no mural</h3>
          </div>
        ) : activeFilter === "TODAS" ? (
          MISSION_CATEGORIES.map((cat) => {
            const missionsInCat = filteredMissions.filter((m: any) => m.type === cat); 
            if (missionsInCat.length === 0) return null;

            return (
              <section key={cat} className="pt-8 first:pt-0 overflow-visible">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="hud-title-md text-white m-0 uppercase tracking-widest">{cat}</h2>
                  <div className="h-px bg-gradient-to-r from-white/10 to-transparent flex-1"></div>
                  <span className="font-staatliches tracking-widest text-mission text-xl opacity-80 leading-none">
                    {missionsInCat.length} DISPONÍVEIS
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible">
                  {missionsInCat.map((mission: any) => (
                    <MissionCard 
                      key={mission.id} 
                      mission={mission} 
                      isHighlighted={highlightedId === mission.id}
                      permissions={permissions}
                      onDelete={() => handleDeleteClick(mission)} 
                      onOpenModal={() => setSelectedMissionForModal(mission)}
                      onTogglePin={() => handleTogglePin(mission.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 overflow-visible">
            {filteredMissions
              .filter((m: any) => m.type === activeFilter) 
              .map((mission: any) => (
                <MissionCard 
                  key={mission.id} 
                  mission={mission} 
                  isHighlighted={highlightedId === mission.id}
                  permissions={permissions}
                  onDelete={() => handleDeleteClick(mission)} 
                  onOpenModal={() => setSelectedMissionForModal(mission)}
                  onTogglePin={() => handleTogglePin(mission.id)}
                />
              ))
            }
          </div>
        )}
      </div>

      <AnimatePresence>
        {permissions.canManage && missionToConfirm && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-bg/95 border border-white/10 rounded-3xl w-full max-sm shadow-2xl overflow-hidden relative p-8 text-center"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              <h3 className="hud-title-md text-2xl text-white mb-2 uppercase">Arquivar Missão?</h3>
              <p className="font-barlow text-gray-400 mb-8">
                A missão <span className="text-white">"{missionToConfirm.title}"</span> será removida do mural público.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setMissionToConfirm(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hud-title-md transition-all">CANCELAR</button>
                <button onClick={handleConfirmDelete} className="flex-1 py-3 rounded-xl bg-red-600 text-white hover:bg-red-500 hud-title-md shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all">CONFIRMAR</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {permissions.canManage && showUndo && (
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
            <div className="flex items-center gap-4 border-l border-white/10 pl-10">
              <button onClick={handleUndo} className="bg-mission text-dark-bg px-4 py-1.5 rounded-lg hud-title-md text-xs hover:brightness-110 transition-all">DESFAZER</button>
              <button onClick={finalizeDeletion} className="text-gray-500 hover:text-white transition-colors p-1">✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {permissions.canManage && selectedMissionForModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-bg/95 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mission to-transparent"></div>
            <div className="p-6 border-b border-white/10 bg-black/40">
              <h3 className="hud-title-md text-2xl text-white mb-1 uppercase">Conceder Recompensa</h3>
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
                            ? 'bg-brand/20 text-mission border-mission/50' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {v.name}
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-xs uppercase tracking-widest">Nenhum valente encontrado</div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 bg-black/40 flex gap-3">
              <button onClick={() => { setSelectedMissionForModal(null); setModalSelectedValente(""); setModalSearchQuery(""); }} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hud-title-md transition-all">CANCELAR</button>
              <button onClick={handleConfirmModal} disabled={!modalSelectedValente || isProcessing} className="flex-1 py-3 rounded-xl bg-mission text-dark-bg hover:brightness-125 hud-title-md shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                {isProcessing ? "PROCESSANDO..." : "CONFIRMAR"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification toast for the limit */}
      <AnimatePresence>
        {pinLimitNotice && (
          <motion.div 
            initial={{ y: 100, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 50, opacity: 0, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[300] bg-dark-bg/95 border border-amber-500/50 px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)] flex items-center gap-4 backdrop-blur-xl"
          >
            <div className="flex flex-col">
              <span className="hud-label-tactical text-[10px] text-amber-500 uppercase tracking-[0.2em] font-black">Aviso do Sistema</span>
              <p className="text-white text-sm font-barlow m-0 uppercase tracking-tighter">
                {pinLimitNotice}
              </p>
            </div>
            <button 
              onClick={() => setPinLimitNotice(null)} 
              className="text-gray-500 hover:text-white transition-colors ml-4"
            >
              ✕
            </button>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/**
 * Renders individual mission cards with strict color differentiation.
 */
function MissionCard({ mission, isHighlighted, permissions, onDelete, onOpenModal, onTogglePin }: any) {
  const isLvlUp = mission.xpReward === 9999; 
  const triggerTypeNormalized = String(mission.triggerType || "MANUAL").toUpperCase().trim();
  const isAutomaticFriendGoal = triggerTypeNormalized !== "MANUAL";
  
  // Forces evaluation of the string safely. If missing, defaults to NONE.
  const rawPeriodicity = mission.periodicity ? String(mission.periodicity).toUpperCase().trim() : "NONE";

  // Check for the 4 special time-gated categories.
  const isSpecialCycle = ["DAILY", "WEEKLY", "MONTHLY", "EVENT"].includes(rawPeriodicity);

  // Determine the card's theme properties
  const getCardTheme = () => {
    // Priority 1: Level Up
    if (isLvlUp) return { 
      border: 'border-brand/30 hover:border-brand/60', 
      text: 'text-brand', 
      glow: 'rgba(17,194,199,0.2)', 
      shadow: 'rgba(17,194,199,0.5)',
      badgeBg: 'bg-brand/10',
      badgeText: 'text-brand',
      badgeBorder: 'border-brand/30'
    };

    // Priority 2: Special Cycles 
    if (isSpecialCycle) return {
      border: 'border-amber-500/50 hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.1)]',
      text: 'text-amber-400',
      glow: 'rgba(245, 158, 11, 0.25)',
      shadow: 'rgba(245, 158, 11, 0.6)',
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-400',
      badgeBorder: 'border-amber-500/50'
    };

    // Priority 3: Automated
    if (isAutomaticFriendGoal) return { 
      border: 'border-indigo-500/40 hover:border-indigo-400/70', 
      text: 'text-indigo-400', 
      glow: 'rgba(99, 102, 241, 0.25)', 
      shadow: 'rgba(99, 102, 241, 0.6)',
      badgeBg: 'bg-indigo-500/10',
      badgeText: 'text-indigo-400',
      badgeBorder: 'border-indigo-500/30'
    };

    // Default Fallback: Standard Normal Mission
    return { 
      border: 'border-white/10 hover:border-mission/40', 
      text: 'text-mission', 
      glow: 'rgba(16,185,129,0.15)', 
      shadow: 'rgba(16,185,129,0.4)',
      badgeBg: 'bg-white/5',
      badgeText: 'text-gray-400',
      badgeBorder: 'border-white/10'
    };
  };

  const theme = getCardTheme();

  const getBadgeLabel = () => {
    if (rawPeriodicity === "DAILY") return "DECRETO DIÁRIO";
    if (rawPeriodicity === "WEEKLY") return "DECRETO SEMANAL";
    if (rawPeriodicity === "MONTHLY") return "DECRETO MENSAL";
    if (rawPeriodicity === "EVENT") return "EVENTO TEMPORÁRIO";
    if (isAutomaticFriendGoal) return 'SISTEMA AUTOMÁTICO';
    return "DECRETO PERMANENTE";
  };

  return (
    <div 
      id={mission.id}
      className={`p-6 rounded-2xl flex flex-col border transition-all shadow-xl group relative backdrop-blur-xl ${theme.border} ${isHighlighted ? 'mission-highlight-active ring-4 ring-mission ring-offset-4 ring-offset-black' : 'overflow-hidden'}`}
      style={{
        // Balances the background color for special cycles to match the others
        backgroundColor: 'rgba(10, 10, 10, 0.4)',
        backgroundImage: `radial-gradient(circle at 0% 0%, ${theme.glow} 0%, transparent 50%)`
      }}
    >
      {/* Decorative Top Line for Special Cycles */}
      {isSpecialCycle && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
      )}

      <div className="relative flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className={`hud-value flex items-end ${theme.text} drop-shadow-[0_0_12px_${theme.shadow}]`}>
            {!isLvlUp && <span className="text-3xl mr-1 opacity-60 mb-1">+</span>}
            <span>{isLvlUp ? 'LVL UP' : mission.xpReward}</span>
            {!isLvlUp && <span className="font-barlow font-black text-sm ml-1.5 opacity-60 mb-1.5 uppercase tracking-widest">XP</span>}
          </div>
          
          {/* Tracking button visible only to players */}
          {!permissions.canManage && permissions.valenteId && (
            <button 
              type="button"
              onClick={onTogglePin}
              className="hud-label-tactical text-[10px] text-white/40 hover:text-white transition-all flex items-center gap-1.5 font-black drop-shadow-[0_0_8px_rgba(17,194,199,0.4)]"
            >
              ☆ FIXAR
            </button>
          )}
        </div>
        
        <div className={`flex items-center gap-2 mb-3 w-fit px-2.5 py-1 rounded-lg border shadow-[0_0_10px_${theme.shadow}] ${theme.badgeBg} ${theme.badgeBorder}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current ${theme.badgeText}`}></span>
          <span className={`hud-label-tactical text-[8px] uppercase tracking-widest font-black ${theme.badgeText}`}>
            {getBadgeLabel()}
          </span>
        </div>

        <h3 className={`hud-title-md text-white mb-3 leading-tight transition-colors ${isSpecialCycle ? 'group-hover:text-amber-400' : 'group-hover:text-mission'}`}>
          {mission.title}
        </h3>
        <p className={`font-barlow text-[13px] mb-6 leading-relaxed border-l-2 pl-4 uppercase tracking-tighter ${isSpecialCycle ? 'text-amber-200/50 border-amber-500/30' : 'text-gray-400 border-white/10'}`}>
          {mission.description || "Entrada de desafio sob observação tática."}
        </p>

        {mission.rewardAttribute && mission.rewardAttrValue > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 animate-in fade-in slide-in-from-left-2 duration-500 mt-auto pt-4">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors ${isSpecialCycle ? 'bg-amber-500/10 border-amber-500/30' : 'bg-brand/5 border-brand/20'}`}>
              <span className={`font-black text-[11px] ${isSpecialCycle ? 'text-amber-400' : 'text-brand'}`}>+{mission.rewardAttrValue}</span>
              <span className={`hud-label-tactical text-[8px] uppercase tracking-widest ${isSpecialCycle ? 'text-amber-400/60' : 'text-brand/60'}`}>
                {ATTRIBUTE_MAP[mission.rewardAttribute] || mission.rewardAttribute}
              </span>
            </div>
            {mission.rewardAttribute2 && (
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors ${isSpecialCycle ? 'bg-amber-500/10 border-amber-500/30' : 'bg-brand/5 border-brand/20'}`}>
                <span className={`font-black text-[11px] ${isSpecialCycle ? 'text-amber-400' : 'text-brand'}`}>+{mission.rewardAttrValue}</span>
                <span className={`hud-label-tactical text-[8px] uppercase tracking-widest ${isSpecialCycle ? 'text-amber-400/60' : 'text-brand/60'}`}>
                  {ATTRIBUTE_MAP[mission.rewardAttribute2] || mission.rewardAttribute2}
                </span>
              </div>
            )}
          </div>
        )}
        
        {permissions.canManage && (
          <div className="flex flex-col gap-3 pt-5 border-t border-white/5 mt-auto relative z-20">
            {isAutomaticFriendGoal ? (
              <div className="w-full bg-indigo-500/10 text-base text-indigo-400 border border-indigo-500/30 py-4 rounded-xl hud-title-md text-center cursor-default tracking-[0.2em] shadow-[inset_0_0_15px_rgba(99,102,241,0.1)] uppercase">
                SISTEMA: META DE AMIGOS
              </div>
            ) : (
              <button 
                onClick={onOpenModal} 
                className={`w-full border py-3 rounded-xl hud-title-md transition-all shadow-lg uppercase ${
                  isSpecialCycle 
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500 hover:text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-mission/10 text-mission border-mission/30 hover:bg-mission hover:text-white shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                }`}
              >
                CONCEDER XP
              </button>
            )}
            <div className="flex gap-2 mt-1">
              <Link 
                href={`/admin/missoes/${mission.id}/edit`} 
                className="flex-1 bg-dark-bg/80 border border-white/10 text-gray-500 hover:text-white hover:border-white/20 py-2.5 rounded-xl hud-label-tactical text-[9px] transition-all text-center flex items-center justify-center uppercase"
              >
                EDITAR QUEST
              </Link>
              <button 
                onClick={onDelete} 
                className="px-4 bg-dark-bg/80 border border-red-900/20 hover:bg-red-900/10 hover:border-red-500 transition-all rounded-xl flex items-center justify-center group"
              >
                <img src={ICONS.trash} alt="" className="w-8 h-8 object-contain transition-opacity" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MissionsWrapper;