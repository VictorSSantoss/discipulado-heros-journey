"use client";

import { ICONS } from "@/constants/gameConfig";

export default function FontForge() {
  const fontFamilies = [
    { name: "Bebas Neue", class: "font-bebas", description: "Best for main titles and cinematic impact." },
    { name: "Barlow", class: "font-barlow", description: "Perfect for UI labels, stats, and body text." },
    { name: "Staatliches", class: "font-staatliches", description: "Aggressive, military-style headers." },
    { name: "Fugaz One", class: "font-fugaz", description: "High-energy, italicized action headers." },
  ];

  return (
    <main className="p-10 max-w-6xl mx-auto min-h-screen text-white pb-32">
      <header className="mb-12">
        <h1 className="font-bebas text-6xl tracking-tighter text-brand">FONT FORGE v1.0</h1>
        <p className="font-barlow text-gray-500 uppercase tracking-widest font-black text-xs mt-2">
          Laboratório de Tipografia e Interface
        </p>
      </header>

      <div className="space-y-16">
        {fontFamilies.map((font) => (
          <section key={font.name} className="relative p-8 bg-dark-surface/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden group">
            {/* NEW EDGE-LIT BORDER EFFECT */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT: PREVIEW */}
              <div className="space-y-6">
                <div>
                  <span className="font-barlow text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black">Display Header</span>
                  <h2 className={`${font.class} text-7xl leading-none mt-2 uppercase`}>
                    Missão Cumprida
                  </h2>
                </div>

                <div>
                  <span className="font-barlow text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black">HUD Statistics</span>
                  <div className="flex gap-6 mt-2">
                    <div className="flex flex-col">
                      <span className={`${font.class} text-4xl text-brand`}>45</span>
                      <span className="font-barlow text-[9px] text-gray-400 uppercase font-bold">Valentes</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={`${font.class} text-4xl text-mission`}>26</span>
                      <span className="font-barlow text-[9px] text-gray-400 uppercase font-bold">Decretos</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={`${font.class} text-4xl text-xp`}>12.5k</span>
                      <span className="font-barlow text-[9px] text-gray-400 uppercase font-bold">Total XP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: DETAILS & UI CARDS */}
              <div className="flex flex-col justify-center gap-6 border-l border-white/5 pl-10">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <h3 className="font-bebas text-xl text-white tracking-widest">{font.name}</h3>
                  <p className="font-barlow text-sm text-gray-400 mt-1">{font.description}</p>
                </div>

                {/* MINI CARD PREVIEW */}
                <div className="p-4 bg-dark-bg/60 rounded-xl border border-white/10 group-hover:border-brand/30 transition-all">
                   <p className={`${font.class} text-sm text-gray-300 leading-relaxed`}>
                     "O cavalo prepara-se para o dia da batalha, mas a vitória vem do Senhor." 
                     Provérbios 21:31. Este é um teste de legibilidade para o corpo do texto.
                   </p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* FOOTER ACTION */}
      <footer className="mt-20 p-8 border-t border-white/5 text-center">
        <p className="font-barlow text-gray-500 text-xs uppercase tracking-widest">
          Selecione as combinações que melhor representam o Reino.
        </p>
      </footer>
    </main>
  );
}