"use client";

import { useState, useEffect } from "react";

interface Level {
  id: number;
  name: string;
  minXP: number;
  icon: string;
}

interface EditLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedLevel: Level) => void;
  level: Level | null;
}

/**
 * EditLevelModal Component
 * Facilitates the adjustment of existing rank parameters in the hierarchy.
 * Integrated with the centralized HUD Typography System for design consistency.
 */
export default function EditLevelModal({ isOpen, onClose, onSave, level }: EditLevelModalProps) {
  const [name, setName] = useState("");
  const [minXP, setMinXP] = useState(0);
  const [icon, setIcon] = useState("");

  /**
   * DATA SYNCHRONIZATION HOOK
   * Populates input states with current level data whenever the modal is activated.
   */
  useEffect(() => {
    if (level) {
      setName(level.name);
      setMinXP(level.minXP);
      setIcon(level.icon);
    }
  }, [level, isOpen]);

  if (!isOpen || !level) return null;

  /**
   * SUBMISSION HANDLER
   * Packages the updated state into the parent save logic.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...level, name, minXP, icon });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* CONTAINER 1: MODAL_OVERLAY_WRAPPER */}

      <div className="bg-dark-bg border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        {/* CONTAINER 2: MODAL_TERMINAL_CARD */}
        
        {/* Visual highlight line for HUD depth */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-xp/40 to-transparent"></div>

        <div className="p-6 border-b border-white/5 bg-dark-bg/80 flex justify-between items-center">
          {/* CONTAINER 3: TACTICAL_HEADER_SECTION */}
          <div>
            <h2 className="hud-title-md text-white m-0">EDITAR PATENTE</h2>
            <p className="hud-label-tactical text-xp mt-2 italic-none">
              Ajuste de Balanceamento
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-xp transition-colors text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* CONTAINER 4: REFORGE_FORM_WRAPPER */}

          <div className="flex flex-col gap-2">
            {/* CONTAINER 5: IDENTITY_INPUT_BLOCK */}
            <label className="hud-label-tactical">
              Nome da Patente
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-bg/60 border border-white/10 p-3.5 rounded-xl text-white hud-title-md outline-none focus:border-brand/50 transition-all shadow-inner"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            {/* CONTAINER 6: PERFORMANCE_METRIC_BLOCK */}
            <label className="hud-label-tactical">
              Meta de XP (Requisito de Ascensão)
            </label>
            <div className="flex items-center gap-3 bg-dark-bg/60 p-1.5 rounded-xl border border-white/5 shadow-inner">
              <input 
                type="number" 
                min="0"
                value={minXP}
                onChange={(e) => setMinXP(Number(e.target.value))}
                className="w-full bg-transparent p-2 text-xp hud-value text-3xl outline-none focus:text-brand transition-colors"
                required
              />
              <span className="hud-title-md text-sm text-xp/50 pr-4 mt-1">XP</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* CONTAINER 7: ASSET_DIRECTORY_BLOCK */}
            <label className="hud-label-tactical">
              Caminho do Ícone (SVG)
            </label>
            <input 
              type="text" 
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-dark-bg/60 border border-white/10 p-3.5 rounded-xl text-gray-400 font-barlow text-[11px] font-bold outline-none focus:border-brand/50 transition-all shadow-inner"
              placeholder="/images/level-1.svg"
              required
            />
            <p className="text-[9px] text-gray-600 hud-label-tactical mt-1 pl-1 italic-none">
              Diretório local: public/images/
            </p>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
            {/* CONTAINER 8: ACTION_CONTROL_WRAPPER */}
            <button 
              type="button" 
              onClick={onClose} 
              className="text-gray-500 hover:text-white transition-colors hud-label-tactical px-4 italic-none"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 bg-xp hover:brightness-110 text-dark-bg hud-title-md rounded-xl transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)]"
            >
              Salvar Patente
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}