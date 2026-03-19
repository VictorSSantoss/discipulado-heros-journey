"use client";

import { useState, useEffect, useRef } from "react";
import { ICONS } from "@/constants/gameConfig";

interface HolyPowerHabit {
  name: string;
  current: number;
  goal: number;
  streak: number;
}

interface HolyPowerBarsProps {
  powers?: HolyPowerHabit[];
  onLogPower?: (habitName: string, amount: number) => void;
}

/**
 * Mapping for habit-specific units and charge increments.
 */
const HABIT_METRICS: Record<string, { unit: string; step: number }> = {
  Oração: { unit: "min", step: 5 },
  Leitura: { unit: "cap", step: 1 },
  Jejum: { unit: "dia", step: 1 },
};

const THEME_CONFIG: Record<string, { gradient: string; glow: string; overGlow: string; text: string; bg: string }> = {
  Oração: { 
    gradient: 'from-cyan-400 to-cyan-700', 
    glow: 'shadow-[0_0_15px_rgba(34,211,238,0.4)]',
    overGlow: 'shadow-[0_0_30px_rgba(34,211,238,0.8)]',
    text: 'text-cyan-400',
    bg: 'bg-cyan-400'
  },
  Leitura: { 
    gradient: 'from-emerald-400 to-emerald-700', 
    glow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]',
    overGlow: 'shadow-[0_0_30px_rgba(52,211,153,0.8)]',
    text: 'text-emerald-400',
    bg: 'bg-emerald-400'
  },
  Jejum: { 
    gradient: 'from-orange-400 to-orange-700', 
    glow: 'shadow-[0_0_15px_rgba(251,146,60,0.4)]',
    overGlow: 'shadow-[0_0_30px_rgba(251,146,60,0.8)]',
    text: 'text-orange-400',
    bg: 'bg-orange-400'
  }
};

const HABIT_ICONS: Record<string, string> = {
  Oração: ICONS.oracao,
  Leitura: ICONS.leitura,
  Jejum: ICONS.jejum
};

function HoldToChargeButton({ onCharge, theme, isCompleted, metric }: { onCharge: () => void, theme: any, isCompleted: boolean, metric: any }) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setIsHolding(true);
    setProgress(0);
    let currentProgress = 0;
    
    intervalRef.current = setInterval(() => {
      currentProgress += 5; 
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(intervalRef.current!);
        setIsHolding(false);
        setProgress(0);
        onCharge();
      }
    }, 40); // Slightly faster charging for better UX
  };

  const stopHold = () => {
    setIsHolding(false);
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <button
      onPointerDown={startHold}
      onPointerUp={stopHold}
      onPointerLeave={stopHold}
      className={`relative overflow-hidden border px-3 py-2 rounded-lg hud-label-tactical text-[8px] transition-all select-none touch-none flex items-center justify-center min-w-[110px]
        ${isHolding ? 'scale-95 border-white/30' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}
        ${isCompleted && !isHolding ? `border-${theme.text.split('-')[1]}/30` : ''}
      `}
    >
      <div 
        className={`absolute top-0 left-0 h-full opacity-30 transition-all duration-75 ${theme.bg}`}
        style={{ width: `${progress}%` }}
      />
      <span className={`relative z-10 font-black tracking-widest ${isHolding || isCompleted ? theme.text : 'text-gray-500'} uppercase`}>
        {isHolding ? 'CARREGANDO...' : `+${metric.step} ${metric.unit}`}
      </span>
    </button>
  );
}

export default function HolyPowerBars({ powers, onLogPower }: HolyPowerBarsProps) {
  const [localPowers, setLocalPowers] = useState<HolyPowerHabit[]>([]);

  useEffect(() => {
    if (powers) setLocalPowers(powers);
  }, [powers]);

  if (!localPowers || localPowers.length === 0) {
    return (
      <div className="hud-label-tactical text-gray-500 text-center py-12 text-lg uppercase tracking-widest opacity-40">
        AGUARDANDO SINCRONIZAÇÃO...
      </div>
    );
  }

  const handleCharge = (habitName: string) => {
    const metric = HABIT_METRICS[habitName] || { unit: "", step: 1 };
    
    setLocalPowers((prev) => 
      prev.map((p) => {
        if (p.name === habitName) {
          return { ...p, current: p.current + metric.step };
        }
        return p;
      })
    );

    if (onLogPower) {
      onLogPower(habitName, metric.step);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {localPowers.map((habit) => {
        const percent = habit.goal > 0 ? Math.min((habit.current / habit.goal) * 100, 100) : 0;
        const isCompleted = habit.current >= habit.goal;
        const isOvercharged = habit.current > habit.goal;
        const currentTheme = THEME_CONFIG[habit.name] || THEME_CONFIG['Oração'];
        const metric = HABIT_METRICS[habit.name] || { unit: "", step: 1 };

        return (
          <div key={habit.name} className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-4 rounded-xl shadow-xl relative overflow-hidden group transition-all hover:border-white/10">
            
            {/* Header: Name and Streak */}
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

            {/* Progress Bar */}
            <div className="w-full h-3 bg-black/60 border border-white/5 rounded-full overflow-hidden relative z-10 mb-4">
              <div 
                className={`h-full bg-gradient-to-r ${currentTheme.gradient} ${isOvercharged ? currentTheme.overGlow : currentTheme.glow} transition-all duration-1000 ease-out`}
                style={{ width: `${percent}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:8px_8px] opacity-30"></div>
              </div>
            </div>

            {/* Values and Charging Button */}
            <div className="flex justify-between items-center relative z-10 mt-2">
              <div className="w-1/3">
                <span className={`hud-label-tactical ${isCompleted ? currentTheme.text : 'text-gray-600'} text-[8px] uppercase tracking-[0.2em]`}>
                  {isCompleted ? '✧ CAPACIDADE MÁXIMA' : '⚡ RECARREGANDO'}
                </span>
              </div>
              
              <div className="w-1/3 flex justify-center">
                <HoldToChargeButton 
                  onCharge={() => handleCharge(habit.name)} 
                  theme={currentTheme}
                  isCompleted={isCompleted}
                  metric={metric}
                />
              </div>

              <div className="flex items-baseline gap-1 w-1/3 justify-end">
                <span className={`hud-value text-3xl leading-none ${isCompleted ? currentTheme.text : 'text-white'}`}>
                  {habit.current}
                </span>
                <span className="hud-label-tactical text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                  {metric.unit} / {habit.goal}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}