"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { motion, AnimatePresence } from "framer-motion";
import { ESTRUTURAS, LEVEL_SYSTEM, ICONS, ATTRIBUTE_MAP } from "@/constants/gameConfig";
import { addCompanheiro } from "@/app/actions/companheiroActions";
import { completeMission, grantManualRelic, updateValenteProfile, toggleTrackedMission } from "@/app/actions/valenteActions";

import AttributesChart from "@/components/AttributesChart";
import LoveLanguagesChart from "@/components/LoveLanguagesChart";
import HolyPowerBars from "@/components/HolyPowerBars";
import BestFriendsList from "@/components/BestFriendsList";
import RewardModal from "@/components/admin/RewardModal"; 
import GrantRelicModal from "@/components/admin/GrantRelicModal"; 
import TavernaPreview from "@/components/TavernaPreview";
import MedalRack from "@/components/MedalRack"; 
import MissionLog from "@/components/MissionLog";
import LevelUpNotification from "@/components/LevelUpNotification";
import AddCompanionModal from "@/components/profile/AddCompanionModal";
import AvatarUploader from "@/components/game/AvatarUploader";
import RelicDiscoveryOverlay from "@/components/RelicDiscoveryOverlay";
import MissionCompletionOverlay from "@/components/MissionCompletionOverlay";
import MissionDisplayCard from "@/components/profile/MissionDisplayCard";

// ⚔️ Interfaces
interface Medal {
  id: string;
  name: string;
  icon: string;
  rarity: string;
  description: string;
}

interface CompletedMission {
  id: string;
  title: string;
  xpReward: number;
  rewardAttribute?: string;
  rewardAttrValue?: number;
  rewardAttribute2?: string;
}

export default function ValenteProfileClient({ 
  initialValente, 
  initialCompanheiros,
  availableMissions,
  ranking: initialRanking,
  personalRank,
  medalCatalog
}: { 
  initialValente: any, 
  initialCompanheiros: any[],
  availableMissions: any[],
  ranking: any[],
  personalRank: { rank: number, total: number },
  medalCatalog: any[]
}) {
  const router = useRouter(); 
  const [mounted, setMounted] = useState(false);
  const [xpWidth, setXpWidth] = useState(0); 
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isGrantRelicModalOpen, setIsGrantRelicModalOpen] = useState(false); 
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  
  // ⚔️ ADMIN CHECK
  const isAdmin = true;

  // ⚔️ HUD NOTIFICATION STATE
  const [pinLimitNotice, setPinLimitNotice] = useState<string | null>(null);

  const getNormalizedMedals = (source: any) => {
    if (!source.reliquias) return source.medals || [];
    return source.reliquias.map((r: any) => ({
      medal: r.reliquia || r.medal || r, 
      awardedAt: r.createdAt || r.awardedAt || new Date()
    }));
  };

  const initialMedals = getNormalizedMedals(initialValente);

  const [valente, setValente] = useState({
    ...initialValente,
    medals: initialMedals,
    trackedMissionIds: initialValente.trackedMissionIds || []
  });
  
  const [companheiros, setCompanheiros] = useState(initialCompanheiros);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [medalQueue, setMedalQueue] = useState<Medal[]>([]);
  const [missionQueue, setMissionQueue] = useState<CompletedMission[]>([]);

  const [isEditingLore, setIsEditingLore] = useState(false);
  const [loreText, setLoreText] = useState("");
  const [isSavingLore, setIsSavingLore] = useState(false);

  const knownMedalIds = useRef(new Set(initialMedals.map((m: any) => m.medal?.id)));

  const currentLevelInfo = valente 
    ? [...LEVEL_SYSTEM].reverse().find(lvl => valente.totalXP >= lvl.minXP) || LEVEL_SYSTEM[0] 
    : LEVEL_SYSTEM[0];

  const currentLevelIndex = LEVEL_SYSTEM.findIndex(lvl => lvl.name === currentLevelInfo.name);
  const nextLevelInfo = LEVEL_SYSTEM[currentLevelIndex + 1];

  useEffect(() => { setMounted(true); }, []);

  // ⚔️ Auto-clear pin limit notice
  useEffect(() => {
    if (pinLimitNotice) {
      const timer = setTimeout(() => setPinLimitNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [pinLimitNotice]);

  useEffect(() => {
    const currentMedals = getNormalizedMedals(initialValente);
    const newlyEarned: Medal[] = [];

    currentMedals.forEach((m: any) => {
      const id = m.medal?.id;
      if (id && !knownMedalIds.current.has(id)) {
        newlyEarned.push(m.medal);
        knownMedalIds.current.add(id);
      }
    });

    if (newlyEarned.length > 0) {
      setMedalQueue(prev => [...prev, ...newlyEarned]);
    }
    
    setValente({ ...initialValente, medals: currentMedals, trackedMissionIds: initialValente.trackedMissionIds || [] });
    setCompanheiros(initialCompanheiros);
  }, [initialValente, initialCompanheiros]);

  useEffect(() => {
    if (mounted && valente) {
      const targetXP = nextLevelInfo ? nextLevelInfo.minXP : valente.totalXP;
      const xpPercentage = nextLevelInfo ? Math.min((valente.totalXP / targetXP) * 100, 100) : 100;
      const timer = setTimeout(() => setXpWidth(xpPercentage), 100);
      return () => clearTimeout(timer);
    }
  }, [mounted, valente, nextLevelInfo]);

  const refreshValenteData = (result: any) => {
    const unlockedRelics = result.newRelics || (result.relic ? [result.relic] : []);
    if (unlockedRelics.length > 0) {
      const uniqueNew = unlockedRelics.filter((r: any) => !knownMedalIds.current.has(r.id));
      if (uniqueNew.length > 0) {
        uniqueNew.forEach((r: any) => knownMedalIds.current.add(r.id));
        setMedalQueue(prev => [...prev, ...uniqueNew]);
      }
    }

    if (result.newTotalXp !== undefined || result.newTotalXP !== undefined) {
      const newXp = result.newTotalXp ?? result.newTotalXP;
      const newLevel = [...LEVEL_SYSTEM].reverse().find(lvl => newXp >= lvl.minXP) || LEVEL_SYSTEM[0];
      
      if (newLevel.name !== currentLevelInfo.name) {
        setShowLevelUp(true);
      }
      
      setValente((prev: any) => ({ 
        ...prev, 
        totalXP: newXp,
        xpLogs: result.newLogs || prev.xpLogs,
        medals: unlockedRelics.length > 0
          ? [...prev.medals, ...unlockedRelics.map((r: any) => ({ medal: r, awardedAt: new Date() }))] 
          : prev.medals
      })); 
    }
  };

  const handleCompleteMission = async (missionId: string) => {
    setIsProcessing(true);
    const missionData = availableMissions.find(m => m.id === missionId);
    const result = await completeMission(valente.id, missionId);
    
    if (result.success) {
      if (missionData) {
        setMissionQueue(prev => [...prev, missionData]);
      }
      refreshValenteData(result);
      router.refresh(); 
    } else {
      alert("Falha ao registrar conclusão da missão.");
    }
    setIsProcessing(false);
    setIsRewardModalOpen(false);
  };

  const handleTogglePin = async (missionId: string) => {
    const result = await toggleTrackedMission(valente.id, missionId);
    if (result.success) {
      setValente((prev: any) => ({ ...prev, trackedMissionIds: result.trackedIds }));
      router.refresh();
    } else if (result.message) {
      setPinLimitNotice(result.message);
    }
  };

  const handleGrantRelic = async (relicId: string) => {
    setIsProcessing(true);
    const result = await grantManualRelic(valente.id, relicId);
    if (result.success) {
      refreshValenteData({ relic: result.relic }); 
      router.refresh(); 
    } else {
      alert("Falha ao conceder relíquia.");
    }
    setIsProcessing(false);
    setIsGrantRelicModalOpen(false);
  };

  const handleAddFriend = async (friendId: string) => {
    const result = await addCompanheiro(valente.id, friendId);
    if (result.success) {
      if (result.automatedMissions && result.automatedMissions.length > 0) {
        setMissionQueue((prev) => [...prev, ...result.automatedMissions]);
        const totalXpGained = result.automatedMissions.reduce((acc: number, m: any) => acc + m.xpReward, 0);
        const allNewRelics = result.automatedMissions.flatMap((m: any) => m.newRelics || []);
        refreshValenteData({ 
          newTotalXP: valente.totalXP + totalXpGained,
          newRelics: allNewRelics
        });
      }
      router.refresh();
    }
  };

  const handleSaveLore = async () => {
    setIsSavingLore(true);
    const result = await updateValenteProfile(valente.id, {
      name: valente.name,
      structure: valente.structure,
      description: loreText
    });

    if (result.success) {
      setValente((prev: any) => ({ ...prev, description: loreText }));
      setIsEditingLore(false);
      router.refresh();
    } else {
      alert("Erro ao salvar as crônicas.");
    }
    setIsSavingLore(false);
  };

  /**
   * ⏳ MURAL ENGINE
   */
  const trackedMissions = availableMissions.filter(m => valente.trackedMissionIds?.includes(m.id));
  
  const epicMission = useMemo(() => {
    return availableMissions
      .filter(m => !valente.trackedMissionIds?.includes(m.id) && m.periodicity !== "NONE")
      .sort((a, b) => b.xpReward - a.xpReward)[0];
  }, [availableMissions, valente.trackedMissionIds]);

  /**
   * ⚔️ PRIORITY SHUFFLE: Sorting Temporary Missions first
   */
  const routineMissions = useMemo(() => {
    // 1. Get everyone who isn't Pinned or the Epic Highlight
    const pool = availableMissions.filter(
      m => !valente.trackedMissionIds?.includes(m.id) && m.id !== epicMission?.id
    );

    // 2. Separate into Tiers and Shuffle individually
    const tempMissions = pool
      .filter(m => m.periodicity !== "NONE")
      .sort(() => Math.random() - 0.5);

    const permMissions = pool
      .filter(m => m.periodicity === "NONE")
      .sort(() => Math.random() - 0.5);

    // 3. Combine: Temporary Decretos take priority slots, then standard ones
    return [...tempMissions, ...permMissions].slice(0, 6);
  }, [availableMissions, valente.trackedMissionIds, epicMission]);

  if (!mounted) return (
    <div className="min-h-screen bg-dark-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="hud-title-lg text-brand animate-pulse">Acessando Arquivos...</span>
      </div>
    </div>
  );

  const theme = Object.values(ESTRUTURAS).find(
    s => s.label.toLowerCase() === valente.structure.toLowerCase()
  ) || ESTRUTURAS.GAD;

  const arcLength = 251.2; 
  const dashOffset = arcLength * (1 - xpWidth / 100);

  return (
    <>
      <main className="min-h-screen p-6 max-w-7xl mx-auto flex flex-col pb-40 text-white font-barlow">
        
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes glow-sweep {
            0% { transform: translateX(-150%); }
            100% { transform: translateX(200%); }
          }
          .animate-glow-sweep {
            animation: glow-sweep 3s ease-in-out infinite;
          }
        `}} />

        {/* ... Header & Profile Details ... */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <Link 
            href="/admin/valentes" 
            className="group relative flex items-center gap-3 px-5 h-10 transition-all rounded-full 
                      bg-mission/5 backdrop-blur-md border border-mission/20 
                      hover:bg-mission/10 hover:border-mission/40 
                      hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] 
                      duration-500 overflow-hidden"
          >
            <img src={ICONS.voltar} alt="" className="w-10 h-10 object-contain relative z-10 opacity-80 group-hover:opacity-100" />
            <span className="hud-label-tactical text-[11px] text-mission/80 group-hover:text-mission tracking-[0.15em] relative z-10 font-bold uppercase">
              Voltar
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-mission/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
          </Link>

          <div className="flex gap-4">
            <Link href={`/admin/valentes/${valente.id}/edit`} className="bg-white/5 border border-white/10 text-white hover:border-brand/50 hud-btn-text px-8 py-2 rounded-2xl transition-all">
              EDITAR FICHA
            </Link>
            <button onClick={() => setIsGrantRelicModalOpen(true)} className="text-brand border border-brand/30 hud-btn-text px-8 py-2 rounded-2xl hover:bg-brand hover:text-white transition-all shadow-[0_0_15px_rgba(17,194,199,0.1)] bg-brand/10">
              + CONCEDER RELÍQUIA
            </button>
            <button onClick={() => setIsRewardModalOpen(true)} className="text-white hud-btn-text px-8 py-2 rounded-2xl hover:brightness-110 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-mission">
              + CONCEDER RECOMPENSA
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ... Profile Sections (Stats, Chart, etc.) ... */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center bg-dark-bg/40 backdrop-blur-xl p-10 border border-white/5 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="relative flex flex-col items-center justify-center w-full mb-6 mt-2">
                    <div className="flex items-center justify-center w-full">
                        <div className="h-[1px] flex-1 max-w-[60px] opacity-60 mr-4" style={{ background: `linear-gradient(to left, ${theme.color}, transparent)` }} />
                        <h1 className="hud-title-lg text-white text-center m-0 uppercase tracking-[0.15em] relative z-10" style={{ textShadow: `0 0 10px ${theme.color}FF, 0 0 20px ${theme.color}AA` }}>
                            {valente.name}
                        </h1>
                        <div className="h-[1px] flex-1 max-w-[60px] opacity-60 ml-4" style={{ background: `linear-gradient(to right, ${theme.color}, transparent)` }} />
                    </div>
                </div>

                <div className="relative w-full max-w-[220px] aspect-[3/4] flex items-center justify-center bg-dark-bg/60 border border-white/10 rounded-xl shadow-2xl overflow-hidden group">
                    <div className="absolute inset-0 z-10">
                        <AvatarUploader valenteId={valente.id} currentImage={valente.image} className="w-full h-full object-cover p-5 opacity-90 group-hover:opacity-100" />
                    </div>
                    <div className="absolute left-0 right-0 h-[1.5px] z-[15] pointer-events-none animate-scan-hologram mix-blend-screen" style={{ background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)`, boxShadow: `0 0 20px ${theme.color}` }} />
                    <div className="absolute inset-4 border border-solid z-20 pointer-events-none" style={{ borderColor: theme.color, boxShadow: `inset 0 0 15px ${theme.color}44` }} />
                </div>

                <div className="relative w-full max-w-[260px] flex flex-col items-center justify-center mt-12 z-20">
                    <svg viewBox="0 0 200 120" className="w-full">
                        <defs>
                            <linearGradient id="heroXpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" /> 
                                <stop offset="100%" stopColor={theme.color} stopOpacity="1" />
                            </linearGradient>
                        </defs>
                        <path d="M 20 20 A 80 80 0 0 0 180 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" strokeLinecap="round" />
                        <path d="M 20 20 A 80 80 0 0 0 180 20" fill="none" stroke="url(#heroXpGradient)" strokeWidth="12" strokeLinecap="round" strokeDasharray={arcLength} strokeDashoffset={dashOffset} className="transition-all duration-1000 ease-out"/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-start">
                        <img src={currentLevelInfo.icon} alt={currentLevelInfo.name} className="w-16 h-16 object-contain -mt-24 animate-bounce-slow" />
                        <span className="hud-title-md text-white mt-1">{currentLevelInfo.name}</span>
                        <div className="mt-4 flex flex-col items-center">
                            <span className="hud-value text-white">{valente.totalXP}</span>
                            <span className="hud-label-tactical mt-1 uppercase tracking-widest text-[9px] text-gray-500">
                                META: {nextLevelInfo ? `${nextLevelInfo.minXP} XP` : 'ASCENSÃO MÁXIMA'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-dark-bg/40 backdrop-blur-xl p-8 border border-white/5 rounded-2xl relative group">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 rounded-full" style={{ backgroundColor: theme.color }}></div>
                  <h3 className="hud-label-tactical text-gray-400 text-[15px] uppercase tracking-widest">Crônicas do Valente</h3>
                </div>
                <button onClick={() => { setLoreText(valente.description || ""); setIsEditingLore(true); }} className="flex items-center gap-2 hud-label-tactical text-[10px] text-brand border border-brand/20 px-3 py-1.5 rounded-md hover:bg-brand/10 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 uppercase">
                  <img src={ICONS.edit} alt="" className="w-3 h-3 object-contain brightness-110" /> Editar
                </button>
              </div>
              <p className="font-barlow text-gray-300 text-sm leading-relaxed relative z-10 first-letter:text-3xl first-letter:mr-1">
                <style dangerouslySetInnerHTML={{__html: `p::first-letter { color: ${theme.color}; font-family: var(--family-bebas); }`}} />
                {valente.description || "Este herói ainda não registrou seus feitos nas crônicas do Reino."}
              </p>
            </div>

            <MedalRack valenteId={valente.id} medals={valente.medals} catalog={medalCatalog} />
          </div>

          <div className="flex flex-col gap-8">
            <div className="bg-dark-bg/40 backdrop-blur-xl p-6 border border-white/5 rounded-2xl">
              <h2 className="hud-title-md text-white text-center border-b border-white/5 pb-4 mb-6 uppercase">Atributos</h2>
              <AttributesChart skills={valente.attributes} theme={{ hex: theme.color }} />
            </div>
            
            <div className="bg-dark-bg/40 backdrop-blur-xl p-6 border border-white/5 rounded-2xl">
              <h2 className="hud-title-md text-white text-center border-b border-white/5 pb-4 mb-6 uppercase">Linguagens</h2>
              <LoveLanguagesChart data={valente.loveLanguages} color={theme.color} />
            </div>
            
            <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex flex-col max-h-[380px]">
              <TavernaPreview ranking={initialRanking} />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="bg-dark-bg/40 backdrop-blur-xl p-6 border border-white/5 rounded-2xl">
              <h2 className="hud-title-md text-white text-center border-b border-white/5 pb-4 mb-6 uppercase">Poder Santo</h2>
              <HolyPowerBars powers={valente.holyPower} />
            </div>
            
            <div className="bg-dark-bg/40 backdrop-blur-xl p-6 border border-white/5 rounded-2xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <h2 className="hud-title-md text-white uppercase m-0">Companheiros</h2>
                <button onClick={() => setIsAddFriendOpen(true)} className="text-brand text-[10px] border border-brand/20 px-3 py-1 rounded-full hover:bg-brand/10 transition-all uppercase">+ ADICIONAR</button>
              </div>
              <BestFriendsList friends={companheiros} currentValenteId={valente.id} />
            </div>

            <div className="bg-dark-bg/40 backdrop-blur-xl p-6 border border-white/5 rounded-2xl h-[400px] flex flex-col">
              <h2 className="hud-title-md text-white border-b border-white/5 pb-4 mb-6 uppercase flex items-center justify-center gap-2 shrink-0">
                <span className="text-emerald-500 animate-pulse">●</span> Crônicas de Batalha
              </h2>
              <MissionLog logs={valente.xpLogs} />
            </div>
          </div>
        </div>

        {/* ⚔️ MURAL DE DECRETOS ⚔️ */}
        <section className="mt-24 pt-20 border-t border-white/5 relative">
            <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 bg-dark-bg px-8">
                <span className="text-gray-700 text-2xl">⚔️</span>
            </div>
            
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                <h2 className="hud-title-lg text-white flex items-center gap-4 m-0 uppercase text-3xl">
                    <img src={ICONS.missoes} className="w-12 h-12 object-contain" alt="" /> Mural de Decretos
                </h2>
                <p className="hud-label-tactical mt-2 uppercase text-gray-500">Operações em Andamento</p>
                </div>
                <Link href="/admin/missoes" className="hud-label-tactical text-gray-500 hover:text-white border border-white/5 hover:border-white/20 px-6 py-3 rounded-2xl transition-all bg-white/[0.02] uppercase tracking-[0.1em]">
                  Acervo Completo →
                </Link>
            </header>

            <div className="flex flex-col gap-12">
              
              {/* 1. DECRETOS EM FOCO (TRACKED) */}
              {trackedMissions.length > 0 && (
                <div className="space-y-6">
                  <h3 className="hud-label-tactical text-brand text-xs flex items-center gap-3 uppercase tracking-[0.4em] font-black">
                    <span className="w-2 h-2 rounded-full bg-brand animate-ping shadow-[0_0_10px_#11c2c7]"></span> Decretos em Foco
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trackedMissions.map((mission: any) => (
                      <MissionDisplayCard 
                        key={mission.id} 
                        mission={mission} 
                        isTracked={true} 
                        onTogglePin={handleTogglePin} 
                        onComplete={handleCompleteMission} 
                        isProcessing={isProcessing}
                        isAdmin={isAdmin}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 2. DECRETO ÉPICO (EPIC HIGHLIGHT) */}
              {epicMission && (
                <div className="space-y-6">
                  <h3 className="hud-label-tactical text-amber-500 text-xs flex items-center gap-3 uppercase tracking-[0.4em] font-black">
                    <span className="w-8 h-px bg-amber-500/30"></span> Destaque do Ciclo
                  </h3>
                  <div className="relative group">
                    <div className="bg-gradient-to-br from-amber-950/30 via-dark-bg/40 to-dark-bg/40 border border-amber-500/30 p-8 rounded-3xl flex flex-col lg:flex-row justify-between items-center gap-8 hover:border-amber-500/60 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-visible">
                      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
                      </div>
                      
                      <div className="flex-1 space-y-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <span className="bg-amber-500 text-black font-black hud-label-tactical px-3 py-1 rounded text-[10px] uppercase tracking-tighter">
                            {epicMission.periodicity === "DAILY" ? "DECRETO DIÁRIO" : 
                             epicMission.periodicity === "WEEKLY" ? "DECRETO SEMANAL" : 
                             epicMission.periodicity === "MONTHLY" ? "DECRETO MENSAL" : "EVENTO ESPECIAL"}
                          </span>
                          <button onClick={() => handleTogglePin(epicMission.id)} className="text-white/40 hover:text-amber-400 text-[10px] uppercase tracking-widest font-black transition-colors drop-shadow-[0_0_5px_rgba(245,158,11,0.3)]">☆ FIXAR</button>
                        </div>
                        <h4 className="hud-title-md text-4xl text-white m-0 uppercase leading-none tracking-tight">{epicMission.title}</h4>
                        <p className="text-gray-400 font-barlow max-w-2xl text-base uppercase tracking-tighter leading-tight border-l-2 border-amber-500/20 pl-4">
                          {epicMission.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-center lg:items-end gap-4 shrink-0 relative z-10">
                        <div className="flex flex-col items-center lg:items-end">
                          <span className="hud-value text-amber-500 text-6xl drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">+{epicMission.xpReward} XP</span>
                          {epicMission.rewardAttribute && (
                            <span className="hud-label-tactical text-amber-400/80 text-[10px] uppercase tracking-widest font-black">+{epicMission.rewardAttrValue} {ATTRIBUTE_MAP[epicMission.rewardAttribute]}</span>
                          )}
                        </div>
                        {isAdmin && (
                          <div className="p-2 -m-2"> 
                            <button 
                              onClick={() => handleCompleteMission(epicMission.id)} 
                              disabled={isProcessing}
                              className="bg-amber-500 hover:bg-amber-400 text-black px-12 py-4 rounded-xl font-black hud-title-md text-lg uppercase transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                            >
                              {isProcessing ? "PROCESSANDO..." : "CONCLUIR OPERAÇÃO"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. DECRETOS DA ROTINA (SHUFFLED + PRIORITY) */}
              <div className="space-y-6">
                <h3 className="hud-label-tactical text-gray-500 text-xs flex items-center gap-3 uppercase tracking-[0.4em] font-black">
                  <span className="w-8 h-px bg-white/10"></span> Decretos da Rotina
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {routineMissions.map((mission: any) => (
                    <MissionDisplayCard 
                      key={mission.id} 
                      mission={mission} 
                      isTracked={false} 
                      onTogglePin={handleTogglePin} 
                      onComplete={handleCompleteMission} 
                      isProcessing={isProcessing}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              </div>
            </div>
        </section>
      </main>

      {/* 🛡️ HUD PIN LIMIT NOTIFICATION */}
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

      <AnimatePresence>
        {missionQueue.length > 0 ? (
          <MissionCompletionOverlay 
            key={`mission-${missionQueue[0].id}`}
            mission={missionQueue[0]} 
            onComplete={() => setMissionQueue(prev => prev.slice(1))} 
          />
        ) : medalQueue.length > 0 ? (
          <RelicDiscoveryOverlay 
            key={`relic-${medalQueue[0].id}`}
            relic={medalQueue[0]} 
            onComplete={() => setMedalQueue(prev => prev.slice(1))} 
          />
        ) : showLevelUp ? (
          <LevelUpNotification 
            key="levelup-notification"
            levelName={currentLevelInfo.name} 
            levelIcon={currentLevelInfo.icon}
            themeColor={theme.color}
            onComplete={() => setShowLevelUp(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}