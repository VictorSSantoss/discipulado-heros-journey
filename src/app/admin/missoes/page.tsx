"use client";

import { useState } from "react";
import { mockMissions } from "@/lib/mockData";
import Link from "next/link";
import { ICONS, MISSION_CATEGORIES } from "@/constants/gameConfig";

/**
 * MissoesPage Component
 * A high-density dashboard for managing active kingdom decrees.
 */
export default function MissoesPage() {
  const [missions, setMissions] = useState([...mockMissions].reverse());
  const [activeFilter, setActiveFilter] = useState("TODAS");

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente arquivar esta missão das crônicas?")) {
      setMissions(missions.filter(m => m.id !== id));
    }
  };

  return (
    <main className="min-h-screen py-6 px-4 md:px-8 max-w-7xl mx-auto text-white font-barlow overflow-x-hidden">
      
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
        
        <Link 
          href="/admin/missoes/nova"
          className="bg-mission hover:brightness-110 text-white hud-title-md px-8 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 group shrink-0"
        >
          <span className="text-2xl group-hover:rotate-90 transition-transform duration-300 leading-none">+</span> 
          FORJAR MISSÃO
        </Link>
      </header>

      {/* CONTAINER 2: PROTECTED FILTER TRACK */}
      {/* Added vertical padding (pt-4, pb-4) to prevent the glow from being cut off at the top and bottom edges */}
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
        {activeFilter === "TODAS" ? (
          MISSION_CATEGORIES.map((cat) => {
            const missionsInCat = missions.filter(m => m.category === cat);
            if (missionsInCat.length === 0) return null;

            return (
              <section key={cat} className="pt-8 first:pt-0">
                {/* CONTAINER 4: CATEGORY IDENTITY BLOCK */}
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="hud-title-md text-white m-0">
                    {cat}
                  </h2>
                  <div className="h-px bg-gradient-to-r from-white/10 to-transparent flex-1"></div>
                  <span className="font-staatliches tracking-widest text-mission text-xl opacity-80 leading-none">
                    {missionsInCat.length} ATIVAS
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {missionsInCat.map((mission) => (
                    <MissionCard key={mission.id} mission={mission} onDelete={() => handleDelete(mission.id)} />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {missions
              .filter(m => m.category === activeFilter)
              .map((mission) => (
                <MissionCard key={mission.id} mission={mission} onDelete={() => handleDelete(mission.id)} />
              ))
            }
          </div>
        )}
      </div>
    </main>
  );
}

/**
 * MissionCard Sub-Component
 * Refined with semantic text scaling to prevent layout overflow.
 */
function MissionCard({ mission, onDelete }: { mission: any, onDelete: () => void }) {
  const isLvlUp = mission.xpReward === 'LVL UP DIRETO';
  const isActive = true;

  return (
    <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col hover:border-mission/30 transition-all shadow-xl group relative overflow-hidden">
      {/* CONTAINER 5: AMBIENT HUD LIGHTING */}
      <div className={`absolute -top-12 -left-12 w-40 h-40 blur-[50px] opacity-10 rounded-full pointer-events-none ${
        isLvlUp ? 'bg-brand' : 'bg-xp'
      }`}></div>

      {/* CONTAINER 6: REWARD DISPLAY WRAPPER */}
      <div className="flex flex-col mb-6 relative z-10">
        <div className={`hud-value flex items-end ${
          isLvlUp ? 'text-brand drop-shadow-[0_0_12px_rgba(17,194,199,0.4)]' : 'text-xp drop-shadow-[0_0_12px_rgba(234,88,12,0.4)]'
        }`}>
          {!isLvlUp && <span className="text-3xl mr-1 opacity-60 mb-1">+</span>}
          <span>{isLvlUp ? 'LVL UP' : mission.xpReward}</span>
          {!isLvlUp && <span className="font-barlow font-black text-sm ml-1.5 opacity-60 mb-1.5 uppercase tracking-widest">XP</span>}
        </div>

        {/* CONTAINER 7: MISSION SENSOR LIGHT */}
        <div className="flex items-center gap-2 mt-3 bg-dark-bg/60 w-fit px-2.5 py-1 rounded-lg border border-white/5">
          <span className={`w-1.5 h-1.5 rounded-full ${
            isActive ? 'bg-mission animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'bg-gray-600'
          }`}></span>
          <span className="hud-label-tactical text-[8px] text-gray-400">
            {isActive ? 'Missão em Vigência' : 'Quest Arquivada'}
          </span>
        </div>
      </div>

      <h3 className="hud-title-md text-white mb-3 leading-tight group-hover:text-mission transition-colors relative z-10">
        {mission.title}
      </h3>

      <p className="font-barlow text-gray-500 text-[13px] mb-8 flex-1 leading-relaxed border-l border-white/10 pl-4 relative z-10">
        {mission.description || "Challenge entry under observation."}
      </p>

      {/* CONTAINER 8: CARD ACTIONS WRAPPER */}
      <div className="flex gap-2 pt-5 border-t border-white/5 relative z-10 mt-auto">
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
  );
}