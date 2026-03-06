"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function AchievementToast({ medal, themeColor, onClose }: any) {
  useEffect(() => {
    // Auto-close after 4 seconds to let the next medal in the queue pop up!
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Built-in color dictionary
  const RARITY_COLORS: Record<string, string> = {
    COMMON: "#9CA3AF",    // Tactical Gray
    RARE: "#10B981",      // Emerald Green
    LEGENDARY: "#F59E0B"  // Premium Gold
  };

  const glowColor = RARITY_COLORS[medal.rarity] || themeColor || "#9CA3AF";

  // Dynamic titles based on rarity
  const rarityLabels: Record<string, string> = {
    COMMON: "NOVA CONQUISTA",
    RARE: "NOVA CONQUISTA RARA",
    LEGENDARY: "NOVA CONQUISTA LENDÁRIA"
  };
  const titleLabel = rarityLabels[medal.rarity] || "NOVA CONQUISTA";

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[500] pointer-events-none w-full max-w-sm px-4"
    >
      <div 
        className="relative bg-dark-bg/95 backdrop-blur-2xl border-2 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-6 overflow-hidden"
        style={{ 
          boxShadow: `0 10px 40px -10px ${glowColor}60`,
          borderColor: `${glowColor}40` 
        }}
      >
        <div 
          className="absolute inset-0 opacity-10 animate-pulse"
          style={{ background: `radial-gradient(circle at 20% 50%, ${glowColor}, transparent 70%)` }}
        />

        <div className="relative w-20 h-20 shrink-0 z-10 flex items-center justify-center bg-black/40 rounded-2xl border border-white/5">
          <img 
            src={medal.icon} 
            alt="" 
            className="w-full h-full object-contain p-2" 
            style={{ filter: `drop-shadow(0 0 10px ${glowColor})` }}
          />
        </div>

        <div className="flex flex-col z-10">
          <span 
            className="hud-label-tactical text-[10px] uppercase tracking-[0.2em] mb-1 font-bold"
            style={{ color: glowColor }}
          >
            {titleLabel}
          </span>
          <h4 className="hud-title-md text-white text-xl leading-tight mb-1">
            {medal.name}
          </h4>
          <p className="text-gray-400 text-[11px] font-barlow leading-snug">
            {medal.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}