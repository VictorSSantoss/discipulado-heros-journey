"use client";

import { ICONS } from "@/constants/gameConfig";

interface HolyPowerHabit {
  name: string;
  current: number;
  goal: number;
  streak: number;
}

export default function HolyPowerBars({ powers }: { powers?: HolyPowerHabit[] }) {
  if (!powers || powers.length === 0) {
    return (
      <div className="hud-label-tactical text-gray-500 text-center py-12 text-lg italic-none opacity-40">
        AGUARDANDO SINCRONIZAÇÃO...
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
      gradient: 'from-cyan-400 to-cyan-700', 
      glow: 'shadow-[0_0_15px_rgba(34,211,238,0.4)]',
      text: 'text-cyan-400'
    },
    Leitura: { 
      gradient: 'from-emerald-400 to-emerald-700', 
      glow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]',
      text: 'text-emerald-400'
    },
    Jejum: { 
      gradient: 'from-orange-400 to-orange-700', 
      glow: 'shadow-[0_0_15px_rgba(251,146,60,0.4)]',
      text: 'text-orange-400'
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {powers.map((habit) => {
        const percent = habit.goal > 0 ? Math.min((habit.current / habit.goal) * 100, 100) : 0;
        const isCompleted = habit.current >= habit.goal;
        const currentTheme = THEME_CONFIG[habit.name] || THEME_CONFIG['Oração'];

        return (
          <div key={habit.name} className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-4 rounded-xl shadow-xl relative overflow-hidden group transition-all hover:border-white/10">
            
            {/* TOP ROW */}
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <img 
                  src={HABIT_ICONS[habit.name]} 
                  alt="" 
                  className="w-6 h-6 object-contain transition-transform group-hover:scale-110" 
                />
                <span className="hud-title-md text-2xl text-white m-0 uppercase tracking-tighter">
                  {habit.name}
                </span>
              </div>

              {/* 🛠️ FIXED: Shrunk this container significantly */}
              <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-white/5 shadow-inner min-w-[50px] justify-center">
                <img 
                  src={ICONS.xp} 
                  alt="" 
                  className={`w-4 h-4 object-contain ${habit.streak > 0 ? 'animate-pulse' : 'opacity-20 grayscale'}`} 
                />
                <span className={`hud-value text-xl leading-none ${habit.streak > 0 ? 'text-xp' : 'text-gray-700'}`}>
                  {habit.streak}
                </span>
              </div>
            </div>

            {/* PROGRESS TRACK */}
            <div className="w-full h-3 bg-black/60 border border-white/5 rounded-full overflow-hidden relative z-10 mb-3">
              <div 
                className={`h-full bg-gradient-to-r ${currentTheme.gradient} ${currentTheme.glow} transition-all duration-1000 ease-out`}
                style={{ width: `${percent}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:8px_8px] opacity-30"></div>
              </div>
            </div>

            {/* BOTTOM ROW */}
            <div className="flex justify-between items-end relative z-10">
              <span className={`hud-label-tactical ${isCompleted ? currentTheme.text : 'text-gray-600'} text-[9px] italic-none animate-pulse`}>
                {isCompleted ? '✧ MAX CAPACITY' : '⚡ RECHARGING'}
              </span>
              
              <div className="flex items-baseline gap-1">
                <span className={`hud-value text-3xl leading-none ${isCompleted ? currentTheme.text : 'text-white'}`}>
                  {habit.current}
                </span>
                <span className="hud-value text-base text-gray-700">
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