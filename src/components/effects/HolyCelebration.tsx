"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export default function HolyCelebration({ onComplete }: { onComplete: () => void }) {
  const particles = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      angle: Math.random() * Math.PI * 2,
      // Increased velocity for a "Room-Filling" burst
      velocity: Math.random() * 600 + 300, 
      // Chunky size for better visibility
      size: Math.random() * 12 + 6, 
      color: Math.random() > 0.4 ? "#fbbf24" : "#22d3ee",
      delay: Math.random() * 0.3,
      // Random rotation speed for a "confetti" feel
      spin: Math.random() * 1000 - 500,
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center overflow-hidden">
      
      {/* 1. SOFT GOD RAY AURA (Replaces the "out of place" ray) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: [0, 0.4, 0],
          scale: [0.5, 1.5, 2],
          rotate: [0, 45]
        }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute w-[800px] h-[800px] opacity-30"
        style={{
          background: "conic-gradient(from 0deg, transparent, rgba(34, 211, 238, 0.2), transparent, rgba(251, 191, 36, 0.2), transparent)"
        }}
      />

      {/* 2. CENTRAL DIVINE RADIANCE */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1, 3], 
          opacity: [0, 1, 0] 
        }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, #fff 0%, rgba(34, 211, 238, 0.4) 40%, transparent 70%)" }}
      />

      {/* 3. SACRED EMBERS (Bigger & More Dynamic) */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ 
            x: Math.cos(p.angle) * p.velocity,
            y: Math.sin(p.angle) * p.velocity + 200, // Added "Gravity" fall
            opacity: 0, 
            scale: 0.2,
            rotate: p.spin 
          }}
          transition={{ 
            duration: 3, 
            ease: [0.16, 1, 0.3, 1], // Exponential out
            delay: p.delay 
          }}
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 25px ${p.color}, 0 0 10px white`,
            borderRadius: Math.random() > 0.5 ? "2px" : "50%", // Mixed shapes for variety
            position: "absolute"
          }}
        />
      ))}

      {/* 4. TOTAL SCREEN IMPACT FLASH */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-white mix-blend-overlay"
      />
    </div>
  );
}