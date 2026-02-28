"use client";

import { use, useEffect, useState } from "react";
import { mockValentes } from "@/lib/mockData";
import { notFound } from "next/navigation";
import Link from "next/link";

import AttributesChart from "@/components/AttributesChart";
import LoveLanguagesChart from "@/components/LoveLanguagesChart";
import HolyPowerBars from "@/components/HolyPowerBars";
import BestFriendsList from "@/components/BestFriendsList";
import GrantXpModal from "@/components/GrantXpModal";
import TavernaPreview from "@/components/TavernaPreview";

// DYNAMIC LEVELING ENGINE (With SVG paths)
const LEVEL_SYSTEM = [
  { name: 'Valente de Nível 0', minXP: 0, icon: '/images/level-0.svg' },
  { name: 'Valente de Nível 1', minXP: 1000, icon: '/images/level-1.svg' },
  { name: 'Valente de Nível 2', minXP: 2000, icon: '/images/level-2.svg' },
  { name: 'Valente de Nível 3', minXP: 3500, icon: '/images/level-3.svg' },
  { name: 'Valente Especial', minXP: 5000, icon: '/images/level-special.svg' },
  { name: 'Herói do Reino', minXP: 8000, icon: '/images/level-hero.svg' }
];

export default function ValenteProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  const [xpWidth, setXpWidth] = useState(0); 
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);

  const foundValente = mockValentes.find((v) => v.id === id);
  const [valente, setValente] = useState(foundValente);

  // ENGINE LOGIC: Calculate current and next level automatically based on totalXP
  const currentLevelInfo = valente 
    ? [...LEVEL_SYSTEM].reverse().find(lvl => valente.totalXP >= lvl.minXP) || LEVEL_SYSTEM[0] 
    : LEVEL_SYSTEM[0];
  const currentLevelIndex = LEVEL_SYSTEM.findIndex(lvl => lvl.name === currentLevelInfo.name);
  const nextLevelInfo = LEVEL_SYSTEM[currentLevelIndex + 1];

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && valente) {
      // Bar fills based on the target of the NEXT level
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

  if (!mounted) return <div className="min-h-screen bg-[#1a1c19] flex items-center justify-center"><span className="font-bebas text-3xl text-[#ea580c] animate-pulse tracking-widest">Acessando Arquivos...</span></div>;
  if (!valente) return notFound();

  const theme = {
    GAD: { hex: '#ea580c', secondary: '#fb923c', tailwind: 'text-[#ea580c]', border: 'border-[#ea580c]', bg: 'bg-[#ea580c]', glow: 'bg-[#ea580c]' },
    Mídia: { hex: '#0ea5e9', secondary: '#38bdf8', tailwind: 'text-[#0ea5e9]', border: 'border-[#0ea5e9]', bg: 'bg-[#0ea5e9]', glow: 'bg-[#0ea5e9]' },
    Louvor: { hex: '#8b5cf6', secondary: '#a78bfa', tailwind: 'text-[#8b5cf6]', border: 'border-[#8b5cf6]', bg: 'bg-[#8b5cf6]', glow: 'bg-[#8b5cf6]' },
    Intercessão: { hex: '#10b981', secondary: '#34d399', tailwind: 'text-[#10b981]', border: 'border-[#10b981]', bg: 'bg-[#10b981]', glow: 'bg-[#10b981]' },
  }[valente.structure] || { hex: '#ea580c', secondary: '#fb923c', tailwind: 'text-[#ea580c]', border: 'border-[#ea580c]', bg: 'bg-[#ea580c]', glow: 'bg-[#ea580c]' };

  const arcLength = 251.2; 
  const dashOffset = arcLength * (1 - xpWidth / 100);

  return (
    <>
      <main className="min-h-screen p-6 max-w-7xl mx-auto flex flex-col">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Link href="/admin/valentes" className="flex items-center gap-2 text-gray-500 hover:text-[#ea580c] font-barlow font-bold uppercase tracking-widest text-sm transition-colors">
            <span>←</span> Voltar para o Quartel
          </Link>
          <div className="flex gap-3">
            <Link href={`/admin/valentes/${valente.id}/edit`} className="bg-transparent border border-gray-600 text-gray-300 hover:text-[#ea580c] hover:border-[#ea580c] font-barlow font-bold px-6 py-2 rounded-sm tracking-widest uppercase transition-all text-xs">
              Editar Ficha
            </Link>
            <button onClick={() => setIsGrantModalOpen(true)} className={`${theme.bg} text-white font-barlow font-bold px-6 py-2 rounded-sm tracking-widest uppercase hover:brightness-110 transition-all text-xs shadow-lg`}>
              + Conceder XP
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center bg-[#232622] p-8 border border-gray-800 rounded-sm shadow-2xl relative overflow-hidden">
              <h1 className="font-bebas text-5xl text-white tracking-widest text-center m-0 leading-none mb-8 drop-shadow-lg">
                {valente.name}
              </h1>

              <div className="w-full aspect-[3/4] max-w-[220px] bg-[#1a1c19] border border-gray-700 rounded-sm overflow-hidden flex items-center justify-center relative shadow-2xl z-10">
                <div className="absolute inset-3 border border-cyan-500/30 pointer-events-none z-20 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)]"></div>
                <div className="absolute top-3 left-3 w-2 h-2 border-t-2 border-l-2 border-cyan-400 z-30"></div>
                <div className="absolute top-3 right-3 w-2 h-2 border-t-2 border-r-2 border-cyan-400 z-30"></div>
                <div className="absolute bottom-3 left-3 w-2 h-2 border-b-2 border-l-2 border-cyan-400 z-30"></div>
                <div className="absolute bottom-3 right-3 w-2 h-2 border-b-2 border-r-2 border-cyan-400 z-30"></div>
                {valente.image ? <img src={valente.image} className="w-full h-full object-cover z-10" alt={valente.name}/> : <span className="text-9xl opacity-10 font-bebas text-white z-10">{valente.name.substring(0, 1)}</span>}
              </div>

              <div className="relative w-full max-w-[260px] flex flex-col items-center justify-center mt-15 z-20">
                <svg viewBox="0 0 200 120" className="w-full drop-shadow-2xl">
                  <defs>
                    <linearGradient id="structureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={theme.hex} />
                      <stop offset="100%" stopColor={theme.secondary} />
                    </linearGradient>
                  </defs>
                  <path d="M 20 20 A 80 80 0 0 0 180 20" fill="none" stroke="#111827" strokeWidth="14" strokeLinecap="round" />
                  <path d="M 20 20 A 80 80 0 0 0 180 20" fill="none" stroke="url(#structureGradient)" strokeWidth="14" strokeLinecap="round" strokeDasharray={arcLength} strokeDashoffset={dashOffset} className="transition-all duration-1000 ease-out" />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-start pt-2">
                  
                  {/* SVG ICON REPLACEMENT */}
                  <img 
                    src={currentLevelInfo.icon} 
                    alt={currentLevelInfo.name} 
                    className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] -mt-30 animate-bounce-slow" 
                  />
                  
                  <span className={`font-barlow ${theme.tailwind} text-base  uppercase font-black tracking-[0.2em] leading-tight text-center w-[180px] drop-shadow-md mb-6`}>
                    {currentLevelInfo.name}
                  </span>
                  <div className="mt-2 flex flex-col items-center">
                    <span className="font-staatliches text-4xl text-white tracking-widest leading-none drop-shadow-md">
                      {valente.totalXP} 
                      <span className="text-lg text-gray-500 font-barlow font-bold ml-2">XP</span>
                    </span>
                    <span className="font-barlow text-[15px] text-gray-600 uppercase font-bold tracking-tighter mt-1">
                      META: {nextLevelInfo ? nextLevelInfo.minXP : 'MÁXIMO'} XP
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 relative group cursor-default">
                <div className={`absolute -inset-1 ${theme.glow} opacity-10 blur-xl group-hover:opacity-30 transition-opacity`}></div>
                <div className="relative flex flex-col items-center">
                  <div className={`${theme.bg} px-4 py-0.5 rounded-t-sm transform -skew-x-12 mb-[-2px] z-10 shadow-lg`}>
                    <span className="font-barlow text-white text-[9px] uppercase font-black tracking-[0.4em]">ESTRUTURA</span>
                  </div>
                  <div className={`bg-[#1a1c19] border-2 ${theme.border} px-10 py-2 shadow-2xl flex items-center justify-center min-w-[180px] relative`}>
                    <div className={`absolute top-0 left-0 w-1 h-1 ${theme.bg}`}></div>
                    <div className={`absolute top-0 right-0 w-1 h-1 ${theme.bg}`}></div>
                    <div className={`absolute bottom-0 left-0 w-1 h-1 ${theme.bg}`}></div>
                    <div className={`absolute bottom-0 right-0 w-1 h-1 ${theme.bg}`}></div>
                    <span className="font-staatliches text-3xl text-white tracking-[0.2em] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{valente.structure}</span>
                  </div>
                  <div className={`w-12 h-1 ${theme.bg} mt-2 rounded-full opacity-50`}></div>
                </div>
              </div>
            </div>

            <div className="bg-[#232622] p-6 border border-gray-800 rounded-sm shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 text-white/5 text-7xl font-bebas pointer-events-none uppercase">Lore</div>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-1 h-4 ${theme.bg}`}></div>
                <h3 className="font-barlow text-gray-300 font-bold uppercase text-[10px] tracking-[0.25em]">Crônicas do Valente</h3>
              </div>
              <p className={`font-barlow text-gray-400 text-sm leading-relaxed relative z-10 first-letter:text-2xl first-letter:font-bebas first-letter:${theme.tailwind} first-letter:mr-1`}>
                {valente.description || "Este herói ainda não registrou seus feitos nas crônicas do Reino."}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[#232622] p-4 border border-gray-800 rounded-sm">
              <h2 className="font-bebas text-2xl text-white text-center border-b border-gray-700 pb-2 mb-4">ATRIBUTOS</h2>
              <AttributesChart skills={valente.skills} />
            </div>
            <div className="bg-[#232622] p-4 border border-gray-800 rounded-sm">
              <h2 className="font-bebas text-2xl text-white text-center border-b border-gray-700 pb-2 mb-4">LINGUAGENS</h2>
              <LoveLanguagesChart data={valente.loveLanguages} />
            </div>
            <TavernaPreview />
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[#232622] p-4 border border-gray-800 rounded-sm">
              <h2 className="font-bebas text-2xl text-white text-center border-b border-gray-700 pb-2 mb-4">PODER SANTO</h2>
              <HolyPowerBars powers={valente.holyPower} />
            </div>
            <div className="bg-[#232622] p-4 border border-gray-800 rounded-sm">
              <h2 className="font-bebas text-2xl text-white text-center border-b border-gray-700 pb-2 mb-4">COMPANHEIROS</h2>
              <BestFriendsList friendIds={valente.friendIds} />
            </div>
          </div>
        </div>
      
        {/* =========================================
        SEPARATE SECTION: MISSION BOARD 
        ========================================= */}
        <section className="mt-20 pt-16 border-t-2 border-dashed border-gray-800 relative">
          
          {/* Decorative Anchor Point */}
          <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 bg-[#1a1c19] px-4">
            <span className="text-gray-700 text-xl">⚔️</span>
          </div>

          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h2 className="font-bebas text-4xl tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(234,179,8,0.2)] flex items-center gap-3 m-0">
                <span className="text-yellow-500">📜</span> Mural de Decretos
              </h2>
              <p className="font-barlow text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                Missões ativas disponíveis para {valente.name}
              </p>
            </div>
            <button className="text-[10px] font-barlow font-bold uppercase tracking-widest text-gray-400 hover:text-white border border-gray-700 hover:border-white px-4 py-2 rounded-sm transition-all bg-[#232622]">
              Ver Histórico Completo →
            </button>
          </header>

          {/* Mission Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Mock Mission Card 1 */}
            <div className="bg-[#232622] border border-gray-800 p-5 rounded-sm flex flex-col hover:border-yellow-500/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#1a1c19] text-gray-400 border border-gray-700 font-barlow text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm">
                  Hábitos Espirituais
                </span>
                <span className="font-staatliches text-2xl text-cyan-400">+150 XP</span>
              </div>
              
              <h3 className="font-bebas text-2xl text-white tracking-widest mb-2">Jejum Matinal</h3>
              <p className="font-barlow text-gray-500 text-sm mb-6 flex-1">
                Realizar um jejum até o meio-dia, dedicando o tempo da refeição à leitura da Palavra.
              </p>
              
              <button className="w-full bg-[#1a1c19] border border-gray-700 hover:border-cyan-500 hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 font-barlow font-bold uppercase tracking-widest text-[10px] py-3 rounded-sm transition-all">
                Marcar como Concluída
              </button>
            </div>

            {/* Mock Mission Card 2 */}
            <div className="bg-[#232622] border border-gray-800 p-5 rounded-sm flex flex-col hover:border-yellow-500/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#1a1c19] text-gray-400 border border-gray-700 font-barlow text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm">
                  Conhecimento
                </span>
                <span className="font-staatliches text-2xl text-cyan-400">+300 XP</span>
              </div>
              
              <h3 className="font-bebas text-2xl text-white tracking-widest mb-2">Resumo de Neemias</h3>
              <p className="font-barlow text-gray-500 text-sm mb-6 flex-1">
                Entregar um resumo de 1 página sobre os princípios de liderança encontrados no livro de Neemias.
              </p>
              
              <button className="w-full bg-[#1a1c19] border border-gray-700 hover:border-cyan-500 hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 font-barlow font-bold uppercase tracking-widest text-[10px] py-3 rounded-sm transition-all">
                Marcar como Concluída
              </button>
            </div>

            {/* Mock Mission Card 3 (Structure Specific) */}
            <div className="bg-[#232622] border border-gray-800 p-5 rounded-sm flex flex-col hover:border-yellow-500/50 transition-all group relative overflow-hidden">
              {/* Uses the Valente's structure color dynamically */}
              <div className={`absolute top-0 left-0 w-1 h-full ${theme.bg} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <span className={`bg-[#1a1c19] ${theme.tailwind} border border-gray-700 font-barlow text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm`}>
                  Estrutura: {valente.structure}
                </span>
                <span className="font-staatliches text-2xl text-cyan-400">+500 XP</span>
              </div>
              
              <h3 className="font-bebas text-2xl text-white tracking-widest mb-2">Apoio no Culto Jovem</h3>
              <p className="font-barlow text-gray-500 text-sm mb-6 flex-1">
                Chegar 1 hora antes do culto para auxiliar na montagem e organização da sua estrutura.
              </p>
              
              <button className="w-full bg-[#1a1c19] border border-gray-700 hover:border-cyan-500 hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 font-barlow font-bold uppercase tracking-widest text-[10px] py-3 rounded-sm transition-all">
                Marcar como Concluída
              </button>
            </div>

          </div>
        </section>

      </main>

      <GrantXpModal isOpen={isGrantModalOpen} onClose={() => setIsGrantModalOpen(false)} onGrant={handleGrantXp} valenteName={valente.name} />
    </>
  );
}