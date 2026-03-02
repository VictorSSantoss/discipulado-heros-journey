"use client";

import { use, useEffect, useState } from "react";
import { mockValentes } from "@/lib/mockData";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ESTRUTURAS, LEVEL_SYSTEM, ICONS } from "@/constants/gameConfig";

import AttributesChart from "@/components/AttributesChart";
import LoveLanguagesChart from "@/components/LoveLanguagesChart";
import HolyPowerBars from "@/components/HolyPowerBars";
import BestFriendsList from "@/components/BestFriendsList";
import GrantXpModal from "@/components/GrantXpModal";
import TavernaPreview from "@/components/TavernaPreview";
import MedalRack from "@/components/MedalRack"; 

/**
 * ValenteProfile Component
 * Detailed dossier for a single hero.
 * Now featuring the MedalRack and unified silhouette fallback.
 */
export default function ValenteProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  const [xpWidth, setXpWidth] = useState(0); 
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);

  const foundValente = mockValentes.find((v) => v.id === id);
  const [valente, setValente] = useState(foundValente);

  /* LEVEL_CALCULATIONS */
  const currentLevelInfo = valente 
    ? [...LEVEL_SYSTEM].reverse().find(lvl => valente.totalXP >= lvl.minXP) || LEVEL_SYSTEM[0] 
    : LEVEL_SYSTEM[0];
  const currentLevelIndex = LEVEL_SYSTEM.findIndex(lvl => lvl.name === currentLevelInfo.name);
  const nextLevelInfo = LEVEL_SYSTEM[currentLevelIndex + 1];

  useEffect(() => { setMounted(true); }, []);

  /* ANIMATION_TRIGGER */
  useEffect(() => {
    if (mounted && valente) {
      const targetXP = nextLevelInfo ? nextLevelInfo.minXP : valente.totalXP;
      const xpPercentage = nextLevelInfo ? Math.min((valente.totalXP / targetXP) * 100, 100) : 100;
      const timer = setTimeout(() => setXpWidth(xpPercentage), 100);
      return () => clearTimeout(timer);
    }
  }, [mounted, valente, nextLevelInfo]);

  const handleGrantXp = (xpAmount: number) => {
    if (valente) { setValente({ ...valente, totalXP: valente.totalXP + xpAmount }); }
    setIsGrantModalOpen(false);
  };

  /* LOADING_STATE_UI */
  if (!mounted) return (
    <div className="min-h-screen bg-dark-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="hud-title-lg text-brand animate-pulse">Acessando Arquivos...</span>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-brand animate-load-progress"></div>
        </div>
      </div>
    </div>
  );

  if (!valente) return notFound();

  /* THEME_RESOLVER */
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
        {/* PROFILE_MASTER_CONTAINER */}
        
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
          {/* PRIMARY_HERO_DATA_COLUMN */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center bg-dark-bg/40 backdrop-blur-xl p-10 border border-white/5 rounded-2xl shadow-2xl relative overflow-hidden">
              {/* HERO_IDENTITY_CARD */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <h1 className="hud-title-lg text-white text-center m-0 mb-10">
                {valente.name}
              </h1>

              <div className="w-full aspect-[3/4] max-w-[220px] bg-dark-bg border border-gray-700 rounded-sm overflow-hidden flex items-center justify-center relative shadow-2xl z-10">
                <div className="absolute inset-3 border border-cyan-500/30 pointer-events-none z-20 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)]"></div>
                <div className="absolute top-3 left-3 w-2 h-2 border-t-2 border-l-2 border-cyan-400 z-30"></div>
                <div className="absolute top-3 right-3 w-2 h-2 border-t-2 border-r-2 border-cyan-400 z-30"></div>
                <div className="absolute bottom-3 left-3 w-2 h-2 border-b-2 border-l-2 border-cyan-400 z-30"></div>
                <div className="absolute bottom-3 right-3 w-2 h-2 border-b-2 border-r-2 border-cyan-400 z-30"></div>
                
                {/* FALLBACK_LOGIC_APPLIED */}
                <img 
                  src={valente.image || '/images/man-silhouette.svg'} 
                  className="w-full h-full object-cover z-10 p-4" 
                  alt=""
                  onError={(e) => { 
                    e.currentTarget.onerror = null; 
                    e.currentTarget.src = '/images/man-silhouette.svg'; 
                  }}
                />
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
              {/* LORE_AND_CHRONICLES_SECTION */}
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

            {/* MEDAL_RACK_SECTION */}
            <MedalRack medals={valente.medals || []} />
          </div>

          <div className="flex flex-col gap-8">
            {/* ANALYTICS_CHARTS_COLUMN */}
            <div className="bg-dark-bg/40 backdrop-blur-xl p-6 border border-white/5 rounded-2xl">
              <h2 className="hud-title-md text-white text-center border-b border-white/5 pb-4 mb-6">ATRIBUTOS</h2>
              <AttributesChart skills={valente.skills as any} />
            </div>
            <div className="bg-dark-bg/40 backdrop-blur-xl p-6 border border-white/5 rounded-2xl">
              <h2 className="hud-title-md text-white text-center border-b border-white/5 pb-4 mb-6">LINGUAGENS</h2>
              <LoveLanguagesChart data={valente.loveLanguages} />
            </div>
            <TavernaPreview />
          </div>

          <div className="flex flex-col gap-8">
            {/* SOCIAL_STRENGTH_COLUMN */}
            <div className="bg-dark-bg/40 backdrop-blur-xl p-6 border border-white/5 rounded-2xl">
              <h2 className="hud-title-md text-white text-center border-b border-white/5 pb-4 mb-6">PODER SANTO</h2>
              <HolyPowerBars powers={valente.holyPower} />
            </div>
            <div className="bg-dark-bg/40 backdrop-blur-xl p-6 border border-white/5 rounded-2xl">
              <h2 className="hud-title-md text-white text-center border-b border-white/5 pb-4 mb-6">COMPANHEIROS</h2>
              <BestFriendsList friendIds={valente.friendIds} />
            </div>
          </div>
        </div>
      
        {/* DECREE_BOARD_SECTION */}
        <section className="mt-24 pt-20 border-t border-white/5 relative">
          <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 bg-dark-bg px-8">
            <span className="text-gray-700 text-2xl">⚔️</span>
          </div>

          <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="hud-title-lg text-white flex items-center gap-4 m-0">
                <img src={ICONS.missoes} className="w-12 h-12 object-contain" alt="" /> MURAL DE DECRETOS
              </h2>
              <p className="hud-label-tactical mt-2">Operações Ativas para {valente.name}</p>
            </div>
            <button className="hud-label-tactical text-gray-500 hover:text-white border border-white/5 hover:border-white/20 px-6 py-3 rounded-2xl transition-all bg-white/[0.02]">HISTÓRICO COMPLETO →</button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl flex flex-col hover:border-mission/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mission/40 to-transparent"></div>
              <div className="flex justify-between items-start mb-6">
                <span className="bg-white/5 text-gray-400 border border-white/5 hud-label-tactical px-3 py-1 rounded-full text-[9px] italic-none">HÁBITOS</span>
                <span className="hud-value text-mission text-3xl">+150 XP</span>
              </div>
              <h3 className="hud-title-md text-white mb-3">Jejum Matinal</h3>
              <p className="font-barlow text-gray-400 text-sm mb-8 flex-1 leading-relaxed">Realizar um jejum até o meio-dia, dedicando o tempo da refeição à leitura da Palavra.</p>
              <button className="w-full bg-mission/10 border border-mission/20 hover:bg-mission hover:text-white text-mission hud-btn-text py-3 rounded-2xl transition-all">CONCLUIR MISSÃO</button>
            </div>
          </div>
        </section>

      </main>

      <GrantXpModal isOpen={isGrantModalOpen} onClose={() => setIsGrantModalOpen(false)} onGrant={handleGrantXp} valenteName={valente.name} />
    </>
  );
}