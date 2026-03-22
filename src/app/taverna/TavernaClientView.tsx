"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useState, useMemo } from "react";

/**
 * Defining variants for staggered entrance of the list items.
 */
const containerVariants = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
} as const;

/**
 * Defining variants for individual item entrance animations.
 */
const itemVariants = { 
  hidden: { y: 20, opacity: 0 }, 
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } 
} as const;

/**
 * Mapping rank to portrait ray background assets.
 */
const rarityRayMap: Record<number, string> = { 
  1: "/images/ray-legendary.png", 
  2: "/images/ray-rare.png", 
  3: "/images/ray-common.png" 
};

/**
 * Mapping rank to RGB color strings for thematic UI highlights.
 */
const rarityColorMap: Record<number, string> = { 
  1: "255, 170, 0", 
  2: "59, 130, 246", 
  3: "255, 255, 255" 
};

/**
 * Card component representing the top three ranking monoliths.
 */
function MonolithCard({ valente, rank, isFirst = false }: { valente: any; rank: number; isFirst?: boolean }) {
  const heightClass = isFirst ? "h-[580px]" : "h-[540px]";
  const rayImageSrc = rarityRayMap[rank as keyof typeof rarityRayMap];
  const rgbColor = rarityColorMap[rank as keyof typeof rarityColorMap];
  
  // DYNAMIC RANK ASSIGNMENT
  const lvlInfo = {
    name: valente.patente?.title || "RECRUTA",
    icon: valente.patente?.iconUrl || "/images/ranks/default-rank.svg"
  };
  
  return (
    <div className={`relative flex flex-col w-full ${heightClass} rounded-xl overflow-hidden group transition-all duration-500 hover:-translate-y-2 cursor-default bg-[#0c0d0e] border border-white/5 shadow-2xl flex-shrink-0`}>
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand/10 backdrop-blur-md border border-white/10 shadow-xl transition-transform duration-500 group-hover:scale-110">
        <img src={lvlInfo.icon} alt="" className="w-5 h-5 object-contain" />
        <span className="hud-label-tactical text-[10px] text-white font-black uppercase tracking-widest leading-none">{lvlInfo.name}</span>
      </div>

      <div className="relative w-full h-[50%] flex items-center justify-center bg-dark-bg/80 overflow-hidden shrink-0">
        <img src={rayImageSrc} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-screen scale-150 z-0 opacity-100 transform-gpu" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0c0d0e] via-transparent to-transparent" />
        
        <img src={valente.image || '/images/man-silhouette.svg'} alt="" className="w-full h-full object-contain p-2 relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]" />
      </div>

      <div className="relative flex flex-col items-center flex-1 px-4 pb-6 pt-14 z-10">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 flex items-center justify-center bg-[#0c0d0e] shadow-xl z-20" style={{ borderColor: `rgb(${rgbColor})` }}>
          <span className="hud-title-md text-2xl text-white mt-1" style={{ textShadow: `0 0 10px rgba(${rgbColor}, 0.5)` }}>{rank}º</span>
        </div>
        
        <div className="flex flex-col items-center gap-8 flex-1 w-full mt-2">
          
          <div className="flex items-center gap-3 w-full justify-center px-2 -mt-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/40 max-w-[40px]" />
            <h3 
              className="hud-title-md text-2xl m-0 tracking-widest text-center uppercase leading-none font-black whitespace-nowrap"
              style={{ 
                color: 'white',
                textShadow: `0 0 4px rgba(${rgbColor}, 0.4)`
              }}
            >
              {valente.name}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/40 max-w-[40px]" />
          </div>

          {valente.managedBy?.guildaName && (
            <div className="relative flex items-center gap-2 px-5 -my-1 rounded-3xl bg-gradient-to-r from-mission/20 to-mission/5 border border-mission/50 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)] overflow-hidden group/badge shrink-0 mt-2">
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-glow-sweep-slow" />
              </div>
              <span className="hud-label-tactical text-[13px] text-mission uppercase font-black tracking-widest leading-none mt-[2px] relative z-10">{valente.managedBy.guildaName}</span>
              {valente.managedBy.guildaIcon && <img src={valente.managedBy.guildaIcon} alt="" className="w-9 h-9 object-contain relative z-10" />}
            </div>
          )}
          
          <div className="mt-auto w-full relative flex flex-col items-center justify-center py-6 h-20">
             <img src="/images/flare-main.png" alt="" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-full object-contain mix-blend-screen opacity-60 pointer-events-none scale-110" />
             <div className="flex items-baseline justify-center gap-2 relative z-10">
                <span className="hud-value text-4xl leading-none" style={{ color: `rgb(${rgbColor})`, textShadow: `0 0 12px rgba(${rgbColor}, 0.4)` }}>
                   {valente.totalXP.toLocaleString('pt-BR')}
                </span>
                <span className="text-[10px] hud-label-tactical text-gray-500 uppercase tracking-widest font-black">XP</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Standard list card for elite ranking display.
 */
function TavernaHeroCard({ valente, rank }: { valente: any; rank: number }) {
  // DYNAMIC RANK ASSIGNMENT
  const lvlInfo = {
    name: valente.patente?.title || "RECRUTA",
    icon: valente.patente?.iconUrl || "/images/ranks/default-rank.svg"
  };

  return (
    <Link href={`/admin/valentes/${valente.id}`}>
      <div className="relative bg-white/[0.02] border border-white/5 hover:border-mission/40 rounded-xl p-5 flex items-center gap-5 transition-all group overflow-hidden">
        <div className="w-14 h-14 bg-black/40 border border-white/5 rounded-lg overflow-hidden shrink-0 relative z-10 flex items-center justify-center">
          <img src={valente.image || '/images/man-silhouette.svg'} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0 relative z-10 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {valente.managedBy?.guildaName && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-mission/10 border border-mission/20 w-fit">
                <span className="hud-label-tactical text-[8px] text-mission uppercase font-bold tracking-widest leading-none">{valente.managedBy.guildaName}</span>
              </div>
            )}
            <div className="flex items-center gap-1 opacity-60 leading-none">
               <img src={lvlInfo.icon} alt="" className="w-8 h-8 object-contain" />
               <span className="hud-label-tactical text-[15px] text-gray-400 uppercase tracking-widest">{lvlInfo.name.split(' ').pop()}</span>
            </div>
          </div>
          <h4 className="hud-title-md text-2xl text-white m-0 truncate leading-none group-hover:text-mission transition-colors uppercase">{valente.name}</h4>
        </div>
        <div className="text-right shrink-0 relative z-10 flex flex-col items-end">
          <p className="hud-value text-white group-hover:text-mission transition-colors text-3xl leading-none">{valente.totalXP.toLocaleString('pt-BR')}</p>
          <p className="hud-label-tactical text-[9px] text-gray-700 mt-1 uppercase tracking-tighter font-black">PONTOS</p>
        </div>
      </div>
    </Link>
  );
}

/**
 * Main client view component managing view modes and parallax effects.
 */
export default function TavernaClientView({ 
  rankedValentes, 
  userGuildaName,
  userGuildaIcon 
}: { 
  rankedValentes: any[], 
  userGuildaName?: string,
  userGuildaIcon?: string
}) {
  const [viewMode, setViewMode] = useState<"GLOBAL" | "GUILDA">("GLOBAL");
  const [showTopBtn, setShowTopBtn] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const moveX = useTransform(springX, [-1000, 1000], [30, -30]);
  const moveY = useTransform(springY, [-1000, 1000], [30, -30]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX - window.innerWidth / 2);
    mouseY.set(e.clientY - window.innerHeight / 2);
  };

  const displayValentes = useMemo(() => {
    if (viewMode === "GLOBAL") return rankedValentes;
    return rankedValentes.filter((v: any) => v.managedBy?.guildaName === userGuildaName);
  }, [viewMode, rankedValentes, userGuildaName]);

  const topThree = displayValentes.slice(0, 3);
  const others = displayValentes.slice(3);

  const { scrollY } = useScroll();
  const light1Y = useTransform(scrollY, [0, 1000], [0, 200]);
  const light2Y = useTransform(scrollY, [0, 1000], [0, -150]);

  useMotionValueEvent(scrollY, "change", (latest: number) => { 
    setShowTopBtn(latest > 500); 
  });

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="relative" onMouseMove={handleMouseMove}>
      
      {/* 🚀 GLOW FIX: 
          Increased outline and boxShadow to 300px to ensure the browser provides a massive 
          texture area for the blur, preventing left-side clipping. 
      */}
      <motion.div 
        style={{ 
          y: light1Y, 
          willChange: "transform, filter", 
          outline: "300px solid transparent", 
          boxShadow: "0 0 0 300px transparent" 
        }}
        animate={{ backgroundColor: viewMode === "GLOBAL" ? "rgba(17, 194, 199, 0.05)" : "rgba(16, 185, 129, 0.08)" }}
        className="fixed top-[-100px] left-1/4 w-[40%] h-[600px] blur-[120px] rounded-full pointer-events-none z-0 transition-colors duration-1000 transform-gpu" 
      />
      <motion.div 
        style={{ 
          y: light2Y, 
          willChange: "transform, filter", 
          outline: "300px solid transparent", 
          boxShadow: "0 0 0 300px transparent" 
        }}
        animate={{ backgroundColor: viewMode === "GLOBAL" ? "rgba(16, 185, 129, 0.05)" : "rgba(16, 185, 129, 0.12)" }}
        className="fixed top-[200px] right-1/4 w-[35%] h-[500px] blur-[100px] rounded-full pointer-events-none z-0 transition-colors duration-1000 transform-gpu" 
      />

      <AnimatePresence>
        {viewMode === "GUILDA" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.04, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            style={{ x: moveX, y: moveY }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
          >
            <img src={userGuildaIcon || "/images/ranking-icon.svg"} alt="" className="w-[60vw] h-[60vw] object-contain grayscale brightness-200" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center mb-16 relative z-50">
        <div className="bg-black/80 border border-white/10 p-3 rounded-2xl flex relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl h-16 w-[420px] flex-shrink-0 overflow-hidden">
          <motion.div 
            className="absolute top-3 bottom-3 left-3 bg-brand rounded-xl z-0"
            initial={false}
            animate={{ 
              x: viewMode === "GLOBAL" ? 0 : '100%', 
              width: 'calc(50% - 12px)' 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button 
            onClick={() => setViewMode("GLOBAL")}
            className={`relative z-10 flex-1 hud-label-tactical text-[11px] transition-colors duration-300 uppercase tracking-[0.2em] font-black px-4 ${viewMode === "GLOBAL" ? 'text-black' : 'text-gray-500 hover:text-white'}`}
          >
            Ranking Global
          </button>
          <button 
            onClick={() => setViewMode("GUILDA")}
            disabled={!userGuildaName}
            className={`relative z-10 flex-1 hud-label-tactical text-[11px] transition-colors duration-300 uppercase tracking-[0.2em] font-black px-4 ${viewMode === "GUILDA" ? 'text-black' : 'text-gray-500 hover:text-white opacity-40'}`}
          >
            Sua Guilda
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={viewMode} variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="relative z-10">
          {displayValentes.length === 0 ? (
            <div className="text-center py-40 opacity-30 hud-label-tactical italic uppercase tracking-widest">Nenhum valente encontrado nesta guilda.</div>
          ) : (
            <>
              <section className="flex flex-col md:flex-row justify-center items-center md:items-end gap-10 mb-32 relative z-20">
                {topThree[1] && <motion.div variants={itemVariants} className="w-full md:w-80 order-2 md:order-1"><MonolithCard valente={topThree[1]} rank={2} /></motion.div>}
                {topThree[0] && <motion.div variants={itemVariants} className="w-full md:w-96 order-1 md:order-2 z-30 transform md:-translate-y-8"><MonolithCard valente={topThree[0]} rank={1} isFirst={true} /></motion.div>}
                {topThree[2] && <motion.div variants={itemVariants} className="w-full md:w-80 order-3 md:order-3"><MonolithCard valente={topThree[2]} rank={3} /></motion.div>}
              </section>

              <section className="pb-20">
                <div className="flex items-center gap-6 mb-12">
                  <h2 className="hud-title-md text-3xl text-gray-600 m-0 tracking-widest uppercase">{viewMode === "GLOBAL" ? "Elite de Combate" : `Elite da ${userGuildaName}`}</h2>
                  <div className="h-px bg-white/5 flex-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {others.map((v: any, index: number) => (
                    <motion.div key={v.id} variants={itemVariants}>
                      <TavernaHeroCard valente={v} rank={index + 4} />
                    </motion.div>
                  ))}
                </div>
              </section>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 z-[100] w-14 h-14 rounded-full bg-mission/10 border border-mission/30 backdrop-blur-md flex items-center justify-center text-mission hover:bg-mission hover:text-white transition-all shadow-xl group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 group-hover:-translate-y-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}