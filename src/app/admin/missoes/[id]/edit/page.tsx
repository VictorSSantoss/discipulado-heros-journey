"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mockMissions } from "@/lib/mockData";
import { MISSION_CATEGORIES } from "@/constants/gameConfig";

/**
 * EditMissionPage Component
 * Provides the interface for modifying existing decrees.
 * Utilizes the centralized HUD Typography System for global style synchronization.
 */
export default function EditMissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  /* DATA RETRIEVAL LOGIC */
  const mission = mockMissions.find((m) => m.id === id);

  /* FORM STATE MANAGEMENT */
  const [title, setTitle] = useState("");
  const [xpReward, setXpReward] = useState("");
  const [isLvlUp, setIsLvlUp] = useState(false);
  const [category, setCategory] = useState<string>(MISSION_CATEGORIES[0]);

  /**
   * INITIALIZATION HOOK
   * Hydrates the form states once the mission record is identified in the database.
   */
  useEffect(() => {
    setMounted(true);
    if (mission) {
      setTitle(mission.title);
      setIsLvlUp(mission.xpReward === 'LVL UP DIRETO');
      setXpReward(mission.xpReward === 'LVL UP DIRETO' ? "" : String(mission.xpReward));
      setCategory(mission.category);
    }
  }, [mission]);

  if (!mounted) return null;

  /* ERROR BOUNDARY */
  if (!mission) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <span className="hud-title-md text-gray-500">
          Missão não encontrada.
        </span>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Quest atualizada com sucesso!");
    router.push('/admin/missoes');
  };

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto flex flex-col pb-20 text-white font-barlow">
      {/* PAGE_MASTER_WRAPPER */}
      
      <header className="w-full bg-dark-bg/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex justify-between items-center shadow-2xl mb-8 relative overflow-hidden">
        {/* HEADER_NAV_BAR */}
        
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"></div>
        
        <div className="flex items-center gap-5">
          <Link href="/admin/missoes" className="hud-label-tactical text-[9px] hover:text-brand transition-all">
            ← CANCELAR
          </Link>
          <div className="h-6 w-px bg-white/5"></div>
          <span className="hud-title-md text-brand mt-0.5">
            EDITAR MISSÃO
          </span>
        </div>
      </header>

      <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
        {/* FORM_CARD_CONTAINER */}
        
        <div className="bg-mission/80 py-4 px-6 relative overflow-hidden">
          {/* FORM_HEADER_STRIP */}
          <h2 className="hud-title-md text-white m-0 drop-shadow-lg">
            REFORJAR DECRETO
          </h2>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-6">
          
          <div className="flex flex-col gap-2">
            {/* INPUT_FIELD_TITLE */}
            <label className="hud-label-tactical">TÍTULO DA MISSÃO</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-dark-bg/80 border border-white/10 p-3.5 text-white hud-title-md rounded-xl focus:border-brand/50 outline-none transition-all w-full shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-2">
            {/* INPUT_FIELD_CATEGORY */}
            <label className="hud-label-tactical">CATEGORIA ESTRATÉGICA</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-dark-bg/80 border border-white/10 p-3.5 text-white font-barlow font-bold uppercase tracking-widest text-xs rounded-xl focus:border-brand/50 outline-none transition-all w-full appearance-none cursor-pointer shadow-inner"
            >
              {MISSION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-dark-bg text-white">{cat.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-end p-5 border border-white/5 bg-dark-bg/60 rounded-2xl shadow-inner">
            {/* REWARD_METRICS_BLOCK */}
            
            <div className="flex-1 flex flex-col gap-2 w-full">
              <label className="hud-label-tactical">RECOMPENSA (XP)</label>
              <input
                type="number"
                required={!isLvlUp}
                disabled={isLvlUp}
                value={xpReward}
                onChange={(e) => setXpReward(e.target.value)}
                className="bg-dark-bg/80 border border-white/10 p-3 text-xp hud-value rounded-xl focus:border-xp/50 outline-none transition-all disabled:opacity-20 shadow-inner w-full"
              />
            </div>
            
            <div className="flex items-center h-[60px] px-5 border-l border-white/5">
              <label className="flex items-center cursor-pointer gap-3 group">
                <input
                  type="checkbox"
                  checked={isLvlUp}
                  onChange={(e) => setIsLvlUp(e.target.checked)}
                  className="w-5 h-5 accent-brand cursor-pointer"
                />
                <span className={`hud-title-md transition-all ${isLvlUp ? 'text-brand' : 'text-gray-600 group-hover:text-brand/50'}`}>
                  LVL UP DIRETO
                </span>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end">
            {/* FORM_SUBMISSION_FOOTER */}
            <button
              type="submit"
              className="bg-brand hover:brightness-110 text-dark-bg hud-title-md px-10 py-2.5 rounded-xl shadow-[0_0_15px_rgba(17,194,199,0.3)] transition-all"
            >
              ATUALIZAR MISSÃO
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}