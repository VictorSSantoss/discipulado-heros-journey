"use client";

import { useState, useEffect } from "react";

interface Patente {
  id: string;
  level: number;
  title: string;
  xpRequired: number;
  tierColor: string;
  iconUrl: string;
}

interface EditLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Patente) => void;
  patente: Patente | null;
}

export default function EditLevelModal({ isOpen, onClose, onSave, patente }: EditLevelModalProps) {
  const [title, setTitle] = useState("");
  const [xpRequired, setXpRequired] = useState(0);
  const [tierColor, setTierColor] = useState("#94a3b8");
  const [iconUrl, setIconUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Updates the local state fields when the patente prop changes or the modal opens */
  useEffect(() => {
    if (patente) {
      setTitle(patente.title || "");
      setXpRequired(patente.xpRequired || 0);
      setTierColor(patente.tierColor || "#94a3b8");
      setIconUrl(patente.iconUrl || "");
    }
  }, [patente, isOpen]);

  if (!isOpen || !patente) return null;

  /* Verifies the existence of the ID and performs the PUT request to update rank data */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patente.id) {
      console.error("Missing rank ID for update operation");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/patentes/${patente.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          xpRequired, 
          tierColor, 
          iconUrl 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const updated = await response.json();
      onSave(updated);
    } catch (error) {
      console.error("The update request failed to process:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-barlow">
      <div className="bg-dark-bg border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        
        {/* Generates a visual border using the current tier color state */}
        <div 
          className="absolute top-0 left-0 w-full h-1" 
          style={{ backgroundColor: tierColor }}
        ></div>

        <div className="p-6 border-b border-white/5 bg-dark-bg/80 flex justify-between items-center">
          <div>
            <h2 className="hud-title-md text-white m-0 uppercase tracking-wider">Reforjar Patente</h2>
            <p className="hud-label-tactical mt-2" style={{ color: tierColor }}>
              Nível de Hierarquia: {patente.level}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="hud-label-tactical text-gray-400">Título da Patente</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-dark-bg/60 border border-white/10 p-3 rounded-xl text-white hud-title-md outline-none focus:border-white/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="hud-label-tactical text-gray-400">Cor do Tier (HEX)</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={tierColor}
                  onChange={(e) => setTierColor(e.target.value)}
                  className="w-10 h-10 bg-transparent border-none cursor-pointer"
                />
                <input 
                  type="text" 
                  value={tierColor}
                  onChange={(e) => setTierColor(e.target.value)}
                  className="w-full bg-dark-bg/60 border border-white/10 p-2 rounded-xl text-white text-xs outline-none"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="hud-label-tactical text-gray-400">Requisito XP</label>
              <input 
                type="number" 
                value={xpRequired}
                onChange={(e) => setXpRequired(Number(e.target.value))}
                className="w-full bg-dark-bg/60 border border-white/10 p-2 rounded-xl text-xp hud-value text-xl outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="hud-label-tactical text-gray-400">URL do Ícone</label>
            <input 
              type="text" 
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              className="w-full bg-dark-bg/60 border border-white/10 p-3 rounded-xl text-gray-500 text-[10px] outline-none"
              required
            />
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="hud-label-tactical text-gray-500 hover:text-white px-4">Voltar</button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-white text-dark-bg hud-title-md rounded-xl hover:brightness-110 disabled:opacity-50 transition-all shadow-lg"
              style={{ backgroundColor: tierColor }}
            >
              {isSubmitting ? "Processando..." : "Confirmar Mudanças"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}