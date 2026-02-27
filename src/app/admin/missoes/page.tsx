"use client";

import { useState } from "react";
import { mockMissions } from "@/lib/mockData";
import Link from "next/link";

export default function MissoesPage() {
  // 1. Create a "Live State" for the missions so they can be deleted
  // Uses .reverse() so the newest missions appear at the top
  const [missions, setMissions] = useState([...mockMissions].reverse());
  const [activeFilter, setActiveFilter] = useState("TODAS");

  const categories = [
    "Hábitos Espirituais", 
    "Evangelismo e Liderança", 
    "Conhecimento", 
    "Estrutura e Participação", 
    "Eventos e Especiais"
  ];

  // 2. The Delete Logic
  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente arquivar esta missão das crônicas?")) {
      setMissions(missions.filter(m => m.id !== id));
    }
  };

  return (
    <main className="min-h-screen py-8 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="font-bebas text-6xl text-white tracking-widest m-0 leading-none">
            MISSÕES DISPONÍVEIS
          </h1>
          <p className="font-staatliches text-xl text-[#ea580c] tracking-widest uppercase mt-2">
            O Mural de Desafios do Reino
          </p>
        </div>
        
        <Link 
          href="/admin/missoes/nova"
          className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-barlow font-bold px-8 py-3 rounded-sm tracking-widest uppercase transition-all shadow-lg flex items-center gap-2 group shrink-0"
        >
          <span className="text-xl group-hover:rotate-90 transition-transform">+</span> 
          FORJAR MISSÃO
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-6 mb-8 border-b border-gray-800 custom-scrollbar">
        <button
          onClick={() => setActiveFilter("TODAS")}
          className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
            activeFilter === "TODAS" ? "bg-[#ea580c] border-[#ea580c] text-white" : "border-gray-700 text-gray-500 hover:text-gray-300"
          }`}
        >
          Ver Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
              activeFilter === cat ? "bg-[#ea580c] border-[#ea580c] text-white" : "border-gray-700 text-gray-500 hover:text-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Missions List */}
      <div className="pb-20">
        {activeFilter === "TODAS" ? (
          categories.map((cat) => {
            const missionsInCat = missions.filter(m => m.category === cat);
            if (missionsInCat.length === 0) return null;

            return (
              <section key={cat} className="pt-16 first:pt-4">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-bebas text-4xl text-white tracking-widest uppercase">{cat}</h2>
                  <div className="h-px bg-gray-800 flex-1"></div>
                  <span className="font-staatliches text-[#ea580c] text-2xl">{missionsInCat.length}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
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

// THE CARD COMPONENT
function MissionCard({ mission, onDelete }: { mission: any, onDelete: () => void }) {
  const isLvlUp = mission.xpReward === 'LVL UP DIRETO';
  const isActive = true;

  return (
    <div className="bg-[#232622] border border-gray-800 p-6 rounded-sm flex flex-col hover:border-[#ea580c]/50 transition-all shadow-xl group relative overflow-hidden">
      
      {/* Background Glow */}
      <div className={`absolute -top-10 -left-10 w-32 h-32 blur-[50px] opacity-10 rounded-full ${isLvlUp ? 'bg-red-500' : 'bg-blue-500'}`}></div>

      <div className="flex flex-col mb-6 relative z-10">
        <div className={`font-bebas text-5xl tracking-normal leading-none transition-transform group-hover:scale-105 origin-left duration-300 flex items-center ${
          isLvlUp ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]'
        }`}>
          {!isLvlUp && <span className="text-3xl mr-1 opacity-70 mb-1">+</span>}
          <span>{isLvlUp ? 'LVL UP' : mission.xpReward}</span>
          {!isLvlUp && <span className="text-2xl ml-2 opacity-90 mt-2">XP</span>}
        </div>

        {/* Status Light */}
        <div className="flex items-center gap-1.5 mt-3">
          <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)] ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`}></span>
          <span className={`font-barlow text-[8px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-emerald-500/80' : 'text-gray-500'}`}>
            {isActive ? 'Missão em Vigência' : 'Quest Arquivada'}
          </span>
        </div>
      </div>

      <h3 className="font-bebas text-3xl text-white mb-3 tracking-wide leading-tight uppercase group-hover:text-[#ea580c] transition-colors relative z-10">
        {mission.title}
      </h3>

      <p className="font-barlow text-gray-500 text-sm mb-8 flex-1 italic leading-relaxed border-l-2 border-gray-800 pl-4 relative z-10">
        {mission.description || "Cumpra este desafio para fortalecer sua jornada e ganhar prestígio no Mural de Glória."}
      </p>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 pt-4 border-t border-gray-800/50 relative z-10">
        <Link 
          href={`/admin/missoes/${mission.id}/edit`}
          className="flex-1 bg-[#1a1c19] border border-gray-700 text-gray-400 hover:text-white hover:border-[#ea580c] py-2 rounded-sm font-barlow font-bold text-[10px] uppercase tracking-widest transition-all text-center"
        >
          Editar Quest
        </Link>
        <button 
          onClick={onDelete}
          className="px-4 bg-[#1a1c19] border border-red-900/20 text-red-900/40 hover:text-red-500 hover:border-red-500 transition-all rounded-sm flex items-center justify-center"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}