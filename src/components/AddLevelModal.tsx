"use client";

import { useState } from "react";

interface Level {
  id: number;
  name: string;
  minXP: number;
  icon: string;
}

interface AddLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newLevel: Level) => void;
}

/**
 * AddLevelModal Component
 * Facilitates the creation of new progression ranks within the kingdom hierarchy.
 * Integrated with the centralized HUD Typography System for consistent UI scaling.
 */
export default function AddLevelModal({ isOpen, onClose, onAdd }: AddLevelModalProps) {
  const [name, setName] = useState("");
  const [minXP, setMinXP] = useState("");
  const [icon, setIcon] = useState("/images/level-new.svg");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLevel: Level = {
      id: Date.now(),
      name,
      minXP: Number(minXP),
      icon
    };
    onAdd(newLevel);
    setName("");
    setMinXP("");
    setIcon("/images/level-new.svg");
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* CONTAINER 1: MODAL_OVERLAY_WRAPPER */}
      
      <div className="bg-dark-bg border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        {/* CONTAINER 2: MODAL_CARD_TERMINAL */}
        
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"></div>
        
        <div className="p-6 border-b border-white/5 bg-dark-bg/80 flex justify-between items-center">
          {/* CONTAINER 3: HEADER_SECTION */}
          <div>
            <h2 className="hud-title-md text-brand m-0">Forjar Patente</h2>
            <p className="hud-label-tactical mt-2 italic-none">Nova Etapa da Jornada</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* CONTAINER 4: FORM_INPUT_WRAPPER */}

          <div className="flex flex-col gap-2">
            {/* CONTAINER 5: IDENTITY_INPUT_FIELD */}
            <label className="hud-label-tactical">Nome da Patente</label>
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-bg/60 border border-white/10 p-3.5 rounded-xl text-white hud-title-md outline-none focus:border-brand/50 transition-all shadow-inner"
              placeholder="EX: LENDÁRIO" required
            />
          </div>

          <div className="flex flex-col gap-2">
            {/* CONTAINER 6: XP_REQUIREMENT_INPUT_FIELD */}
            <label className="hud-label-tactical">Meta de Experiência (XP)</label>
            <input 
              type="number" value={minXP} onChange={(e) => setMinXP(e.target.value)}
              className="w-full bg-dark-bg/60 border border-white/10 p-3.5 rounded-xl text-xp hud-value text-3xl outline-none focus:border-xp/50 transition-all shadow-inner"
              placeholder="10000" required
            />
          </div>

          <div className="flex flex-col gap-2">
            {/* CONTAINER 7: ICON_PATH_INPUT_FIELD */}
            <label className="hud-label-tactical">Diretório do Ícone (SVG)</label>
            <input 
              type="text" value={icon} onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-dark-bg/60 border border-white/10 p-3.5 rounded-xl text-gray-400 font-barlow text-[11px] font-bold outline-none focus:border-brand/50 transition-all shadow-inner"
              required
            />
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
            {/* CONTAINER 8: ACTION_BUTTONS_WRAPPER */}
            <button 
              type="button" 
              onClick={onClose} 
              className="hud-label-tactical text-gray-500 hover:text-white px-4 transition-colors italic-none"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-8 py-2.5 bg-brand hover:brightness-110 text-dark-bg hud-title-md text-xl rounded-xl transition-all shadow-[0_0_15px_rgba(17,194,199,0.3)]"
            >
              Forjar Nível
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}