"use client";

interface Medal {
  name: string;
  icon: string;
  tier: string;
}

/**
 * MedalRack Component
 * Displays a hero's decorative achievements and honors.
 * Integrated with the HUD Typography System using a compact precision scale.
 */
export default function MedalRack({ medals }: { medals: Medal[] }) {
  return (
    <div className="bg-dark-bg/40 backdrop-blur-xl p-5 border border-white/5 rounded-xl shadow-xl relative overflow-hidden">
      {/* CONTAINER 1: RACK_MASTER_SHELL */}
      
      <h3 className="hud-title-md text-xl text-white mb-4 border-b border-white/5 pb-2">
        MEDALHAS DE HONRA
      </h3>
      
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {/* CONTAINER 2: MEDAL_GRID_VIEWPORT */}
        {medals.length > 0 ? (
          medals.map((medal, index) => (
            <div 
              key={index} 
              className="group relative flex flex-col items-center"
            >
              {/* CONTAINER 3: TIERED_MEDAL_INSIGNIA */}
              {/* Dynamic border and glow colors based on achievement tier. */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all group-hover:scale-110 border-2 ${
                medal.tier === 'gold' ? 'bg-yellow-500/10 border-yellow-600 shadow-yellow-600/20' :
                medal.tier === 'silver' ? 'bg-gray-400/10 border-gray-400 shadow-gray-400/20' :
                'bg-amber-700/10 border-amber-800 shadow-amber-800/20'
              }`}>
                {medal.icon}
              </div>
              
              {/* CONTAINER 4: TACTICAL_TOOLTIP */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/90 text-white hud-label-tactical text-[8px] px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 italic-none">
                {medal.name.toUpperCase()}
              </div>
            </div>
          ))
        ) : (
          /* CONTAINER 5: EMPTY_STATE_READOUT */
          <p className="hud-label-tactical text-gray-600 text-[9px] italic-none">
            NENHUMA CONQUISTA REGISTRADA NO SISTEMA
          </p>
        )}
      </div>
    </div>
  );
}