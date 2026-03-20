"use client";

import { useState, useEffect } from "react";
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

// ⚔️ FIXED ORDER ENGINE
const SORT_ORDER: Record<string, number> = {
  'oração': 1,
  'leitura': 2,
  'jejum': 3
};

// ⚔️ DYNAMIC DROPDOWN OPTIONS
const getDropdownOptions = (name: string, remaining: number) => {
  const lowerName = name.toLowerCase();
  let values = [1, 5, 10]; // Fallback
  
  if (lowerName === "oração") values = [5, 10, 15, 30, 60];
  if (lowerName === "leitura") values = [1, 2, 3, 5, 10];
  if (lowerName === "jejum") values = [1, 2, 4, 8, 12];

  const options = values.map(v => ({ label: `+${v}`, value: v }));
  
  if (remaining > 0) {
    options.push({ label: `+MAX (${remaining})`, value: remaining });
  }
  
  return options;
};

export default function HolyPowerBars({ powers, onLogPower }: HolyPowerBarsProps) {
  const [selectedValues, setSelectedValues] = useState<Record<string, number>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.custom-dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!powers || powers.length === 0) {
    return (
      <div className="text-center py-8 opacity-50">
        <span className="hud-label-tactical text-gray-400">Nenhum Poder Santo registrado.</span>
      </div>
    );
  }

  // Force the sorting order
  const sortedPowers = [...powers].sort((a, b) => {
    const orderA = SORT_ORDER[a.name.toLowerCase()] || 99;
    const orderB = SORT_ORDER[b.name.toLowerCase()] || 99;
    return orderA - orderB;
  });

  const handleLog = async (powerName: string, options: { value: number }[]) => {
    const amount = selectedValues[powerName] || options[0].value;
    if (!amount || amount <= 0) return;

    setIsProcessing(true);
    await onLogPower(powerName, amount);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {sortedPowers.map((power) => {
        const progressPercent = Math.min((power.current / power.goal) * 100, 100);
        const isCompleted = power.current >= power.goal;
        const remaining = Math.max(0, power.goal - power.current);
        const isDropdownOpen = openDropdown === power.id;
        
        // ⚔️ THEME ENGINE
        const themeColor = power.isResetDaily ? "#10b981" : "#f59e0b";
        const themeTailwind = power.isResetDaily ? "text-mission" : "text-amber-500";
        const themeBorder = power.isResetDaily ? "border-mission/40" : "border-amber-500/40";
        const themeBgGlass = power.isResetDaily ? "bg-mission/10" : "bg-amber-500/10";
        const themeHover = power.isResetDaily ? "hover:bg-mission/20" : "hover:bg-amber-500/20";

        let unit = "unidades";
        if (power.name.toLowerCase() === "oração") unit = "min";
        if (power.name.toLowerCase() === "leitura") unit = "cap";
        if (power.name.toLowerCase() === "jejum") unit = "hrs";

        // 🔥 TS FIX: Explicitly typed as string to prevent literal assignment error
        let iconSrc: string = ICONS.oracao;
        if (power.name.toLowerCase() === "leitura") iconSrc = ICONS.leitura;
        if (power.name.toLowerCase() === "jejum") iconSrc = ICONS.jejum;

        const dropdownOptions = getDropdownOptions(power.name, remaining);
        const currentValue = selectedValues[power.name] || dropdownOptions[0].value;

        return (
          <div key={power.id} className="relative group bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all shadow-lg flex flex-col gap-4">
            
            {/* --- 1. CARD HEADER --- */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 border border-white/10 shadow-inner`}>
                  <img src={iconSrc} alt={power.name} className="w-5 h-5 object-contain brightness-150 drop-shadow-md" />
                </div>
                <div className="flex flex-col">
                  <h3 className="hud-title-md text-white text-lg uppercase tracking-widest leading-tight">{power.name}</h3>
                  <span className={`hud-label-tactical text-[8px] uppercase tracking-widest px-2 py-0.5 mt-0.5 rounded border w-fit ${themeBgGlass} ${themeTailwind} ${themeBorder}`}>
                    {power.isResetDaily ? "⚡ Meta Diária" : "📜 Acumulativo"}
                  </span>
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                 <div className="flex items-baseline gap-1">
                   <span className="hud-value text-3xl text-white drop-shadow-md">{power.current}</span>
                   <span className="hud-label-tactical text-gray-500 text-xs">/ {power.goal}</span>
                 </div>
                 <span className="hud-label-tactical text-[9px] text-gray-400 uppercase tracking-widest">{unit}</span>
              </div>
            </div>

            {/* --- 2. PREMIUM SLIM PROGRESS BAR --- */}
            <div className="w-full h-5 bg-dark-bg/80 rounded-lg border border-white/10 relative overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] backdrop-blur-md">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, #ffffff 8px, #ffffff 16px)' }}></div>
              
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full relative overflow-hidden"
                style={{ backgroundColor: themeColor, opacity: isCompleted ? 1 : 0.85 }}
              >
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[200%] animate-shimmer"></div>
              </motion.div>
              
              <div className="absolute top-0 bottom-0 w-px bg-white/60 z-10 shadow-[0_0_8px_white]" style={{ left: '100%' }}></div>
            </div>

            {/* --- 3. FOOTER INFO & INTEGRATED GLASS CONTROL UNIT --- */}
            <div className="flex justify-between items-center border-t border-white/5 pt-3">
               
               {/* Left Side: Stats (Refined Labels) */}
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

                 {isCompleted && (
                   <span className={`ml-3 hud-label-tactical text-[9px] uppercase tracking-widest animate-pulse font-bold hidden sm:block ${themeTailwind}`}>
                     {power.isResetDaily ? '✨ Progresso Salvo' : '🏆 Finalizado'}
                   </span>
                 )}
               </div>

               {/* Right Side: Integrated Glass Control Unit */}
               <div className="relative custom-dropdown-container">
                 <div className={`flex items-center h-8 rounded-lg border ${themeBorder} ${themeBgGlass} backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.3)] overflow-hidden transition-all`}>
                   
                   {/* Custom Glass Selector */}
                   <button
                     onClick={() => setOpenDropdown(isDropdownOpen ? null : power.id)}
                     className={`h-full pl-3 pr-2 flex items-center justify-between gap-1 border-r ${themeBorder} ${themeHover} transition-colors min-w-[3.2rem]`}
                   >
                     <span className={`hud-label-tactical text-[10px] font-bold ${themeTailwind}`}>+{currentValue}</span>
                     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${themeTailwind} transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                       <path d="M6 9l6 6 6-6"/>
                     </svg>
                   </button>

                   {/* Add Action Button */}
                   <button
                     onClick={() => handleLog(power.name, dropdownOptions)}
                     disabled={isProcessing}
                     className={`h-full px-3 flex items-center justify-center ${themeHover} active:bg-white/10 transition-colors disabled:opacity-50`}
                   >
                     <span className={`hud-label-tactical uppercase tracking-widest font-bold text-[10px] ${themeTailwind}`}>ADD</span>
                   </button>
                 </div>

                 {/* Custom Glassmorphic Dropdown Menu */}
                 <AnimatePresence>
                   {isDropdownOpen && (
                     <motion.div
                       initial={{ opacity: 0, y: 5, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 5, scale: 0.95 }}
                       transition={{ duration: 0.15 }}
                       className={`absolute bottom-[calc(100%+8px)] right-0 min-w-full bg-[#050505]/80 border ${themeBorder} backdrop-blur-xl rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden z-50`}
                     >
                       {dropdownOptions.map((opt) => (
                         <button
                           key={opt.label}
                           onClick={() => {
                             setSelectedValues(prev => ({ ...prev, [power.name]: opt.value }));
                             setOpenDropdown(null);
                           }}
                           className={`w-full text-center px-3 py-2 text-white hover:bg-white/20 hud-label-tactical text-[10px] font-bold transition-colors ${currentValue === opt.value ? themeBgGlass + ' ' + themeTailwind : ''}`}
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