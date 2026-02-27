"use client";

import { PowerHabit } from "@/types";

interface HolyPowerBarsProps {
  powers?: {
    Oração: PowerHabit;
    Leitura: PowerHabit;
    Jejum: PowerHabit;
  };
}

export default function HolyPowerBars({ powers }: HolyPowerBarsProps) {
  if (!powers) return <div className="text-gray-500 text-center py-10 font-barlow italic">Sem registros de poder...</div>;

  const ICONS: Record<string, string> = {
    Oração: '🙏',
    Leitura: '📖',
    Jejum: '🕊️'
  };

  const COLORS: Record<string, string> = {
    Oração: 'from-cyan-500 to-blue-600',
    Leitura: 'from-amber-400 to-orange-500',
    Jejum: 'from-purple-500 to-indigo-600'
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {Object.entries(powers).map(([key, habit]) => {
        // Safe math: prevent division by zero and cap at 100%
        const percent = habit.goal > 0 ? Math.min((habit.current / habit.goal) * 100, 100) : 0;
        const isCompleted = habit.current >= habit.goal;

        return (
          <div key={key} className="bg-[#1a1c19] border border-gray-800 p-3 rounded-sm shadow-md relative overflow-hidden group">
            
            {/* Background completion glow */}
            {isCompleted && (
              <div className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none" />
            )}

            <div className="flex justify-between items-end mb-2 relative z-10">
              {/* Left Side: Icon & Title */}
              <div className="flex items-center gap-2">
                <span className="text-xl drop-shadow-md">{ICONS[key] || '✨'}</span>
                <span className="font-barlow text-white font-bold uppercase text-sm tracking-widest">
                  {key}
                </span>
              </div>

              {/* Right Side: The Streak (🔥) */}
              <div className={`flex items-center gap-1 font-staatliches text-lg tracking-wider ${habit.streak > 0 ? 'text-orange-500' : 'text-gray-600'}`}>
                <span className={habit.streak > 0 ? 'animate-pulse' : 'opacity-50'}>🔥</span>
                {habit.streak} <span className="text-[10px] font-barlow text-gray-500 uppercase mt-1">Streak</span>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800 relative z-10">
              <div 
                className={`h-full bg-gradient-to-r ${COLORS[key]} transition-all duration-1000 ease-out relative`}
                style={{ width: `${percent}%` }}
              >
                {/* Shine effect on the bar */}
                <div className="absolute top-0 left-0 w-full h-full bg-white/20"></div>
              </div>
            </div>

            {/* Bottom text: Current / Goal */}
            <div className="flex justify-between items-center mt-2 relative z-10">
              <span className="font-barlow text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                Progresso Semanal
              </span>
              <span className={`font-staatliches text-lg leading-none ${isCompleted ? 'text-green-400' : 'text-gray-300'}`}>
                {habit.current} <span className="text-sm text-gray-600">/ {habit.goal} {habit.unit}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}