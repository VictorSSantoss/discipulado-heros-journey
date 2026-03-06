"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LevelUpProps {
  levelName: string;
  levelIcon: string;
  themeColor: string;
  onComplete: () => void;
}

export default function LevelUpNotification({ levelName, levelIcon, themeColor, onComplete }: LevelUpProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5000); // Auto-dismiss after 5s
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-none"
    >
      {/* The Scanning Beam */}
      <motion.div 
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute left-0 right-0 h-1 z-[110]"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)`,
          boxShadow: `0 0 30px ${themeColor}, 0 0 60px ${themeColor}`
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* The Icon with Holographic Pulse */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 blur-2xl opacity-50 animate-pulse" style={{ backgroundColor: themeColor }}></div>
          <img src={levelIcon} alt="" className="w-32 h-32 object-contain relative z-10" />
        </motion.div>

        {/* The Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <span className="hud-label-tactical text-brand text-lg block tracking-[0.3em] mb-2 animate-pulse">
            SISTEMA ATUALIZADO
          </span>
          <h2 className="hud-title-lg text-white text-5xl mb-1 drop-shadow-2xl">
            {levelName}
          </h2>
          <div className="h-px w-48 mx-auto mt-4" style={{ backgroundColor: themeColor }}></div>
        </motion.div>
      </div>
    </motion.div>
  );
}