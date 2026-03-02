"use client";

import { mockValentes } from "@/lib/mockData";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LEVEL_SYSTEM } from "@/constants/gameConfig";

export default function TavernaPage() {
  return (
    <main className="min-h-screen bg-[#08090a] text-white font-barlow relative overflow-hidden">
      {/* Luzes ambiente sutis */}
      <div className="absolute top-0 left-1/4 w-[30%] h-[400px] bg-brand/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-[30%] h-[400px] bg-mission/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="p-6 md:p-12 max-w-7xl mx-auto relative z-10">
        <Suspense fallback={<div className="hud-title-md text-center pt-20 text-gray-500">Sincronizando...</div>}>
          <TavernaContent />
        </Suspense>
      </div>
    </main>
  );
}

function TavernaContent() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('from') || '/admin/valentes';
  
  const rankedValentes = [...mockValentes].sort((a, b) => b.totalXP - a.totalXP);
  const topThree = rankedValentes.slice(0, 3);
  const others = rankedValentes.slice(3);

  return (
    <>
      <div className="absolute top-8 left-6 md:left-12 z-50">
        <Link 
          href={returnUrl} 
          className="hud-label-tactical flex items-center gap-3 text-gray-500 hover:text-white transition-all group italic-none bg-white/5 px-5 py-2 rounded-full border border-white/10"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform leading-none">←</span>
          <span>VOLTAR AO QUARTEL</span>
        </Link>
      </div>

      <header className="text-center mb-24 pt-12">
        <h1 className="hud-title-lg text-7xl text-white m-0 tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          A TAVERNA
        </h1>
        <div className="flex items-center justify-center gap-4 mt-6 opacity-60">
          <div className="h-px w-12 bg-xp"></div>
          <p className="hud-label-tactical text-xp italic-none tracking-[0.5em] text-[12px]">
            MURAL DE GLÓRIA E HONRA
          </p>
          <div className="h-px w-12 bg-xp"></div>
        </div>
      </header>

      {/* PODIUM_ARENA */}
      <section className="flex flex-col md:flex-row justify-center items-center md:items-end gap-6 md:gap-10 mb-32 relative z-20">
        {topThree[1] && (
          <div className="w-full md:w-72 order-2 md:order-1">
            <MonolithCard 
              valente={topThree[1]} 
              rank={2} 
              themeColor="border-t-mission" 
              glow="shadow-[0_0_30px_rgba(16,185,129,0.15)]" 
              textColor="text-mission"
            />
          </div>
        )}
        
        {topThree[0] && (
          <div className="w-full md:w-80 order-1 md:order-2 z-30 transform md:-translate-y-12">
            <MonolithCard 
              valente={topThree[0]} 
              rank={1} 
              themeColor="border-t-brand" 
              glow="shadow-[0_0_50px_rgba(17,194,199,0.2)]" 
              textColor="text-brand"
              isFirst={true}
            />
          </div>
        )}
        
        {topThree[2] && (
          <div className="w-full md:w-72 order-3 md:order-3">
            <MonolithCard 
              valente={topThree[2]} 
              rank={3} 
              themeColor="border-t-xp" 
              glow="shadow-[0_0_30px_rgba(234,88,12,0.15)]" 
              textColor="text-xp"
            />
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-6 mb-12">
          <h2 className="hud-title-md text-3xl text-white m-0 tracking-widest text-gray-600">
            ELITE DE COMBATE
          </h2>
          <div className="h-px bg-white/5 flex-1"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {others.map((v, index) => <TavernaHeroCard key={v.id} valente={v} rank={index + 4} />)}
        </div>
      </section>
    </>
  );
}

function MonolithCard({ valente, rank, themeColor, glow, textColor, isFirst = false }: any) {
  const heightClass = isFirst ? "h-[450px]" : "h-[380px]";
  
  return (
    <div className={`relative flex flex-col w-full ${heightClass} bg-dark-bg backdrop-blur-md border border-white/10 ${themeColor} border-t-2 rounded-2xl overflow-hidden group transition-all duration-500 hover:-translate-y-2 ${glow}`}>
      
      {/* Portrait Section - SEM TEXTO ALT PARA EVITAR O NOME NO CANTO */}
      <div className="relative w-full h-[55%] flex items-center justify-center bg-black/10">
        <img 
          src={valente.image || '/images/man-silhouette.svg'} 
          alt="" 
          onError={(e) => { 
            e.currentTarget.onerror = null; 
            e.currentTarget.src = '/images/man-silhouette.svg'; 
          }}
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-1000" 
        />
      </div>

      {/* Data Section - Unidade de Identidade Integrada */}
      <div className="relative flex flex-col items-center justify-start flex-1 px-8 pb-8 z-10">
        
        {/* Bloco de Identidade: Rank + Nome como uma única peça tática */}
        <div className="flex flex-col items-center -mt-8">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center relative z-20 transition-all duration-300 group-hover:scale-110"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }}
          >
             <span className={`hud-title-md text-5xl ${textColor} leading-none mt-1 drop-shadow-[0_0_10px_currentColor]`}>
               {rank}º
             </span>
          </div>
          
          <h3 className="hud-title-md text-3xl text-white m-0 tracking-widest text-center uppercase drop-shadow-md">
            {valente.name}
          </h3>
        </div>
        
        <div className="mt-auto w-full pt-4 border-t border-white/5 flex justify-between items-end">
          <span className="hud-label-tactical text-[10px] text-gray-600 italic-none tracking-[0.2em] uppercase">Honra Total</span>
          <span className={`hud-value text-3xl leading-none ${textColor} drop-shadow-[0_0_8px_currentColor]`}>
            {valente.totalXP} <span className="text-xs hud-label-tactical text-gray-600 ml-1">XP</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function TavernaHeroCard({ valente, rank }: any) {
  const lvlInfo = [...LEVEL_SYSTEM].reverse().find(l => valente.totalXP >= l.minXP) || LEVEL_SYSTEM[0];

  return (
    <Link href={`/admin/valentes/${valente.id}`} className="block">
      <div className="relative bg-white/[0.03] backdrop-blur-md border border-white/5 hover:border-brand/40 rounded-2xl p-6 flex items-center gap-6 transition-all group overflow-hidden shadow-lg">
        
        <div className="absolute -left-4 -bottom-6 hud-title-lg text-8xl text-white opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
          {rank.toString().padStart(2, '0')}
        </div>

        <div className="w-16 h-16 bg-black/20 border border-white/10 rounded-xl overflow-hidden shrink-0 relative z-10 flex items-center justify-center">
          <img 
             src={valente.image || '/images/man-silhouette.svg'} 
             alt="" 
             onError={(e) => { 
               e.currentTarget.onerror = null; 
               e.currentTarget.src = '/images/man-silhouette.svg'; 
             }}
             className="w-full h-full object-contain p-2" 
          />
        </div>
        
        <div className="flex-1 min-w-0 relative z-10">
          <h4 className="hud-title-md text-3xl text-white m-0 truncate leading-none mb-1 group-hover:text-brand transition-colors">
            {valente.name}
          </h4>
          <div className="flex items-center gap-2 mt-2">
             <img src={lvlInfo.icon} alt="" className="w-8 h-8 object-contain opacity-40" />
             <span className="hud-label-tactical text-[20px] text-gray-600 italic-none uppercase tracking-widest">
                {lvlInfo.name.split(' ').pop()}
             </span>
          </div>
        </div>
        
        <div className="text-right shrink-0 relative z-10">
          <p className="hud-value text-white group-hover:text-brand transition-colors text-3xl leading-none">
            {valente.totalXP}
          </p>
          <p className="hud-label-tactical text-[9px] text-gray-700 mt-1 italic-none">PONTOS</p>
        </div>
      </div>
    </Link>
  );
}