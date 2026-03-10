"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ICONS } from "@/constants/gameConfig";

interface Relic {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  requirement?: number; // Optional quick view of XP requirement
}

// ⚔️ REUSING OUR PROVEN MAPS FOR CONSISTENCY
const rarityRayMap: Record<string, string> = {
  LEGENDARY: "/images/ray-legendary.png", 
  RARE: "/images/ray-rare.png",           
  COMMON: "/images/ray-common.png",       
};

const rarityColorMap: Record<string, string> = {
  LEGENDARY: "255, 170, 0", 
  RARE: "59, 130, 246", 
  COMMON: "255, 255, 255", 
};

const normalizeRarity = (rarity: string) => {
  const str = (rarity || "").toUpperCase().trim();
  if (str.includes("LEND") || str.includes("LEGEND")) return "LEGENDARY";
  if (str.includes("RAR")) return "RARE";
  return "COMMON";
};

// ⚔️ TEMPORARY MOCK DATA (Until you plug in your database)
const MOCK_RELICS: Relic[] = [
  { id: "1", name: "Coroa dos Caídos", description: "Uma coroa forjada a partir das armaduras dos inimigos derrotados na grande guerra de 1914.", icon: "/images/relics/relic-1.png", rarity: "LEGENDARY", requirement: 5000 },
  { id: "2", name: "Lâmina do Deserto", description: "Faca de trincheira adaptada. Carrega a areia e o sangue das campanhas do Sinai.", icon: "/images/relics/relic-2.png", rarity: "RARE", requirement: 2500 },
  { id: "3", name: "Medalha de Honra", description: "Concedida apenas àqueles que demonstraram bravura excepcional sob fogo inimigo pesado.", icon: "/images/relics/relic-3.png", rarity: "COMMON", requirement: 1000 },
];

export default function RelicsListView({ initialRelics = MOCK_RELICS }: { initialRelics?: Relic[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtering logic
  const filteredRelics = initialRelics.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.rarity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen px-4 py-6 max-w-7xl mx-auto flex flex-col text-white pb-20 font-barlow">
      
      {/* HEADER: Matches the Quartel layout perfectly */}
      <header className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-8 relative z-20">
        <div>
          <h1 className="hud-title-lg text-6xl text-white m-0 flex items-center gap-5 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <img 
              src={ICONS.relics || "/images/icons/relic-icon.png"} 
              alt="" 
              className="w-16 h-16 object-contain" 
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
            ACERVO
          </h1>
          <p className="hud-label-tactical text-brand mt-2 italic-none text-[11px] tracking-[0.3em]">
            CATÁLOGO E FORJA DE RELÍQUIAS DO REINO
          </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-5 items-center">
          <div className="relative w-full sm:w-80 group">
            <input 
              type="text"
              placeholder="LOCALIZAR RELÍQUIA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-surface border border-white/10 rounded-full px-5 py-2 text-[15px] font-bebas text-white outline-none focus:border-brand transition-all tracking-[0.2em] pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <img 
                src={ICONS.search || "/images/icons/search.png"}
                alt="Search" 
                className="w-5 h-5 object-contain opacity-50 transition-all grayscale brightness-200"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
          </div> 

          <Link 
            href="/admin/relics/create"
            className="bg-brand text-white hover:brightness-125 hud-title-md text-2xl px-10 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(17,194,199,0.4)] flex items-center leading-none whitespace-nowrap"
          >
            + FORJAR
          </Link>
        </div>
      </header>

      {/* RELICS GRID */}
      {filteredRelics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-40">
           <span className="hud-label-tactical text-[12px] tracking-[0.5em] uppercase">Nenhuma relíquia encontrada nos registros.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
          {filteredRelics.map((relic) => {
            const normalizedRarity = normalizeRarity(relic.rarity);
            const baseColor = rarityColorMap[normalizedRarity];
            const rayImageSrc = rarityRayMap[normalizedRarity];

            return (
              <div 
                key={relic.id} 
                className="group relative bg-dark-surface-80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-white/30 shadow-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              >
                {/* ⚔️ THE ASSET DISPLAY (Scaled for cards) */}
                <div className="w-full h-40 relative flex items-center justify-center pointer-events-none mb-6 border-b border-white/5 pb-4">
                  
                  {/* BF1 Ray (Visible on Hover for an interactive pop) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
                     <img 
                       src={rayImageSrc}
                       alt=""
                       className="w-full h-full object-contain mix-blend-screen scale-[1.5] opacity-50 group-hover:opacity-100 group-hover:scale-[1.8] transition-all duration-700"
                       onError={(e) => e.currentTarget.style.display = 'none'}
                     />
                  </div>
                  
                  {/* The Icon */}
                  <div className="relative w-[80%] h-[80%] z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                    <Image 
                      src={relic.icon || "/images/placeholder.png"} 
                      alt={relic.name} 
                      fill 
                      className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]" 
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="hud-title-md text-white text-2xl leading-tight truncate group-hover:text-brand transition-colors">
                      {relic.name}
                    </h3>
                    
                    {/* Glowing Rarity Tag */}
                    <div 
                      className="shrink-0 relative overflow-hidden flex items-center justify-center px-3 py-1 rounded-sm backdrop-blur-md"
                      style={{
                        color: '#ffffff',
                        textShadow: `0 0 8px rgb(${baseColor})`,
                        border: `1px solid rgba(${baseColor}, 0.5)`,
                        background: `linear-gradient(135deg, rgba(${baseColor}, 0.2) 0%, rgba(${baseColor}, 0.05) 100%)`,
                      }}
                    >
                      <span className="hud-label-tactical text-[8px] tracking-widest uppercase relative z-10 font-bold">
                        {relic.rarity}
                      </span>
                    </div>
                  </div>
                  
                  <p className="font-barlow text-sm text-gray-400 line-clamp-2 mb-6 flex-1">
                    {relic.description}
                  </p>

                  {/* Actions / Info Row */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto">
                    <div className="flex flex-col">
                      <span className="hud-label-tactical text-[8px] text-gray-500 uppercase tracking-widest">Base de Desbloqueio</span>
                      <span className="hud-value text-[14px] text-gray-300">
                        {relic.requirement ? `${relic.requirement} XP` : "MÚLTIPLAS ROTAS"}
                      </span>
                    </div>

                    <Link 
                      href={`/admin/relics/${relic.id}/edit`}
                      className="px-4 py-2 flex items-center gap-2 rounded-full border border-white/10 hover:border-brand hover:bg-brand/10 text-gray-400 hover:text-brand transition-all"
                    >
                      <span className="hud-label-tactical text-[9px] tracking-widest uppercase font-bold">EDITAR</span>
                      <span className="text-[12px] leading-none">→</span>
                    </Link>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}