"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface AchievementToastProps {
  medal: {
    name: string;
    description: string;
    icon: string;
    rarity: string;
  };
  themeColor: string;
  onClose: () => void;
}

export default function AchievementToast({ medal, themeColor, onClose }: AchievementToastProps) {
  // Auto-close the toast after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Determine glow color based on rarity
  const isLegendary = medal.rarity === "LEGENDARY";
  const glowColor = isLegendary ? "#fbbf24" : themeColor; // Gold for legendary, theme for rare

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
    >
      <div 
        className="relative bg-dark-bg/95 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-6 min-w-[320px] overflow-hidden"
        style={{ boxShadow: `0 10px 40px -10px ${glowColor}80` }}
      >
        {/* Animated Background Glow */}
        <div 
          className="absolute inset-0 opacity-20 animate-pulse pointer-events-none"
          style={{ background: `radial-gradient(circle at 20% 50%, ${glowColor}, transparent 70%)` }}
        />

        {/* Floating Icon */}
        <motion.div 
          initial={{ rotate: -15, scale: 0.5 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
          className="relative w-16 h-16 shrink-0 z-10"
        >
          <img 
            src={medal.icon} 
            alt={medal.name} 
            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
          />
        </motion.div>

        {/* Text Payload */}
        <div className="flex flex-col z-10">
          <span 
            className="hud-label-tactical text-[10px] uppercase tracking-[0.2em] mb-1 animate-pulse"
            style={{ color: glowColor }}
          >
            {isLegendary ? "NOVA CONQUISTA LENDÁRIA" : "NOVA CONQUISTA RARA"}
          </span>
          <h4 className="hud-title-md text-white text-lg leading-none mb-1 shadow-black drop-shadow-md">
            {medal.name}
          </h4>
          <p className="text-gray-400 text-xs font-barlow leading-tight">
            {medal.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}