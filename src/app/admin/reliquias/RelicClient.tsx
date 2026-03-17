"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ICONS, ATTRIBUTE_MAP } from "@/constants/gameConfig";

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

const filterCategories = ["TODAS", "LENDÁRIAS", "RARAS", "COMUNS"];

const mapRarityToFilter = (rarity: string) => {
  if (rarity === "LEGENDARY") return "LENDÁRIAS";
  if (rarity === "RARE") return "RARAS";
  return "COMUNS";
};

export default function ReliquiaClient({ 
  initialCatalog,
  unlockedIds = [], 
  permissions = { canForge: false, canEdit: false } 
}: { 
  initialCatalog: any[],
  unlockedIds?: string[],
  permissions?: RelicPermissions
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("TODAS");

  const filteredRelics = initialCatalog.filter(relic => {
    const matchesSearch = relic.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "TODAS" || mapRarityToFilter(relic.rarity) === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      
      <div className="flex flex-col space-y-6 border-b border-white/5 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full max-w-xl group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <Image src={ICONS.search} alt="" width={62} height={62} className="drop-shadow-[0_0_8px_rgba(17,194,199,0.5)]" />
            </div>
            <input 
              type="text"
              placeholder="BUSCAR NO ACERVO DE ARTEFATOS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '90px' }} 
              className="w-full bg-brand/20 border border-white/10 rounded-xl py-5 pr-6 text-xs font-barlow tracking-widest outline-none focus:border-brand/60 transition-all text-white placeholder:text-gray-600 uppercase shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
            />
          </div>
          
          <div className="hud-label-tactical text-[10px] text-gray-500 tracking-[0.3em] uppercase bg-white/5 px-6 py-3 rounded-xl border border-white/5">
            ARTEFATOS NO ACERVO: <span className="text-brand text-sm ml-2">{filteredRelics.length}</span>
          </div>
        </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        
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

        {filteredRelics.map((relic) => {
          const isUnlocked = permissions.canEdit || unlockedIds.includes(relic.id);
          const baseColor = rarityColorMap[relic.rarity] || "255, 255, 255";
          const rayImage = rarityRayMap[relic.rarity] || rarityRayMap.COMMON;
          const alternatives = Array.isArray(relic.ruleParams) ? relic.ruleParams : [];
          const firstReq = alternatives[0];

          const CardWrapper = permissions.canEdit ? Link : "div";
          const wrapperProps = permissions.canEdit ? { href: `/admin/reliquias/${relic.id}/edit` } : {};

          return (
            <CardWrapper 
              key={relic.id} 
              {...(wrapperProps as any)}
              className={`group relative bg-[#0a0a0a] border rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-500 h-[450px] overflow-hidden ${
                isUnlocked ? 'border-white/10' : 'border-white/5'
              } ${
                permissions.canEdit ? 'cursor-pointer hover:-translate-y-2 hover:border-brand/50' : 'cursor-default'
              }`}
            >
              {!isUnlocked && (
                <div className="absolute top-6 right-6 z-30">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-600 blur-xl opacity-30 scale-150 animate-pulse"></div>
                    <div className="relative">
                      <Image src="/images/locker-icon.svg" alt="Locked" width={88} height={88} className="filter drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    </div>
                  </div>
                </div>
              )}

              <div className={`absolute top-10 inset-0 pointer-events-none z-0 flex items-center justify-center duration-700 transition-opacity ${isUnlocked ? 'opacity-100' : 'opacity-25'}`}>
                <img src={rayImage} className="w-full h-full object-contain scale-[1.7] mix-blend-screen group-hover:scale-[1.9] transition-transform duration-700" alt="" />
              </div>

              {/* Icon filtering: balanced brightness to prevent pure white icons */}
              <div className={`w-36 h-36 relative mb-6 z-10 transition-all duration-500 ${isUnlocked ? 'group-hover:scale-110' : 'scale-90 grayscale brightness-[0.6] opacity-80'}`}>
                 <Image src={relic.icon || "/images/placeholder.png"} alt={relic.name} fill className="object-contain" />
              </div>

              <div 
                className={`relative z-10 flex items-center justify-center px-6 py-1.5 rounded-full backdrop-blur-xl mb-4 overflow-hidden shrink-0 transition-opacity ${isUnlocked ? 'opacity-100' : 'opacity-80'}`}
                style={{ background: `linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(${baseColor}, 0.2) 100%)`, border: `1px solid rgba(${baseColor}, 0.2)` }}
              >
                <div className="absolute top-0 left-0 w-full h-[1px] opacity-40" style={{ background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 1), transparent)` }} />
                <span className="hud-label-tactical text-[10px] font-black tracking-[0.3em] text-white uppercase relative z-10">
                  {relic.rarity === "LEGENDARY" ? "LENDÁRIA" : relic.rarity === "RARE" ? "RARA" : "COMUM"}
                </span>
              </div>

              {/* Text Visibility: Added drop-shadow for better contrast against background rays */}
              <h3 className={`hud-title-md text-xl uppercase z-10 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${permissions.canEdit ? 'group-hover:text-brand' : ''} ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                {relic.name}
              </h3>
              
              <p className="text-gray-400 text-[11px] line-clamp-2 font-barlow mb-4 z-10 px-2 mt-2 leading-relaxed italic-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {isUnlocked ? relic.description : "Os segredos deste artefato permanecem ocultos nas sombras."}
              </p>

              <div className="mt-auto w-full z-10">
                <div className={`bg-black/60 backdrop-blur-md rounded-xl p-3.5 border transition-all flex flex-col items-center justify-center relative overflow-hidden ${isUnlocked ? 'border-brand/30 group-hover:border-brand/60' : 'border-white/5'}`}>
                  {isUnlocked && <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand/40 to-transparent"></div>}
                  <span className="hud-label-tactical text-[8px] text-gray-500 uppercase tracking-[0.2em] mb-1 font-normal">
                    {isUnlocked ? 'ARTEFATO CONQUISTADO' : 'REQUISITO DE DESBLOQUEIO'}
                  </span>
                  <span className={`text-[11px] uppercase tracking-widest font-bold ${isUnlocked ? 'text-brand' : 'text-gray-600'}`}>
                    {isUnlocked ? 'REGISTRADO NO CODEX' : (
                      firstReq?.type === "XP" ? `ACUMULAR ${firstReq.value} XP` : 
                      firstReq?.type === "MISSION" ? "MISSÃO ESPECÍFICA" : 
                      firstReq?.type === "ATTRIBUTE" ? `ALCANÇAR ${firstReq.value} ${ATTRIBUTE_MAP[firstReq.attr] || firstReq.attr}` : 
                      "CONCESSÃO MANUAL"
                    )}
                  </span>
                </div>
              </div>
            </CardWrapper>
          );
        })}
      </div>

      <style jsx global>{`
        .custom-category-scroll::-webkit-scrollbar { height: 8px; }
        .custom-category-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); margin: 0 40px; border-radius: 10px; }
        .custom-category-scroll::-webkit-scrollbar-thumb { background: #11c2c7; border-radius: 10px; }
      `}</style>
    </div>
  );
}