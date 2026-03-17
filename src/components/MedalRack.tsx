// MURAL DE RELIQUIAS

"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ICONS } from "@/constants/gameConfig"; 

// Update the interface to require valenteId
interface MedalRackProps {
  valenteId: string; 
  medals: {
    medal: {
      id: string;
      name: string;
      icon: string;
      rarity: string;
      description: string;
      requirement: number;
    };
    awardedAt: Date;
  }[];
  catalog?: any[]; 
  currentXp?: number; 
}

/**
 * Mapping for atmospheric ray images based on relic rarity.
 */
const rarityRayMap: Record<string, string> = {
  LEGENDARY: "/images/ray-legendary.png", 
  RARE: "/images/ray-rare.png",           
  COMMON: "/images/ray-common.png",       
};

/**
 * Normalization logic to ensure rarity strings match the mapping keys.
 */
const normalizeRarity = (rarity: string) => {
  const str = (rarity || "").toUpperCase().trim();
  if (str.includes("LEND") || str.includes("LEGEND")) return "LEGENDARY";
  if (str.includes("RAR")) return "RARE";
  return "COMMON";
};

// Add valenteId to the destructured props
export default function MedalRack({ valenteId, medals, catalog = [], currentXp = 0 }: MedalRackProps) {
  const router = useRouter();
  
  /**
   * Configuration for the grid layout and slot calculation.
   */
  const totalSlots = 12; 
  const earnedCount = medals.length;
  const emptySlots = Math.max(0, totalSlots - earnedCount);

  /**
   * Navigation handler dynamically routing to the specific valente's codex.
   */
  const navigateToCodex = () => {
    router.push(`/admin/valentes/${valenteId}/Reliccodex`);
  };

  return (
    <div className="bg-dark-bg/40 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative shadow-xl min-h-[340px] flex flex-col justify-between">
      
      <div className="absolute -right-6 -top-6 opacity-[0.02] pointer-events-none rotate-[15deg] z-0">
         <img src={ICONS.patentes} className="w-40 h-40 object-contain" alt="" />
      </div>

      {/* Header section containing the title and tactical navigation trigger */}
      <div className="flex flex-row justify-between items-center mb-12 relative z-10 gap-4">
        
        <div className="relative flex flex-col gap-1 min-w-fit">
          
          <div className="absolute top-1/2 left-[-40px] sm:left-[-70px] -translate-y-[70%] sm:-translate-y-[60%] w-[300px] sm:w-[390px] pointer-events-none z-[-10] mix-blend-screen opacity-40">
             <img 
               src="/images/ray-header.png"
               alt=""
               className="w-full h-auto object-contain"
               onError={(e) => e.currentTarget.style.display = 'none'}
             />
          </div>

          <h3 className="hud-label-tactical text-[13px] text-white uppercase tracking-[0.3em] leading-tight">
            Mural de<br/>Relíquias
          </h3>
          <div className="flex items-baseline gap-2.5">
             <span className="hud-value text-brand text-4xl drop-shadow-[0_0_15px_rgba(17,194,199,0.5)]">
              {earnedCount}
            </span>
            <span className="text-white/80 font-bold hud-label-tactical text-[12px] whitespace-nowrap drop-shadow-md">
              / {totalSlots}
            </span>
          </div>
        </div>

        <button 
          onClick={navigateToCodex}
          className="group flex items-center gap-1.5 px-3 py-1 bg-brand/10 border border-brand/20 rounded-full hover:bg-brand/20 hover:border-brand/50 transition-all shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.1)] relative z-10"
        >
          <span className="hud-label-tactical text-[10px] text-brand tracking-widest uppercase font-bold">
            VER CODEX
          </span>
          <img 
            src={ICONS.codex} 
            className="w-10 h-10 object-contain opacity-90 group-hover:scale-110 transition-transform brightness-200" 
            alt="Codex" 
          />
        </button>
      </div>

      {/* Grid rendering for earned relics and empty placeholders */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-12 relative z-10 mt-auto">
        {medals.map((vm, index) => {
            const rayImageSrc = rarityRayMap[normalizeRarity(vm.medal.rarity)];

            return (
              <div 
                key={index}
                onClick={navigateToCodex}
                className="group relative w-full aspect-square flex items-center justify-center cursor-pointer"
              >
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
                   <img 
                     src={rayImageSrc}
                     alt=""
                     className="w-full h-full object-contain mix-blend-screen group-hover:opacity-100 transition-all duration-700 scale-[2.0] group-hover:scale-[2.5]"
                     onError={(e) => e.currentTarget.style.display = 'none'}
                   />
                </div>
                
                <div className="relative w-[90%] h-[90%] transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1 z-10">
                  <Image 
                    src={vm.medal.icon} 
                    alt={vm.medal.name} 
                    fill 
                    className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
                  />
                </div>
              </div>
            );
        })}

        {emptySlots > 0 && [...Array(emptySlots)].map((_, i) => (
          <div 
            key={`empty-${i}`}
            className="w-full aspect-square flex items-center justify-center grayscale opacity-20 hover:opacity-40 transition-opacity cursor-pointer"
            onClick={navigateToCodex}
          >
            <div className="w-[70%] h-[70%] flex items-center justify-center border border-dashed border-white/30 rounded-sm">
               <div className="w-1.5 h-1.5 bg-white/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}