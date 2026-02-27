"use client";

import { useState } from "react";
import Link from "next/link";
import { mockValentes } from "@/lib/mockData";

// THE ENGINE (Must match Patentes/Profile logic)
const LEVEL_SYSTEM = [
  { name: 'Nível 0', minXP: 0, icon: '/images/level-0.svg' },
  { name: 'Nível 1', minXP: 1000, icon: '/images/level-1.svg' },
  { name: 'Nível 2', minXP: 2000, icon: '/images/level-2.svg' },
  { name: 'Nível 3', minXP: 3500, icon: '/images/level-3.svg' },
  { name: 'Especial', minXP: 5000, icon: '/images/level-special.svg' },
  { name: 'Herói', minXP: 8000, icon: '/images/level-hero.svg' }
];

export default function ValentesList() {
  const [searchTerm, setSearchTerm] = useState("");

  const getTheme = (structure: string) => {
    const themes: any = {
      GAD: { text: 'text-[#ea580c]', border: 'border-[#ea580c]', bg: 'bg-[#ea580c]' },
      Mídia: { text: 'text-[#0ea5e9]', border: 'border-[#0ea5e9]', bg: 'bg-[#0ea5e9]' },
      Louvor: { text: 'text-[#8b5cf6]', border: 'border-[#8b5cf6]', bg: 'bg-[#8b5cf6]' },
      Intercessão: { text: 'text-[#10b981]', border: 'border-[#10b981]', bg: 'bg-[#10b981]' },
    };
    return themes[structure] || themes.GAD;
  };

  const filteredValentes = mockValentes.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.structure.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto flex flex-col">
      
      {/* HEADER AREA */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-bebas text-5xl tracking-widest text-white uppercase m-0">
            Quartel dos Valentes
          </h1>
          <p className="font-barlow text-gray-500 mt-1 uppercase tracking-widest font-bold">
            Monitoramento de Heróis e Patentes
          </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <input 
            type="text" 
            placeholder="BUSCAR HERÓI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 md:w-64 bg-[#232622] border border-gray-800 p-3 rounded-sm text-white font-barlow text-xs tracking-widest uppercase focus:border-[#ea580c] outline-none transition-all"
          />
          <Link 
            href="/admin/valentes/novo"
            className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-barlow font-bold px-6 py-3 rounded-sm tracking-widest uppercase text-xs shadow-lg transition-all"
          >
            + Recrutar
          </Link>
        </div>
      </header>

      {/* HERO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredValentes.map((valente) => {
          // ENGINE CALCULATION
          const lvlInfo = [...LEVEL_SYSTEM].reverse().find(l => valente.totalXP >= l.minXP) || LEVEL_SYSTEM[0];
          const nextLvl = LEVEL_SYSTEM[LEVEL_SYSTEM.indexOf(lvlInfo) + 1];
          const theme = getTheme(valente.structure);
          
          // XP Bar Progress
          const targetXP = nextLvl ? nextLvl.minXP : valente.totalXP;
          const xpPercent = nextLvl ? Math.min((valente.totalXP / targetXP) * 100, 100) : 100;

          return (
            <Link 
              key={valente.id} 
              href={`/admin/valentes/${valente.id}`}
              className="group bg-[#232622] border border-gray-800 hover:border-gray-600 rounded-sm overflow-hidden flex flex-col shadow-xl transition-all hover:-translate-y-1"
            >
              {/* TOP PORTRAIT AREA */}
              <div className="relative aspect-square overflow-hidden bg-[#1a1c19]">
                {valente.image ? (
                  <img src={valente.image} alt={valente.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-10">
                    <span className="font-bebas text-9xl text-white">{valente.name[0]}</span>
                  </div>
                )}
                
                {/* Level Badge Overlap */}
                <div className="absolute bottom-3 right-3 z-20">
                  <div className="bg-[#1a1c19]/90 border border-gray-700 p-2 rounded-sm backdrop-blur-md shadow-2xl flex items-center gap-2">
                    <img src={lvlInfo.icon} alt={lvlInfo.name} className="w-6 h-6 object-contain" />
                    <span className="font-staatliches text-lg text-white leading-none tracking-wider">
                      {lvlInfo.name.split(' ').pop()}
                    </span>
                  </div>
                </div>

                {/* Structure Overlay */}
                <div className={`absolute top-3 left-3 px-3 py-1 ${theme.bg} rounded-sm shadow-lg`}>
                   <span className="font-barlow text-white text-[9px] font-black tracking-widest uppercase">
                     {valente.structure}
                   </span>
                </div>
              </div>

              {/* INFO AREA */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bebas text-3xl text-white tracking-widest leading-none mb-1">
                  {valente.name}
                </h3>
                
                <div className="flex justify-between items-end mt-4 mb-2">
                  <span className="font-barlow text-gray-500 text-[10px] font-black tracking-widest uppercase">Experiência</span>
                  <span className="font-staatliches text-xl text-white leading-none">
                    {valente.totalXP} <span className="text-xs text-gray-600">/ {nextLvl ? nextLvl.minXP : 'MAX'}</span>
                  </span>
                </div>

                {/* Miniature XP Bar */}
                <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                  <div 
                    className={`h-full ${theme.bg} transition-all duration-1000`}
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800/50 flex justify-center">
                   <span className="font-barlow text-gray-400 group-hover:text-[#ea580c] text-[10px] font-black tracking-[0.2em] uppercase transition-colors">
                     Ver Ficha Completa →
                   </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}