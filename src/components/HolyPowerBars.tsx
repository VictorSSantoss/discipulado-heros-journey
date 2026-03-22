"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ICONS } from "@/constants/gameConfig";

interface HolyPower {
  id: string;
  name: string;
  current: number;
  goal: number;
  streak: number;
  isResetDaily: boolean;
}

interface HolyPowerBarsProps {
  powers: HolyPower[];
  onLogPower: (name: string, amount: number) => void;
}

const SORT_ORDER: Record<string, number> = {
  'oração': 1,
  'leitura': 2,
  'jejum': 3
};

const getDropdownOptions = (name: string, remaining: number) => {
  const lowerName = name.toLowerCase();
  let values = [1, 5, 10]; 
  
  if (lowerName === "oração") values = [5, 10, 15, 30, 60];
  if (lowerName === "leitura") values = [1, 2, 3, 4, 5, 10]; // ⚔️ Added +4
  if (lowerName === "jejum") values = [1, 2, 4, 8, 12];

  const options = values.map(v => ({ label: `+${v}`, value: v }));
  if (remaining > 0) options.push({ label: `+MAX (${remaining})`, value: remaining });
  
  return options;
};

export default function HolyPowerBars({ powers, onLogPower }: HolyPowerBarsProps) {
  const [selectedValues, setSelectedValues] = useState<Record<string, number>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- HOLD TO CHARGE LOGIC ---
  const [chargingPower, setChargingPower] = useState<string | null>(null);
  const [chargeProgress, setChargeProgress] = useState(0);
  const chargeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleStartCharge = (powerName: string, amount: number) => {
    if (isProcessing) return;
    setChargingPower(powerName);
    setChargeProgress(0);
    
    const start = Date.now();
    const duration = 800; // 0.8s hold

    const animateCharge = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setChargeProgress(progress);
      if (progress < 100) animationFrameRef.current = requestAnimationFrame(animateCharge);
    };

    animationFrameRef.current = requestAnimationFrame(animateCharge);

    chargeTimerRef.current = setTimeout(async () => {
      setIsProcessing(true);
      await onLogPower(powerName, amount);
      setIsProcessing(false);
      handleStopCharge();
    }, duration);
  };

  const handleStopCharge = () => {
    if (chargeTimerRef.current) clearTimeout(chargeTimerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setChargingPower(null);
    setChargeProgress(0);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.custom-dropdown-container')) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!powers || powers.length === 0) return null;

  const sortedPowers = [...powers].sort((a, b) => 
    (SORT_ORDER[a.name.toLowerCase()] || 99) - (SORT_ORDER[b.name.toLowerCase()] || 99)
  );

  return (
    <div className="space-y-6">
      {sortedPowers.map((power) => {
        const progressPercent = Math.min((power.current / power.goal) * 100, 100);
        const isCompleted = power.current >= power.goal;
        const remaining = Math.max(0, power.goal - power.current);
        const isDropdownOpen = openDropdown === power.id;
        const isCharging = chargingPower === power.name;
        
        const themeColor = power.isResetDaily ? "#10b981" : "#f59e0b";
        const themeTailwind = power.isResetDaily ? "text-mission" : "text-amber-500";
        const themeBorder = power.isResetDaily ? "border-mission/40" : "border-amber-500/40";
        const themeBgGlass = power.isResetDaily ? "bg-mission/10" : "bg-amber-500/10";
        const themeHover = power.isResetDaily ? "hover:bg-mission/20" : "hover:bg-amber-500/20";

        let unit = power.name.toLowerCase() === "oração" ? "min" : power.name.toLowerCase() === "leitura" ? "cap" : "hrs";
        let iconSrc: string = power.name.toLowerCase() === "oração" ? ICONS.oracao : power.name.toLowerCase() === "leitura" ? ICONS.leitura : ICONS.jejum;

        const dropdownOptions = getDropdownOptions(power.name, remaining);
        const currentValue = selectedValues[power.name] || dropdownOptions[0].value;

        return (
          <div key={power.id} className="relative group bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all shadow-lg flex flex-col gap-4">
            
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 border border-white/10 shadow-inner">
                  <img src={iconSrc} alt={power.name} className="w-5 h-5 object-contain brightness-150" />
                </div>
                <div className="flex flex-col">
                  <h3 className="hud-title-md text-white text-lg uppercase tracking-widest">{power.name}</h3>
                  <span className={`hud-label-tactical text-[8px] uppercase tracking-widest px-2 py-0.5 mt-0.5 rounded border w-fit ${themeBgGlass} ${themeTailwind} ${themeBorder}`}>
                    {power.isResetDaily ? "⚡ Meta Diária" : "📜 Acumulativo"}
                  </span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                 <div className="flex items-baseline gap-1">
                   <span className="hud-value text-3xl text-white">{power.current}</span>
                   <span className="hud-label-tactical text-gray-500 text-xs">/ {power.goal}</span>
                 </div>
                 <span className="hud-label-tactical text-[9px] text-gray-400 uppercase tracking-widest">{unit}</span>
              </div>
            </div>

            {/* --- PROGRESS BAR --- */}
            <div className="w-full h-5 bg-dark-bg/80 rounded-lg border border-white/10 relative overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] backdrop-blur-md">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }}
                className="absolute top-0 left-0 h-full relative overflow-hidden"
                style={{ backgroundColor: themeColor, opacity: isCompleted ? 1 : 0.85 }}
              >
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
              </motion.div>
            </div>

            {/* --- FOOTER & CONTROLS --- */}
            <div className="flex justify-between items-center border-t border-white/5 pt-3">
               <div className="flex items-center">
                 {power.isResetDaily ? (
                   <span className="hud-label-tactical text-xp text-[10px] font-bold bg-xp/10 px-2 py-1 rounded border border-xp/20 uppercase tracking-widest">
                     {power.streak} STREAK
                   </span>
                 ) : (
                   <span className="hud-label-tactical text-amber-500 text-[10px] font-bold bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 uppercase tracking-widest">
                     FALTAM {remaining} {unit}
                   </span>
                 )}
               </div>

               {/* ⚔️ INTEGRATED GLASS CONTROL UNIT (HOLD TO ADD) */}
               <div className="relative custom-dropdown-container">
                 <div className={`flex items-center h-8 rounded-lg border ${themeBorder} ${themeBgGlass} backdrop-blur-md overflow-hidden`}>
                   <button
                     onClick={() => setOpenDropdown(isDropdownOpen ? null : power.id)}
                     className={`h-full pl-3 pr-2 flex items-center gap-1 border-r ${themeBorder} ${themeHover} min-w-[3.2rem]`}
                   >
                     <span className={`hud-label-tactical text-[10px] font-bold ${themeTailwind}`}>+{currentValue}</span>
                     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${themeTailwind} transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
                   </button>

                   <button
                     onMouseDown={() => handleStartCharge(power.name, currentValue)}
                     onMouseUp={handleStopCharge}
                     onMouseLeave={handleStopCharge}
                     onTouchStart={() => handleStartCharge(power.name, currentValue)}
                     onTouchEnd={handleStopCharge}
                     className={`relative h-full px-4 flex items-center justify-center transition-all select-none ${themeHover} disabled:opacity-50`}
                   >
                     {/* ⚔️ CHARGE OVERLAY */}
                     {isCharging && (
                        <div 
                          className="absolute inset-0 bg-white/20" 
                          style={{ width: `${chargeProgress}%` }}
                        />
                     )}
                     <span className={`hud-label-tactical uppercase tracking-widest font-bold text-[10px] z-10 ${themeTailwind}`}>
                        {isProcessing ? "..." : "ADD"}
                     </span>
                   </button>
                 </div>

                 <AnimatePresence>
                   {isDropdownOpen && (
                     <motion.div
                       initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                       className={`absolute bottom-[calc(100%+8px)] right-0 min-w-full bg-[#050505]/90 border ${themeBorder} backdrop-blur-xl rounded-lg shadow-2xl z-50 overflow-hidden`}
                     >
                       {dropdownOptions.map((opt) => (
                         <button
                           key={opt.label}
                           onClick={() => { setSelectedValues(prev => ({ ...prev, [power.name]: opt.value })); setOpenDropdown(null); }}
                           className={`w-full text-center px-3 py-2 text-white hover:bg-white/20 hud-label-tactical text-[10px] font-bold ${currentValue === opt.value ? themeBgGlass + ' ' + themeTailwind : ''}`}
                         >
                           {opt.label}
                         </button>
                       ))}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}