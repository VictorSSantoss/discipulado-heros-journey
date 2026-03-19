"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Generates a burst of "Sacred Embers" (golden and cyan particles).
 * Designed to trigger when a streak mission is completed.
 */
export default function HolyCelebration({ onComplete }: { onComplete: () => void }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number }[]>([]);

  useEffect(() => {
    // Generate 40 sacred particles with random trajectories
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 600, // Horizontal spread
      y: (Math.random() - 0.5) * 600, // Vertical spread
      size: Math.random() * 6 + 2,
      color: Math.random() > 0.5 ? "#fbbf24" : "#22d3ee", // Gold or Cyan
    }));
    
    setParticles(newParticles);

    // Auto-terminate the effect after 3 seconds
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[600] flex items-center justify-center">
      {/* Central Divine Flash */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 2], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-64 h-64 bg-white rounded-full blur-[100px]"
      />

      {/* Particle Burst */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ 
            x: p.x, 
            y: p.y, 
            opacity: 0, 
            scale: 0,
            rotate: Math.random() * 360 
          }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 15px ${p.color}`,
            borderRadius: "2px",
            position: "absolute"
          }}
        />
      ))}

      {/* Vertical Light Pillar */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: ["0vh", "100vh", "100vh"], opacity: [0, 0.5, 0] }}
        transition={{ duration: 2, times: [0, 0.2, 1] }}
        className="absolute w-2 bg-gradient-to-t from-transparent via-white to-transparent blur-md"
      />
    </div>
  );
}