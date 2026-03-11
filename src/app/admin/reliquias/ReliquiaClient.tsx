"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

export default function ReliquiaClient({ initialCatalog }: { initialCatalog: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRelics = initialCatalog.filter(relic =>
    relic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      {/* HUD SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
        <div className="relative w-full max-w-md group">
          <input 
            type="text"
            placeholder="SEARCH SECRET ARCHIVES..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xs font-barlow tracking-widest outline-none focus:border-brand/40 transition-all text-white placeholder:text-gray-600 uppercase"
          />
        </div>
        <div className="hud-label-tactical text-[10px] text-gray-500 tracking-[0.3em] uppercase">
          Artifacts Found: <span className="text-brand">{initialCatalog.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* ADD NEW CARD */}
        <Link 
          href="/admin/reliquias/create"
          className="group relative h-[450px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-brand/40 hover:bg-brand/5 transition-all duration-500"
        >
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand transition-all">
             <span className="text-2xl text-white/20 group-hover:text-brand">+</span>
          </div>
          <span className="hud-label-tactical text-[10px] text-gray-500 group-hover:text-brand tracking-widest uppercase">Forge New Relic</span>
        </Link>

        {filteredRelics.map((relic) => {
          const baseColor = rarityColorMap[relic.rarity] || "255, 255, 255";
          const rayImage = rarityRayMap[relic.rarity] || rarityRayMap.COMMON;
          
          // Parse requirement logic for the UI
          const alternatives = Array.isArray(relic.ruleParams) ? relic.ruleParams : [];
          const firstReq = alternatives[0];

          return (
            <Link 
              key={relic.id} 
              href={`/admin/reliquias/${relic.id}/edit`}
              className="group relative bg-dark-surface/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-3 hover:border-white/20 h-[450px] overflow-hidden"
            >
              {/* ⚔️ THE BF1 RAY (Atmospheric Glow) */}
              <div className="absolute top-10 inset-0 pointer-events-none z-0 flex items-center justify-center">
                <img 
                   src={rayImage} 
                   className="w-full h-full object-contain scale-[1.7] mix-blend-screen" 
                   alt="" 
                />
              </div>

              {/* RELIC IMAGE */}
              <div className="w-36 h-36 relative mb-6 z-10">
                 <Image 
                   src={relic.icon || "/images/placeholder.png"} 
                   alt={relic.name} 
                   fill 
                   className="object-contain"
                 />
              </div>

              {/* RARITY TAG */}
              <div 
                className="relative z-10 flex items-center justify-center px-6 py-1.5 rounded-full backdrop-blur-xl mb-4 overflow-hidden group/tag"
                style={{ 
                  background: `linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(${baseColor}, 0.25) 100%)`,
                  boxShadow: `inset 0 0 12px rgba(${baseColor}, 0.15), 0 4px 15px rgba(0, 0, 0, 0.4)`
                }}
              >
                {/* Subtly animated top-edge light for the "Glass" effect */}
                <div 
                  className="absolute top-0 left-0 w-full h-[1px] opacity-50"
                  style={{ background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 1), transparent)` }}
                />

                <span 
                  className="hud-label-tactical text-[10px] font-black tracking-[0.3em] text-white uppercase relative z-10"
                  style={{ 
                    textShadow: `0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(${baseColor}, 1)` 
                  }}
                >
                  {relic.rarity === "LEGENDARY" ? "LENDÁRIA" : relic.rarity === "RARE" ? "RARA" : "COMUM"}
                </span>
              </div>

              <h3 className="hud-title-md text-xl text-white mb-2 uppercase z-10">{relic.name}</h3>
              
              <p className="text-gray-500 text-[11px] line-clamp-2 font-barlow mb-4 z-10 px-2">
                {relic.description}
              </p>

              {/* ⚔️ HOW TO EARN SECTION */}
              <div className="mt-auto w-full z-10">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5 flex flex-col items-center">
                  <span className="hud-label-tactical text-[8px] text-gray-500 uppercase tracking-widest mb-1">Requirement</span>
                  <span className="text-[10px] text-brand font-bold uppercase tracking-tighter">
                    {firstReq?.type === "XP" ? `${firstReq.value} Total XP` : 
                     firstReq?.type === "MISSION" ? "Special Mission" : 
                     firstReq?.type === "ATTRIBUTE" ? `Target: ${firstReq.value}` : "Manual Grant"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}