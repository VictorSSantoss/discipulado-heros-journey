"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ICONS } from "@/constants/gameConfig";

// ⚔️ Master Permission Interface
export interface RelicPermissions {
  canForge: boolean;
  canEdit: boolean;
}

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

// Map database rarity to Filter Labels
const filterCategories = ["TODAS", "LENDÁRIAS", "RARAS", "COMUNS"];

const mapRarityToFilter = (rarity: string) => {
  if (rarity === "LEGENDARY") return "LENDÁRIAS";
  if (rarity === "RARE") return "RARAS";
  return "COMUNS";
};

export default function ReliquiaClient({ 
  initialCatalog,
  permissions = { canForge: false, canEdit: false } // Default to "Player Mode" if not provided
}: { 
  initialCatalog: any[],
  permissions?: RelicPermissions
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("TODAS");

  // Filter Logic: Applies both Search and Category
  const filteredRelics = initialCatalog.filter(relic => {
    const matchesSearch = relic.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "TODAS" || mapRarityToFilter(relic.rarity) === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      
      {/* HUD HEADER & SEARCH */}
      <div className="flex flex-col space-y-6 border-b border-white/5 pb-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full max-w-xl group">
            {/* HUD Search Icon with Neon Drop Shadow */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <Image src={ICONS.search} alt="" width={62} height={62} className="drop-shadow-[0_0_8px_rgba(17,194,199,0.5)]" />
            </div>
            <input 
              type="text"
              placeholder="BUSCAR NO ACERVO DE ARTEFATOS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '90px' }} // FORCE text to the right
              className="w-full bg-brand/20 border border-white/10 rounded-xl py-5 pr-6 text-xs font-barlow tracking-widest outline-none focus:border-brand/60 transition-all text-white placeholder:text-gray-600 uppercase shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
            />
          </div>
          
          <div className="hud-label-tactical text-[10px] text-gray-500 tracking-[0.3em] uppercase bg-white/5 px-6 py-3 rounded-xl border border-white/5">
            ARTEFATOS NO ACERVO: <span className="text-brand text-sm ml-2">{filteredRelics.length}</span>
          </div>
        </div>

        {/* ⚔️ HUD CATEGORY SLIDER */}
        <div className="relative overflow-visible w-full">
          <div className="flex gap-3 overflow-x-auto px-4 py-4 pb-4 custom-category-scroll overflow-visible">
            {filterCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full hud-label-tactical text-[10px] tracking-widest transition-all border uppercase font-normal ${
                  filterCategory === cat 
                  ? 'bg-brand/20 border-brand text-brand shadow-[0_0_15px_rgba(17,194,199,0.4)]' 
                  : 'bg-black/40 text-gray-500 border-white/10 hover:text-white hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* RELICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        
        {/* ⚔️ CONDITIONAL FORGE BUTTON (Only Master/Admin sees this) */}
        {permissions.canForge && (
          <Link 
            href="/admin/reliquias/create"
            className="group relative h-[450px] bg-brand/5 border-2 border-dashed border-brand/20 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-brand hover:bg-brand/10 transition-all duration-500 shadow-[inset_0_0_50px_rgba(17,194,199,0.05)]"
          >
            <div className="w-16 h-16 rounded-full border border-brand/30 flex items-center justify-center group-hover:border-brand transition-all shadow-[0_0_20px_rgba(17,194,199,0.2)] bg-brand/10">
               <span className="text-3xl text-brand group-hover:scale-125 transition-transform">+</span>
            </div>
            <span className="hud-label-tactical text-[11px] text-brand tracking-[0.2em] uppercase mt-2">FORJAR NOVO ARTEFATO</span>
          </Link>
        )}

        {/* MASTER CATALOG RENDERING */}
        {filteredRelics.map((relic) => {
          const baseColor = rarityColorMap[relic.rarity] || "255, 255, 255";
          const rayImage = rarityRayMap[relic.rarity] || rarityRayMap.COMMON;
          
          const alternatives = Array.isArray(relic.ruleParams) ? relic.ruleParams : [];
          const firstReq = alternatives[0];

          // ⚔️ Dynamic Wrapper: Link if Admin, Div if Player
          const CardWrapper = permissions.canEdit ? Link : "div";
          const wrapperProps = permissions.canEdit ? { href: `/admin/reliquias/${relic.id}/edit` } : {};

          return (
            <CardWrapper 
              key={relic.id} 
              {...(wrapperProps as any)}
              className={`group relative bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-500 h-[450px] overflow-hidden ${
                permissions.canEdit ? 'cursor-pointer hover:-translate-y-2 hover:border-brand/50 hover:shadow-[0_15px_40px_rgba(17,194,199,0.15)]' : 'cursor-default border-white/10'
              }`}
            >
              {/* THE BF1 RAY (Atmospheric Glow) */}
              <div className="absolute top-10 inset-0 pointer-events-none z-0 flex items-center justify-center duration-700">
                <img 
                   src={rayImage} 
                   className="w-full h-full object-contain scale-[1.7] mix-blend-screen group-hover:scale-[1.9] transition-transform duration-700" 
                   alt="" 
                />
              </div>

              {/* RELIC IMAGE */}
              <div className="w-36 h-36 relative mb-6 z-10 transition-transform duration-500 group-hover:scale-110">
                 <Image 
                   src={relic.icon || "/images/placeholder.png"} 
                   alt={relic.name} 
                   fill 
                   className="object-contain"
                 />
              </div>

              {/* HIGH-FIDELITY RARITY TAG */}
              <div 
                className="relative z-10 flex items-center justify-center px-6 py-1.5 rounded-full backdrop-blur-xl mb-4 overflow-hidden shrink-0"
                style={{ 
                  background: `linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(${baseColor}, 0.2) 100%)`,
                  boxShadow: `inset 0 0 12px rgba(${baseColor}, 0.2), 0 4px 15px rgba(0, 0, 0, 0.5)`
                }}
              >
                <div 
                  className="absolute top-0 left-0 w-full h-[1px] opacity-40" 
                  style={{ background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 1), transparent)` }} 
                />
                <span 
                  className="hud-label-tactical text-[10px] font-black tracking-[0.3em] text-white uppercase relative z-10"
                  style={{ textShadow: `0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(${baseColor}, 1)` }}
                >
                  {relic.rarity === "LEGENDARY" ? "LENDÁRIA" : relic.rarity === "RARE" ? "RARA" : "COMUM"}
                </span>
              </div>

              <h3 className={`hud-title-md text-xl uppercase z-10 transition-colors ${permissions.canEdit ? 'group-hover:text-brand text-white' : 'text-white'}`}>
                {relic.name}
              </h3>
              
              <p className="text-gray-400 text-[11px] line-clamp-2 font-barlow mb-4 z-10 px-2 mt-2 leading-relaxed italic-none">
                {relic.description}
              </p>

              {/* ⚔️ ENHANCED REQUIREMENT CONTAINER */}
              <div className="mt-auto w-full z-10">
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-3.5 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-white/20 transition-colors">
                  
                  {/* Subtle top glare */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  
                  <span className="hud-label-tactical text-[8px] text-gray-500 uppercase tracking-[0.2em] mb-1 font-normal">
                    CONDIÇÃO DE DESBLOQUEIO
                  </span>
                  
                  <span className="text-[11px] text-brand uppercase tracking-widest font-bold drop-shadow-[0_0_8px_rgba(17,194,199,0.4)]">
                    {firstReq?.type === "XP" ? `ACUMULAR ${firstReq.value} XP` : 
                     firstReq?.type === "MISSION" ? "MISSÃO ESPECÍFICA" : 
                     firstReq?.type === "ATTRIBUTE" ? `ALCANÇAR ${firstReq.value} NO ATRIBUTO` : 
                     "CONCESSÃO DIRETA (MANUAL)"}
                  </span>
                </div>
              </div>
            </CardWrapper>
          );
        })}
      </div>

      {/* 🧪 CUSTOM SCROLLBAR FOR SLIDER */}
      <style jsx global>{`
        .custom-category-scroll::-webkit-scrollbar { height: 8px; }
        .custom-category-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); margin: 0 40px; border-radius: 10px; }
        .custom-category-scroll::-webkit-scrollbar-thumb { background: #11c2c7; box-shadow: 0 0 10px rgba(17,194,199,0.5); border-radius: 10px; }
      `}</style>
    </div>
  );
}