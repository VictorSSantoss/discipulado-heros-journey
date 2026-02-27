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

export default function EditLevelModal({ isOpen, onClose, onSave, level }: EditLevelModalProps) {
  const [name, setName] = useState("");
  const [minXP, setMinXP] = useState(0);
  const [icon, setIcon] = useState("");

  // When the modal opens, fill the inputs with the selected level's current data
  useEffect(() => {
    if (level) {
      setName(level.name);
      setMinXP(level.minXP);
      setIcon(level.icon);
    }
  }, [level, isOpen]);

  if (!isOpen || !level) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...level, name, minXP, icon });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#1a1c19] border border-gray-700 rounded-sm w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-[#232622] flex justify-between items-center">
          <div>
            <h2 className="font-bebas text-3xl text-white tracking-widest leading-none">EDITAR PATENTE</h2>
            <p className="font-barlow text-[#ea580c] font-bold text-xs uppercase tracking-widest mt-1">
              Ajuste de Balanceamento
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-[#ea580c] transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Level Name */}
          <div className="flex flex-col gap-2">
            <label className="font-barlow text-gray-400 font-bold uppercase tracking-widest text-xs">
              Nome da Patente
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#232622] border border-gray-700 p-3 rounded-sm text-white font-bebas text-xl outline-none focus:border-[#ea580c] transition-colors"
              required
            />
          </div>

          {/* Target XP */}
          <div className="flex flex-col gap-2">
            <label className="font-barlow text-gray-400 font-bold uppercase tracking-widest text-xs">
              Meta de XP (Para alcançar este nível)
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                min="0"
                value={minXP}
                onChange={(e) => setMinXP(Number(e.target.value))}
                className="w-full bg-[#232622] border border-gray-700 p-3 rounded-sm text-[#ea580c] font-staatliches text-2xl outline-none focus:border-[#ea580c] transition-colors"
                required
              />
              <span className="font-barlow text-gray-500 font-bold tracking-widest">XP</span>
            </div>
          </div>

          {/* SVG Icon Path */}
          <div className="flex flex-col gap-2">
            <label className="font-barlow text-gray-400 font-bold uppercase tracking-widest text-xs">
              Caminho do Ícone (SVG)
            </label>
            <input 
              type="text" 
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-[#232622] border border-gray-700 p-3 rounded-sm text-gray-300 font-barlow text-sm outline-none focus:border-cyan-400 transition-colors"
              placeholder="/images/level-1.svg"
              required
            />
            <p className="text-[10px] text-gray-500 font-barlow uppercase tracking-wider mt-1">
              O arquivo deve estar na pasta public/images/
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors font-barlow font-bold uppercase text-xs tracking-widest px-4"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-barlow font-bold rounded-sm uppercase text-xs tracking-widest transition-colors shadow-lg"
            >
              Salvar Patente
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}