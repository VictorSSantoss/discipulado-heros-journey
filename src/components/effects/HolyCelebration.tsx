"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export default function HolyCelebration({ onComplete }: { onComplete: () => void }) {
  /* Particle generation for the confetti effect with randomized physics and dimensions */
  const particles = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      /* Initial trajectory angle in radians */
      angle: Math.random() * Math.PI * 2,
      /* Force of the initial explosion burst */
      velocity: Math.random() * 500 + 400, 
      /* Rectangular dimensions for paper-like confetti appearance */
      width: Math.random() * 8 + 4, 
      height: Math.random() * 12 + 6,
      /* Selective color palette based on kingdom themes */
      color: Math.random() > 0.5 ? "#fbbf24" : "#22d3ee",
      /* Staggered start times for a continuous burst feel */
      delay: Math.random() * 0.2,
      /* Rotation values for fluttering motion */
      spinX: Math.random() * 1080 - 540,
      spinY: Math.random() * 1080 - 540,
      /* Horizontal drift factor during the descent */
      drift: Math.random() * 200 - 100,
    }));
  }, []);

  /* Lifecycle management to trigger completion callback after animation duration */
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center overflow-hidden">
      
      {/* Central atmospheric glow to provide a backdrop for the burst */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0.5, 2, 2.5], 
          opacity: [0, 0.5, 0] 
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(34, 211, 238, 0.3) 50%, transparent 70%)" }}
      />

      {/* Individual confetti pieces with complex animation paths */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotateX: 0, rotateY: 0 }}
          animate={{ 
            /* Calculation of initial explosion and subsequent horizontal drift */
            x: [0, Math.cos(p.angle) * p.velocity * 0.5, Math.cos(p.angle) * p.velocity + p.drift],
            /* Calculation of upward thrust followed by gravity-induced descent */
            y: [0, Math.sin(p.angle) * p.velocity * 0.5, Math.sin(p.angle) * p.velocity + 600],
            opacity: [1, 1, 0], 
            scale: [0, 1.2, 0.5],
            rotateX: p.spinX,
            rotateY: p.spinY
          }}
          transition={{ 
            duration: 3, 
            ease: [0.22, 1, 0.36, 1],
            delay: p.delay 
          }}
          style={{
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}66`,
            /* Geometric variation between circular and rectangular pieces */
            borderRadius: Math.random() > 0.8 ? "50%" : "1px",
            position: "absolute",
            perspective: "1000px"
          }}
        />
      ))}

      {/* High-intensity flash overlay for immediate visual feedback of completion */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-white mix-blend-screen"
      />
    </div>
  );
}