"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { motion, AnimatePresence } from "framer-motion";
import { ESTRUTURAS, LEVEL_SYSTEM, ICONS } from "@/constants/gameConfig";
import { addCompanheiro } from "@/app/actions/companheiroActions";
import { completeMission, grantManualRelic, updateValenteProfile } from "@/app/actions/valenteActions";

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

// ⚔️ Interfaces strictly aligned with Component Props
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
    medals: initialMedals
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
    
    setValente({ ...initialValente, medals: currentMedals });
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
              {/* ⚔️ FIXED: 'label' property removed to match 'AttributesChart' prop type */}
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

        {/* ... Bottom Sections ... */}
        <section className="mt-24 pt-20 border-t border-white/5 relative">
            <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 bg-dark-bg px-8">
                <span className="text-gray-700 text-2xl">⚔️</span>
            </div>
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                <h2 className="hud-title-lg text-white flex items-center gap-4 m-0 uppercase text-3xl">
                    <img src={ICONS.missoes} className="w-12 h-12 object-contain" alt="" /> Mural de Decretos
                </h2>
                <p className="hud-label-tactical mt-2 uppercase text-gray-500">Operações Ativas para {valente.name}</p>
                </div>
                <Link href="/admin/missoes" className="hud-label-tactical text-gray-500 hover:text-white border border-white/5 hover:border-white/20 px-6 py-3 rounded-2xl transition-all bg-white/[0.02] uppercase">
                Histórico Completo →
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableMissions?.slice(0, 6).map((mission: any) => (
                <div key={mission.id} className="bg-dark-bg/40 border border-white/5 p-8 rounded-2xl flex flex-col hover:border-mission/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mission/40 to-transparent"></div>
                    <div className="flex justify-between items-start mb-6">
                    <span className="bg-white/5 text-gray-500 border border-white/5 hud-label-tactical px-3 py-1 rounded-full text-[9px] uppercase tracking-widest">{mission.type}</span>
                    <span className="hud-value text-mission text-3xl">+{mission.xpReward} XP</span>
                    </div>
                    <h3 className="hud-title-md text-white mb-3 uppercase tracking-wider">{mission.title}</h3>
                    <p className="font-barlow text-gray-500 text-sm mb-8 flex-1 leading-relaxed line-clamp-2">{mission.description}</p>
                    <button onClick={() => handleCompleteMission(mission.id)} disabled={isProcessing} className="w-full bg-mission/10 border border-mission/20 hover:bg-mission hover:text-white text-mission hud-btn-text py-3 rounded-2xl transition-all uppercase tracking-widest disabled:opacity-50">
                    {isProcessing ? "PROCESSANDO..." : "CONCLUIR MISSÃO"}
                    </button>
                </div>
                ))}
            </div>
        </section>
      </main>

      {/* Admin Modals */}
      {isRewardModalOpen && (
        <RewardModal 
          valente={valente}
          missions={availableMissions}
          onClose={() => setIsRewardModalOpen(false)}
          onConfirm={handleCompleteMission}
          isProcessing={isProcessing}
        />
      )}

      {isGrantRelicModalOpen && (
        <GrantRelicModal 
          valente={valente}
          catalog={medalCatalog}
          earnedMedals={valente.medals || []}
          onClose={() => setIsGrantRelicModalOpen(false)}
          onConfirm={handleGrantRelic}
          isProcessing={isProcessing}
        />
      )}

      <AddCompanionModal 
        isOpen={isAddFriendOpen} 
        onClose={() => setIsAddFriendOpen(false)} 
        onAdd={handleAddFriend}
        currentValenteId={valente.id}
      />

      {/* ⚔️ FIXED: Overlay Logic explicitly separated to prevent TS type interference */}
      <AnimatePresence>
        {/* Priority 1: Mission Completion Overlay */}
        {missionQueue.length > 0 ? (
          <MissionCompletionOverlay 
            key={`mission-${missionQueue[0].id}`}
            mission={missionQueue[0]} 
            onComplete={() => setMissionQueue(prev => prev.slice(1))} 
          />
        ) : medalQueue.length > 0 ? (
          /* Priority 2: Relic Discovery Overlay */
          <RelicDiscoveryOverlay 
            key={`relic-${medalQueue[0].id}`}
            relic={medalQueue[0]} 
            onComplete={() => setMedalQueue(prev => prev.slice(1))} 
          />
        ) : showLevelUp ? (
          /* Priority 3: Level Up Notification */
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