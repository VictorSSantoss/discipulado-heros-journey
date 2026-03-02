"use client";

import { useState, useEffect } from "react";
import { Mission } from "@/types";

/* GLOBAL CONFIGURATION IMPORTS */
/* Synchronizes the mission categories with the central game settings. */
import { MISSION_CATEGORIES } from "@/constants/gameConfig";

interface AddMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMission: (newMission: Mission) => void;
  defaultCategory?: Mission["category"];
}

/**
 * AddMissionModal Component
 * Facilitates the quick creation of mission decrees via an overlay interface.
 * Utilizes the centralized HUD Typography System for consistent UI scaling.
 */
export default function AddMissionModal({ isOpen, onClose, onAddMission, defaultCategory }: AddMissionModalProps) {
  /* FORM STATE MANAGEMENT */
  const [title, setTitle] = useState("");
  const [xpReward, setXpReward] = useState("");
  const [isLvlUp, setIsLvlUp] = useState(false);
  
  /* CATEGORY INITIALIZATION */
  const [category, setCategory] = useState<Mission["category"]>(MISSION_CATEGORIES[0] as Mission["category"]);

  useEffect(() => {
    if (defaultCategory) setCategory(defaultCategory);
  }, [defaultCategory, isOpen]);

  if (!isOpen) return null;

  /**
   * FORM SUBMISSION HANDLER
   * Forges the new mission object and sends it to the parent state.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMission: Mission = {
      id: `m-${Date.now()}`,
      title: title.toUpperCase(),
      xpReward: isLvlUp ? "LVL UP DIRETO" : Number(xpReward),
      category: category,
    };

    onAddMission(newMission);

    /* FORM RESET */
    setTitle("");
    setXpReward("");
    setIsLvlUp(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      {/* CONTAINER 1: MODAL_OVERLAY_WRAPPER */}
      
      <div className="bg-dark-bg border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        {/* CONTAINER 2: MODAL_CARD_TERMINAL */}
        
        <div className="bg-xp py-3 px-4 text-center relative overflow-hidden">
          {/* CONTAINER 3: MODAL_HEADER_STRIP */}
          <h2 className="hud-title-md text-white m-0">
            NOVA MISSÃO
          </h2>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* CONTAINER 4: FORM_INPUT_BODY */}
          
          <div className="flex flex-col gap-2">
            {/* CONTAINER 5: TITLE_INPUT_FIELD */}
            <label className="hud-label-tactical">NOME DA MISSÃO</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-dark-bg/60 border border-white/10 p-3.5 rounded-xl text-white hud-title-md outline-none focus:border-xp/50 transition-all shadow-inner"
              placeholder="EX: LER UM CAPÍTULO"
            />
          </div>

          <div className="flex flex-col gap-2">
            {/* CONTAINER 6: CATEGORY_SELECT_FIELD */}
            <label className="hud-label-tactical">CATEGORIA</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Mission["category"])}
              className="w-full bg-dark-bg/60 border border-white/10 p-3.5 rounded-xl text-white font-barlow font-bold uppercase tracking-widest text-xs outline-none focus:border-xp/50 transition-all cursor-pointer shadow-inner appearance-none"
            >
              {MISSION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-dark-bg">{cat.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 items-end">
            {/* CONTAINER 7: REWARD_CONFIGURATION_BLOCK */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="hud-label-tactical">RECOMPENSA (XP)</label>
              <input
                type="number"
                required={!isLvlUp}
                disabled={isLvlUp}
                value={xpReward}
                onChange={(e) => setXpReward(e.target.value)}
                className="w-full bg-dark-bg/60 border border-white/10 p-3.5 rounded-xl text-xp hud-value text-3xl outline-none focus:border-xp/50 transition-all shadow-inner disabled:opacity-20"
                placeholder="0"
              />
            </div>
            
            <div className="flex items-center h-[56px] px-3 border-l border-white/5">
              {/* CONTAINER 8: LVL_UP_TOGGLE_WRAPPER */}
              <label className="flex items-center cursor-pointer group gap-2">
                <input
                  type="checkbox"
                  checked={isLvlUp}
                  onChange={(e) => setIsLvlUp(e.target.checked)}
                  className="w-5 h-5 accent-xp"
                />
                <span className={`hud-title-md text-sm transition-colors ${isLvlUp ? 'text-xp' : 'text-gray-600 group-hover:text-xp/50'}`}>
                  LVL UP
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-white/5 mt-4">
            {/* CONTAINER 9: MODAL_ACTION_CONTROLS */}
            <button
              type="button"
              onClick={onClose}
              className="hud-label-tactical text-gray-500 hover:text-white px-4 transition-colors italic-none"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-xp hover:brightness-110 text-white hud-title-md rounded-xl transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)]"
            >
              ADICIONAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}