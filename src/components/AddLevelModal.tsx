"use client";

import { useState } from "react";

interface Patente {
  id: string;
  level: number;
  title: string;
  xpRequired: number;
  tierColor: string;
  iconUrl: string;
}

interface AddLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newPatente: Patente) => void;
  nextLevel: number;
}

/**
 * AddLevelModal Component
 * Facilitates the creation of a new rank at the end of the existing hierarchy.
 * Automatically increments the level number based on the current system count.
 */
export default function AddLevelModal({ isOpen, onClose, onAdd, nextLevel }: AddLevelModalProps) {
  const [title, setTitle] = useState("");
  const [xpRequired, setXpRequired] = useState("");
  const [tierColor, setTierColor] = useState("#94a3b8");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  /* Sends a POST request to the API to persist the new rank */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      level: nextLevel,
      title,
      xpRequired: Number(xpRequired),
      tierColor,
      iconUrl: `/images/ranks/level-${nextLevel}.svg`
    };

    try {
      const response = await fetch('/api/patentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const created = await response.json();
        onAdd(created);
        setTitle("");
        setXpRequired("");
      }
    } catch (error) {
      console.error("Creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in font-barlow">
      <div className="bg-dark-bg border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
        
        <div className="p-6 border-b border-white/5 bg-dark-bg/80 flex justify-between items-center">
          <div>
            <h2 className="hud-title-md text-brand m-0">FORJAR NOVA PATENTE</h2>
            <p className="hud-label-tactical mt-2 text-gray-500 italic-none">PRÓXIMO NÍVEL: {nextLevel}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="hud-label-tactical text-gray-400">Designação da Patente</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-dark-bg/60 border border-white/10 p-3 rounded-xl text-white hud-title-md outline-none focus:border-brand/30"
              placeholder="EX: GUARDIÃO SUPREMO"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="hud-label-tactical text-gray-400">XP de Requisito</label>
              <input 
                type="number" 
                value={xpRequired}
                onChange={(e) => setXpRequired(e.target.value)}
                className="w-full bg-dark-bg/60 border border-white/10 p-3 rounded-xl text-xp hud-value text-xl outline-none focus:border-xp/30"
                placeholder="50000"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="hud-label-tactical text-gray-400">Cor do Tier</label>
              <input 
                type="color" 
                value={tierColor}
                onChange={(e) => setTierColor(e.target.value)}
                className="w-full h-12 bg-dark-bg/60 border border-white/10 rounded-xl cursor-pointer p-1"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="hud-label-tactical text-gray-500 hover:text-white px-4">CANCELAR</button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-brand text-dark-bg hud-title-md rounded-xl hover:brightness-110 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? "FORJANDO..." : "CRIAR NÍVEL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}