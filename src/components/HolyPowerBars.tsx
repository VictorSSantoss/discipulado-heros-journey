"use client";

import { PowerHabit } from "@/types";
import { ICONS } from "@/constants/gameConfig";

interface HolyPowerBarsProps {
  powers?: {
    Oração: PowerHabit;
    Leitura: PowerHabit;
    Jejum: PowerHabit;
  };
}

/**
 * HolyPowerBars Component
 * Displays spiritual progression metrics in a compact, rectangular HUD format.
 * Optimized for horizontal density to prevent vertical bloat.
 */
export default function HolyPowerBars({ powers }: HolyPowerBarsProps) {
  /* ERROR_BOUNDARY: EMPTY_STATE */
  if (!powers) {
    return (
      <div className="hud-label-tactical text-gray-500 text-center py-12 text-lg italic-none">
        Sem registros de poder...
      </div>
    );
  }

  const HABIT_ICONS: Record<string, string> = {
    Oração: ICONS.oracao,
    Leitura: ICONS.leitura,
    Jejum: ICONS.jejum
  };

  const THEME_CONFIG: Record<string, { gradient: string; glow: string; text: string }> = {
    Oração: { 
      gradient: 'from-brand to-cyan-700', 
      glow: 'shadow-[0_0_15px_rgba(17,194,199,0.3)]',
      text: 'text-brand'
    },
    Leitura: { 
      gradient: 'from-mission to-emerald-700', 
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      text: 'text-mission'
    },
    Jejum: { 
      gradient: 'from-xp to-orange-700', 
      glow: 'shadow-[0_0_15px_rgba(234,88,12,0.3)]',
      text: 'text-xp'
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* CONTAINER 1: COMPACT_LIST_WRAPPER */}
      {Object.entries(powers).map(([key, habit]) => {
        const percent = habit.goal > 0 ? Math.min((habit.current / habit.goal) * 100, 100) : 0;
        const isCompleted = habit.current >= habit.goal;
        const currentTheme = THEME_CONFIG[key];

        return (
          <div 
            key={key} 
            className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-3.5 rounded-xl shadow-xl relative overflow-hidden group transition-all hover:border-white/10"
          >
            {/* CONTAINER 2: RECTANGULAR_TACTICAL_STRIP */}

            <div className="flex justify-between items-center mb-2 relative z-10">
              {/* CONTAINER 3: COMPACT_IDENTITY_BLOCK */}
              <div className="flex items-center gap-2.5">
                <img 
                  src={HABIT_ICONS[key]} 
                  alt={key} 
                  className="w-6 h-6 object-contain opacity-80 group-hover:scale-110 transition-transform" 
                />
                <span className="hud-title-md text-xl text-white m-0">
                  {key}
                </span>
              </div>

              {/* CONTAINER 4: MINI_STREAK_READOUT */}
              <div className="flex items-center gap-2 bg-dark-bg/80 px-2 py-0.5 rounded-lg border border-white/5 shadow-inner">
                <img 
                  src={ICONS.xp} 
                  alt="Streak" 
                  className={`w-3 h-3 object-contain ${habit.streak > 0 ? 'animate-pulse' : 'opacity-20 grayscale'}`} 
                />
                <span className={`hud-value text-lg leading-none ${habit.streak > 0 ? 'text-xp' : 'text-gray-700'}`}>
                  {habit.streak}
                </span>
              </div>
            </div>

            {/* CONTAINER 5: REFINED_PROGRESS_TRACK */}
            <div className="w-full h-2.5 bg-dark-bg border border-white/5 rounded-full overflow-hidden relative z-10 shadow-inner">
              <div 
                className={`h-full bg-gradient-to-r ${currentTheme.gradient} ${currentTheme.glow} transition-all duration-1000 ease-out`}
                style={{ width: `${percent}%` }}
              >
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5"></div>
              </div>
            </div>

            <div className="flex justify-between items-end mt-2 relative z-10">
              {/* CONTAINER 6: TRACKING_LABELS_COMPACT */}
              <div className="flex flex-col">
                <span className="hud-label-tactical text-gray-600 text-[8px] italic-none">
                  STATUS: {isCompleted ? 'MAX' : 'SYNCING'}
                </span>
              </div>
              
              {/* CONTAINER 7: NUMERIC_STAT_READOUT_RECT */}
              <div className="flex items-baseline gap-1">
                <span className={`hud-value text-2xl leading-none ${isCompleted ? currentTheme.text : 'text-white'}`}>
                  {habit.current}
                </span>
                <span className="hud-value text-sm text-gray-700">
                   / {habit.goal}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}