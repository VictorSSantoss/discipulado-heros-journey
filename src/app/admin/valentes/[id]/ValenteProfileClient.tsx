"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ESTRUTURAS, LEVEL_SYSTEM, ICONS } from "@/constants/gameConfig";
import { updateValenteXp } from "@/app/actions/valenteActions";
import { addCompanheiro } from "@/app/actions/companheiroActions";

import AttributesChart from "@/components/AttributesChart";
import LoveLanguagesChart from "@/components/LoveLanguagesChart";
import HolyPowerBars from "@/components/HolyPowerBars";
import BestFriendsList from "@/components/BestFriendsList";
import GrantXpModal from "@/components/GrantXpModal";
import TavernaPreview from "@/components/TavernaPreview";
import MedalRack from "@/components/MedalRack"; 
import MissionLog from "@/components/MissionLog";
import LevelUpNotification from "@/components/LevelUpNotification";
import AchievementToast from "@/components/AchievementToast";
import AddCompanionModal from "@/components/profile/AddCompanionModal";

export default function ValenteProfileClient({ 
  initialValente, 
  initialCompanheiros,
  ranking: initialRanking,
  personalRank 
}: { 
  initialValente: any, 
  initialCompanheiros: any[],
  ranking: any[],
  personalRank: { rank: number, total: number } 
}) {
  const [mounted, setMounted] = useState(false);
  const [xpWidth, setXpWidth] = useState(0); 
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [valente, setValente] = useState(initialValente);
  const [companheiros, setCompanheiros] = useState(initialCompanheiros);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [unlockedMedal, setUnlockedMedal] = useState<any>(null);

  const currentLevelInfo = valente 
    ? [...LEVEL_SYSTEM].reverse().find(lvl => valente.totalXP >= lvl.minXP) || LEVEL_SYSTEM[0] 
    : LEVEL_SYSTEM[0];

  const [prevLevel, setPrevLevel] = useState(currentLevelInfo.name);

  const currentLevelIndex = LEVEL_SYSTEM.findIndex(lvl => lvl.name === currentLevelInfo.name);
  const nextLevelInfo = LEVEL_SYSTEM[currentLevelIndex + 1];

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    setValente(initialValente);
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

  const handleGrantXp = async (xpAmount: number) => {
    if (valente) { 
      const result = await updateValenteXp(valente.id, xpAmount);
      
      if (result.success && result.newTotalXP !== undefined) {
        const newXp = result.newTotalXP;
        
        const newLevel = [...LEVEL_SYSTEM].reverse().find(lvl => newXp >= lvl.minXP) || LEVEL_SYSTEM[0];

        if (newLevel.name !== prevLevel) {
          setShowLevelUp(true);
          setPrevLevel(newLevel.name);
        }

        if (result.newMedals && result.newMedals.length > 0) {
          const specialMedal = result.newMedals.find(
            (m: any) => m.rarity === "RARE" || m.rarity === "LEGENDARY"
          );
          if (specialMedal) {
            setUnlockedMedal(specialMedal);
          }
        }

        setValente({ 
          ...valente, 
          totalXP: newXp,
          xpLogs: result.newLogs || [],
          medals: result.newMedals ? [...valente.medals, ...result.newMedals.map((m: any) => ({ medal: m, awardedAt: new Date() }))] : valente.medals
        }); 
      }
    }
    setIsGrantModalOpen(false);
  };

  const handleAddFriend = async (friendId: string) => {
    const result = await addCompanheiro(valente.id, friendId);
    if (result.success) {
      // Server revalidation handles the update of initialCompanheiros
    }
  };

  if (!mounted) return (
    <div className="min-h-screen bg-dark-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="hud-title-lg text-brand animate-pulse">Acessando Arquivos...</span>
      </div>
    </div>
  );

  const getTheme = (valenteStructure: string) => {
    const entry = Object.values(ESTRUTURAS).find(
      s => s.label.toLowerCase() === valenteStructure.toLowerCase()
    ) || ESTRUTURAS.GAD;
    return { hex: entry.color, label: entry.label };
  };

  const theme = getTheme(valente.structure);
  const arcLength = 251.2; 
  const dashOffset = arcLength * (1 - xpWidth / 100);

  return (
    <>
      <main className="min-h-screen p-6 max-w-7xl mx-auto flex flex-col pb-40 text-white font-barlow">
        
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <Link href="/admin/valentes" className="hud-label-tactical flex items-center gap-3 hover:text-brand transition-all">
            <span>←</span> VOLTAR AO QUARTEL
          </Link>
          <div className="flex gap-4">
            <Link href={`/admin/valentes/${valente.id}/edit`} className="bg-white/5 border border-white/10 text-white hover:border-brand/50 hud-btn-text px-8 py-2 rounded-2xl transition-all">
              EDITAR FICHA
            </Link>
            <button 
              onClick={() => setIsGrantModalOpen(true)} 
              className="text-white hud-btn-text px-8 py-2 rounded-2xl hover:brightness-110 transition-all shadow-lg"
              style={{ backgroundColor: theme.hex }}
            >
              + CONCEDER XP
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center bg-dark-bg/40 backdrop-blur-xl p-10 border border-white/5 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="relative flex items-center justify-center w-full mb-6 mt-2">
                <div 
                  className="h-[1px] flex-1 max-w-[60px] opacity-60 mr-4" 
                  style={{ background: `linear-gradient(to left, ${theme.hex}, transparent)` }}
                />
                <h1 
                  className="hud-title-lg text-white text-center m-0 uppercase tracking-[0.15em] relative z-10"
                  style={{ textShadow: `
                    0 0 10px ${theme.hex}FF, 
                    0 0 20px ${theme.hex}AA, 
                    0 0 40px ${theme.hex}60, 
                    0 0 70px ${theme.hex}30
                  ` }}
                >
                  {valente.name}
                </h1>
                <div 
                  className="h-[1px] flex-1 max-w-[60px] opacity-60 ml-4" 
                  style={{ background: `linear-gradient(to right, ${theme.hex}, transparent)` }}
                />
              </div>

              <div className="flex items-center gap-2 mb-8 bg-brand/5 border border-brand/20 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <span className="text-brand text-xs animate-pulse">●</span>
                <span className="hud-label-tactical text-[10px] text-gray-400">POSIÇÃO NO REINO:</span>
                <span className="hud-value text-sm text-brand">#{personalRank.rank}</span>
                <span className="text-white/20 text-[10px] mx-1">/</span>
                <span className="hud-label-tactical text-[10px] text-gray-500">{personalRank.total}</span>
              </div>

              <div className="relative w-full max-w-[220px] aspect-[3/4] flex items-center justify-center bg-dark-bg/60 border border-white/10 rounded-xl shadow-2xl overflow-hidden group">
                <img 
                  src={valente.image || '/images/man-silhouette.svg'} 
                  className="w-full h-full object-cover p-5 opacity-90 transition-opacity group-hover:opacity-100 z-10" 
                  alt=""
                />
                <div 
                  className="absolute left-0 right-0 h-[1.5px] z-[15] pointer-events-none animate-scan-hologram mix-blend-screen"
                  style={{ 
                    background: `linear-gradient(90deg, transparent, ${theme.hex}, transparent)`,
                    boxShadow: `0 0 20px ${theme.hex}`,
                    width: '100%',
                  }}
                />
                <div className="absolute inset-4 border border-solid z-20 pointer-events-none" style={{ borderColor: theme.hex }}>
                  <div className="absolute inset-0" style={{ boxShadow: `inset 0 0 15px ${theme.hex}44` }} />
                </div>
                <div className="absolute top-4 left-4 w-3 h-3 border-t-4 border-l-4 border-solid z-30 pointer-events-none" style={{ borderColor: theme.hex }}></div>
                <div className="absolute top-4 right-4 w-3 h-3 border-t-4 border-r-4 border-solid z-30 pointer-events-none" style={{ borderColor: theme.hex }}></div>
                <div className="absolute bottom-4 left-4 w-3 h-3 border-b-4 border-l-4 border-solid z-30 pointer-events-none" style={{ borderColor: theme.hex }}></div>
                <div className="absolute bottom-4 right-4 w-3 h-3 border-b-4 border-r-4 border-solid z-30 pointer-events-none" style={{ borderColor: theme.hex }}></div>
              </div>

              <div className="relative w-full max-w-[260px] flex flex-col items-center justify-center mt-12 z-20">
                <svg viewBox="0 0 200 120" className="w-full">
                  <defs>
                    <linearGradient id="heroXpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" /> 
                      <stop offset="60%" stopColor={theme.hex} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={theme.hex} stopOpacity="1" />
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
                    <span className="hud-label-tactical mt-1">META: {nextLevelInfo ? nextLevelInfo.minXP : 'MÁXIMO'} XP</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 relative group cursor-default">
                <div className="absolute -inset-1.5 opacity-10 blur-xl group-hover:opacity-30 rounded-lg transition-opacity duration-300 mix-blend-screen" style={{ backgroundColor: theme.hex }}></div>
                <div className="relative flex flex-col items-center">
                  <div className="px-6 py-1 rounded-full mb-[-12px] z-10 shadow-xl border border-white/10 backdrop-blur-md" style={{ backgroundColor: theme.hex }}>
                    <span className="hud-label-tactical text-white">ESTRUTURA</span>
                  </div>
                  <div className="bg-dark-bg border-2 px-10 py-3 shadow-2xl flex items-center justify-center min-w-[180px] relative rounded-lg" style={{ borderColor: theme.hex }}>
                    <span className="hud-title-md text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                      {theme.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-dark-bg/40 backdrop-blur-xl p-8 border border-white/5 rounded-2xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 text-white/[0.03] text-8xl hud-title-lg pointer-events-none italic">LORE</div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: theme.hex }}></div>
                <h3 className="hud-label-tactical text-gray-400 text-[15px] italic-none">CRÔNICAS DO VALENTE</h3>
              </div>
              <p className="font-barlow text-gray-300 text-sm leading-relaxed relative z-10 first-letter:text-3xl first-letter:mr-1">
                <style dangerouslySetInnerHTML={{__html: `p::first-letter { color: ${theme.hex}; font-family: var(--family-bebas); }`}} />
                {valente.description || "Este herói ainda não registrou seus feitos nas crônicas do Reino."}
              </p>
            </div>

            <MedalRack medals={valente.medals || []} />
          </div>

          <div className="flex flex-col gap-8">
            <div className="bg-dark-bg/40 backdrop-blur-xl p-6 border border-white/5 rounded-2xl">
              <h2 className="hud-title-md text-white text-center border-b border-white/5 pb-4 mb-6 uppercase">Atributos</h2>
              <AttributesChart skills={valente.attributes} theme={theme} />
            </div>
            
            <div className="bg-dark-bg/40 backdrop-blur-xl p-6 border border-white/5 rounded-2xl">
              <h2 className="hud-title-md text-white text-center border-b border-white/5 pb-4 mb-6 uppercase">Linguagens</h2>
              <LoveLanguagesChart data={valente.loveLanguages} color={theme.hex} />
            </div>
            
            <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex flex-col max-h-[380px]">
              <div className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/40 transition-colors">
                <TavernaPreview ranking={initialRanking} />
              </div>
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
                <button 
                  onClick={() => setIsAddFriendOpen(true)}
                  className="text-brand text-[10px] border border-brand/20 px-3 py-1 rounded-full hover:bg-brand/10 transition-all uppercase"
                >
                  + ADICIONAR
                </button>
              </div>
              <BestFriendsList 
                friends={companheiros} 
                currentValenteId={valente.id} 
              />
            </div>

            <div className="bg-dark-bg/40 backdrop-blur-xl p-6 border border-white/5 rounded-2xl flex-1 flex flex-col">
              <h2 className="hud-title-md text-white border-b border-white/5 pb-4 mb-6 uppercase flex items-center justify-center gap-2">
                <span className="text-emerald-500 animate-pulse">●</span> Crônicas de Batalha
              </h2>
              <MissionLog logs={valente.xpLogs} />
            </div>
          </div>
        </div>

        <section className="mt-24 pt-20 border-t border-white/5 relative">
          <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 bg-dark-bg px-8">
            <span className="text-gray-700 text-2xl">⚔️</span>
          </div>

          <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="hud-title-lg text-white flex items-center gap-4 m-0 uppercase">
                <img src={ICONS.missoes} className="w-12 h-12 object-contain" alt="" /> Mural de Decretos
              </h2>
              <p className="hud-label-tactical mt-2 uppercase">Operações Ativas para {valente.name}</p>
            </div>
            <button className="hud-label-tactical text-gray-500 hover:text-white border border-white/5 hover:border-white/20 px-6 py-3 rounded-2xl transition-all bg-white/[0.02] uppercase">Histórico Completo →</button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl flex flex-col hover:border-mission/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mission/40 to-transparent"></div>
              <div className="flex justify-between items-start mb-6">
                <span className="bg-white/5 text-gray-400 border border-white/5 hud-label-tactical px-3 py-1 rounded-full text-[9px] italic-none uppercase tracking-widest">Hábitos</span>
                <span className="hud-value text-mission text-3xl">+150 XP</span>
              </div>
              <h3 className="hud-title-md text-white mb-3 uppercase tracking-wider">Jejum Matinal</h3>
              <p className="font-barlow text-gray-400 text-sm mb-8 flex-1 leading-relaxed">Realizar um jejum até o meio-dia, dedicando o tempo da refeição à leitura da Palavra.</p>
              <button className="w-full bg-mission/10 border border-mission/20 hover:bg-mission hover:text-white text-mission hud-btn-text py-3 rounded-2xl transition-all uppercase tracking-widest">Concluir Missão</button>
            </div>
          </div>
        </section>

      </main>

      <GrantXpModal isOpen={isGrantModalOpen} onClose={() => setIsGrantModalOpen(false)} onGrant={handleGrantXp} valenteName={valente.name} />

      <AddCompanionModal 
        isOpen={isAddFriendOpen} 
        onClose={() => setIsAddFriendOpen(false)} 
        onAdd={handleAddFriend}
        currentValenteId={valente.id}
      />

      <AnimatePresence>
        {showLevelUp && (
          <LevelUpNotification 
            levelName={currentLevelInfo.name} 
            levelIcon={currentLevelInfo.icon}
            themeColor={theme.hex}
            onComplete={() => setShowLevelUp(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {unlockedMedal && (
          <AchievementToast 
            medal={unlockedMedal} 
            themeColor={theme.hex} 
            onClose={() => setUnlockedMedal(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}