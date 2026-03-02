"use client";

import { mockValentes } from "@/lib/mockData";
import Link from "next/link";
import { LEVEL_SYSTEM, ICONS } from "@/constants/gameConfig";

/**
 * TavernaPreview Component
 * High-visibility global ranking overview.
 * Position indicators moved above progress tracks for a cleaner tactical flow.
 */
export default function TavernaPreview() {
  /* RANKING_LOGIC */
  const topThree = [...mockValentes]
    .sort((a, b) => b.totalXP - a.totalXP)
    .slice(0, 3);

  return (
    <Link href="/taverna" className="block group h-full">
      {/* CONTAINER 1: MODULE_SHELL */}
      <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl hover:border-brand/30 transition-all shadow-2xl relative overflow-hidden h-full">
        
        {/* CONTAINER 2: DECORATIVE_AMBIENT_LAYER */}
        <img 
          src={ICONS.taverna || "/taverna-icon.svg"} 
          alt="" 
          className="absolute -right-8 -bottom-8 w-56 h-56 opacity-5 group-hover:opacity-10 transition-all rotate-12 pointer-events-none grayscale"
        />

        {/* CONTAINER 3: MODULE_HEADER */}
        <div className="flex justify-between items-center mb-10 relative z-10">
          <h3 className="hud-title-md text-3xl text-brand m-0 drop-shadow-[0_0_15px_rgba(17,194,199,0.3)]">
            RANKING GLOBAL
          </h3>
          <span className="hud-label-tactical text-xs text-gray-500 group-hover:text-xp transition-colors italic-none">
            VER TUDO →
          </span>
        </div>

        {/* CONTAINER 4: PODIUM_DATA_LIST */}
        <div className="space-y-8 relative z-10">
          {topThree.map((hero, index) => {
            
            /* PROGRESS_CALCULATION_LOGIC */
            const currentLevelInfo = [...LEVEL_SYSTEM].reverse().find(lvl => hero.totalXP >= lvl.minXP) || LEVEL_SYSTEM[0];
            const currentLevelIndex = LEVEL_SYSTEM.findIndex(lvl => lvl.name === currentLevelInfo.name);
            const nextLevelInfo = LEVEL_SYSTEM[currentLevelIndex + 1];
            const targetXP = nextLevelInfo ? nextLevelInfo.minXP : hero.totalXP;
            const xpPercentage = nextLevelInfo ? Math.min((hero.totalXP / targetXP) * 100, 100) : 100;

            return (
              <div key={hero.id} className="flex items-center gap-5">
                
                {/* AVATAR_CONTAINER: Silhouette fallback applied */}
                <div className="w-12 h-12 bg-black/20 border border-white/10 rounded-lg flex items-center justify-center shrink-0 group-hover:border-brand transition-colors relative overflow-hidden">
                  <img 
                    src={hero.image || '/images/man-silhouette.svg'} 
                    alt="" 
                    onError={(e) => { 
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = '/images/man-silhouette.svg'; 
                    }}
                    className="w-full h-full object-contain p-1 opacity-100 transition-transform group-hover:scale-110" 
                  />
                </div>
                
                {/* HERO_IDENTITY_SNIPPET */}
                <div className="flex-1 min-w-0">
                  <p className="hud-title-md text-xl text-white truncate m-0 leading-none mb-2">
                    {hero.name}
                  </p>
                  <p className="hud-value text-lg text-white leading-none">
                    {hero.totalXP} 
                    <span className="hud-label-tactical text-[11px] text-gray-600 ml-1 italic-none uppercase tracking-tighter">
                      XP TOTAL
                    </span>
                  </p>
                </div>

                {/* RANK_AND_PROGRESS_BLOCK: Integrated Rank Label */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {/* Position label on top of the bar */}
                  <span className={`hud-title-md text-xl italic-none leading-none ${
                    index === 0 ? 'text-brand' : 
                    index === 1 ? 'text-gray-400' : 
                    'text-xp'
                  }`}>
                    {index + 1}º LUGAR
                  </span>

                  <div className="w-24 h-2 bg-dark-bg border border-white/5 rounded-full overflow-hidden shadow-inner relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-xp transition-all duration-1000 shadow-[0_0_10px_rgba(234,88,12,0.5)]" 
                      style={{ width: `${xpPercentage}%` }}
                    >
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10"></div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </Link>
  );
}