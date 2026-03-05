"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* GLOBAL CONFIGURATION IMPORTS */
import { MISSION_CATEGORIES } from "@/constants/gameConfig";
import { createMission } from "@/app/actions/missionActions";

/**
 * NovaMissaoPage Component
 * Administrative interface for defining new kingdom challenges.
 * Integrated with the centralized HUD Typography System for design consistency.
 */
export default function NovaMissaoPage() {
  const router = useRouter();

  /* FORM STATE MANAGEMENT */
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(MISSION_CATEGORIES[0] || "Hábitos Espirituais");
  const [xpReward, setXpReward] = useState<number | string>(100);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * FORM SUBMISSION HANDLER
   * Finalizes the creation process and redirects the administrator to the Mission Board.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsSubmitting(true);

    // Convert 'LVL UP DIRETO' to a recognizable integer for the database schema (e.g., 9999)
    const finalXpReward = xpReward === 'LVL UP DIRETO' ? 9999 : Number(xpReward);

    const result = await createMission({
      title,
      description,
      xpReward: finalXpReward,
      type: category,
    });

    if (result.success) {
      router.push('/admin/missoes');
      router.refresh();
    } else {
      alert("Falha ao forjar missão. O banco de dados bloqueou a operação.");
      setIsSubmitting(false);
    }
  };

  return (
    /* CONTAINER 1: PAGE MASTER WRAPPER */
    <main className="min-h-screen p-6 max-w-4xl mx-auto text-white font-barlow">
      
      {/* CONTAINER 2: MISSION_HEADER_CONTROL */}
      <header className="w-full bg-dark-bg/60 backdrop-blur-xl border border-white/10 p-5 mb-10 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mission/40 to-transparent"></div>
        
        <div className="flex items-center gap-6">
          <Link href="/admin/missoes" className="hud-label-tactical text-[9px] hover:text-white transition-all">
            ← CANCELAR
          </Link>
          <div className="h-8 w-px bg-white/5"></div>
          <span className="hud-title-md text-mission">
            FORJAR NOVA MISSÃO
          </span>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-brand hover:brightness-110 text-dark-bg hud-title-md px-8 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(17,194,199,0.3)] disabled:opacity-50"
        >
          {isSubmitting ? "FORJANDO..." : "PUBLICAR MISSÃO"}
        </button>
      </header>

      {/* CONTAINER 3: MISSION_FORGE_FORM */}
      <form onSubmit={handleSubmit} className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-6 md:p-10 rounded-2xl shadow-2xl space-y-10 relative overflow-hidden">
        
        {/* CONTAINER 4: CORE_IDENTITY_GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col">
            <label className="hud-label-tactical mb-3">TÍTULO DA QUEST</label>
            <input 
              required
              type="text" 
              placeholder="EX: LER O LIVRO DE NEEMIAS"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-dark-bg/80 border border-white/10 p-4 rounded-xl text-white hud-title-md outline-none focus:border-mission/50 transition-all shadow-inner placeholder:opacity-20"
            />
          </div>

          <div className="flex flex-col">
            <label className="hud-label-tactical mb-3">CATEGORIA</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-dark-bg/80 border border-white/10 p-4 rounded-xl text-white font-barlow font-bold uppercase tracking-widest text-sm outline-none focus:border-mission/50 h-[68px] appearance-none cursor-pointer shadow-inner"
            >
              {MISSION_CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-dark-bg text-white">
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTAINER 5: REWARD_CONFIGURATION_WRAPPER */}
        <div className="flex flex-col max-w-sm">
          <label className="hud-label-tactical mb-3">RECOMPENSA DE EXPERIÊNCIA</label>
          <div className="flex gap-4 items-center bg-dark-bg/60 p-3 rounded-2xl border border-white/5 shadow-inner">
            <input 
              type="number" 
              value={xpReward === 'LVL UP DIRETO' ? '' : xpReward}
              onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
              disabled={xpReward === 'LVL UP DIRETO'}
              className="bg-dark-bg/80 border border-white/10 p-3 rounded-lg text-xp hud-value outline-none focus:border-xp/50 w-28 disabled:opacity-20 transition-all [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
            />
            <span className="hud-title-md text-xp/50">XP</span>
            <div className="h-10 w-px bg-white/5 mx-2"></div>
            <button 
              type="button"
              onClick={() => setXpReward(xpReward === 'LVL UP DIRETO' ? 100 : 'LVL UP DIRETO')}
              className={`flex-1 py-3 border rounded-xl hud-label-tactical transition-all shadow-lg ${
                xpReward === 'LVL UP DIRETO' 
                  ? "bg-brand border-brand text-dark-bg shadow-[0_0_15px_rgba(17,194,199,0.3)]" 
                  : "bg-dark-bg/80 border-white/10 text-gray-500 hover:border-brand/50 hover:text-brand"
              }`}
            >
              LVL UP DIRETO
            </button>
          </div>
        </div>

        {/* CONTAINER 6: INSTRUCTION_ENTRY_WRAPPER */}
        <div className="flex flex-col">
          <label className="hud-label-tactical mb-3">INSTRUÇÕES PARA O VALENTE</label>
          <textarea 
            rows={5}
            placeholder="DESCREVA O QUE O HERÓI PRECISA FAZER PARA COMPLETAR ESTA MISSÃO..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-dark-bg/80 border border-white/10 p-5 rounded-xl text-gray-300 font-barlow text-sm outline-none focus:border-mission/50 resize-none shadow-inner leading-relaxed"
          />
        </div>

      </form>
    </main>
  );
}