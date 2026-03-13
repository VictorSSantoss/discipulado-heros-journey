"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ICONS } from "@/constants/gameConfig";

interface MissionCompletionOverlayProps {
  mission: {
    title: string;
    xpReward: number;
  };
  onComplete: () => void;
}

export default function MissionCompletionOverlay({ mission, onComplete }: MissionCompletionOverlayProps) {
  const [visible, setVisible] = useState(true);

  // Automatically triggers the exit animation after a set duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="relative max-w-md w-full bg-dark-bg border border-mission/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden text-center"
          >
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mission to-transparent" />
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-mission/10 rounded-full blur-3xl" />
            
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="relative z-10 w-20 h-20 mx-auto mb-6 bg-mission/20 rounded-2xl border border-mission/40 flex items-center justify-center"
            >
              <img src={ICONS.missoes} alt="" className="w-12 h-12 object-contain brightness-110" />
            </motion.div>

            <h2 className="hud-label-tactical text-mission text-sm tracking-[0.4em] mb-2 uppercase">
              Decreto Cumprido
            </h2>
            
            <h1 className="hud-title-md text-3xl text-white mb-6 uppercase tracking-tight">
              {mission.title}
            </h1>

            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
              <span className="hud-value text-2xl text-mission">+{mission.xpReward}</span>
              <span className="hud-label-tactical text-xs text-gray-500 uppercase">Experiência</span>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-gray-500 text-[10px] uppercase tracking-widest animate-pulse"
            >
              Clique em qualquer lugar para fechar
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}