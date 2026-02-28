"use client";

import { useState } from "react";
import Link from "next/link";
import { mockValentes } from "@/lib/mockData";
// 1. IMPORT FROM CONFIG
import { ESTRUTURAS, LEVEL_SYSTEM } from "@/constants/gameConfig";

export default function ValentesList() {
  const [searchTerm, setSearchTerm] = useState("");

  // 2. REPAIRED THEME ENGINE
  const getTheme = (valenteStructure: string) => {
    // We search the config values to see if the valente's structure matches the Label
    // NOTE: Make sure your gameConfig labels (like "IMS") match your mockData strings!
    const structureEntry = Object.values(ESTRUTURAS).find(
      (s) => s.label.toLowerCase() === valenteStructure.toLowerCase()
    );

    // Fallback to GAD if the name doesn't match
    const activeStructure = structureEntry || ESTRUTURAS.GAD;
    
    return {
      color: activeStructure.color,
      label: activeStructure.label
    };
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
            href="/admin/valentes/new"
            className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-barlow font-bold px-6 py-3 rounded-sm tracking-widest uppercase text-xs shadow-lg transition-all"
          >
            + Recrutar
          </Link>
        </div>
      </header>

      {/* HERO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredValentes.map((valente) => {
          const lvlInfo = [...LEVEL_SYSTEM].reverse().find(l => valente.totalXP >= l.minXP) || LEVEL_SYSTEM[0];
          const nextLvl = LEVEL_SYSTEM[LEVEL_SYSTEM.indexOf(lvlInfo) + 1];
          
          // 3. GET DYNAMIC THEME
          const theme = getTheme(valente.structure);
          
          const targetXP = nextLvl ? nextLvl.minXP : valente.totalXP;
          const xpPercent = nextLvl ? Math.min((valente.totalXP / targetXP) * 100, 100) : 100;

          return (
            <Link 
              key={valente.id} 
              href={`/admin/valentes/${valente.id}`}
              className="group bg-[#232622] border border-gray-800 hover:border-gray-600 rounded-sm overflow-hidden flex flex-col shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden bg-[#1a1c19]">
                {valente.image ? (
                  <img src={valente.image} alt={valente.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-10">
                    <span className="font-bebas text-9xl text-white">{valente.name[0]}</span>
                  </div>
                )}
                
                <div className="absolute bottom-3 right-3 z-20">
                  <div className="bg-[#1a1c19]/90 border border-gray-700 p-2 rounded-sm backdrop-blur-md shadow-2xl flex items-center gap-2">
                    <img src={lvlInfo.icon} alt={lvlInfo.name} className="w-6 h-6 object-contain" />
                    <span className="font-staatliches text-lg text-white leading-none tracking-wider">
                      {lvlInfo.name.split(' ').pop()}
                    </span>
                  </div>
                </div>

                {/* 4. DYNAMIC BACKGROUND COLOR (Style Prop is the key!) */}
                <div 
                  className="absolute top-3 left-3 px-3 py-1 rounded-sm shadow-lg"
                  style={{ backgroundColor: theme.color }}
                >
                   <span className="font-barlow text-white text-[9px] font-black tracking-widest uppercase">
                     {theme.label}
                   </span>
                </div>
              </div>

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

                {/* 5. DYNAMIC XP BAR COLOR */}
                <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                  <div 
                    className="h-full transition-all duration-1000"
                    style={{ width: `${xpPercent}%`, backgroundColor: theme.color }}
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