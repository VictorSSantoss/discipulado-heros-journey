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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#1a1c19] border border-gray-700 rounded-sm w-full max-w-md shadow-2xl overflow-hidden">
        
        <div className="p-6 border-b border-gray-800 bg-[#232622] flex justify-between items-center">
          <div>
            <h2 className="font-bebas text-3xl text-white tracking-widest leading-none text-cyan-400 uppercase">Forjar Patente</h2>
            <p className="font-barlow text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Nova Etapa da Jornada</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="font-barlow text-gray-400 font-bold uppercase tracking-widest text-xs">Nome da Patente</label>
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#232622] border border-gray-700 p-3 rounded-sm text-white font-bebas text-xl outline-none focus:border-cyan-400 transition-colors"
              placeholder="EX: LENDÁRIO" required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-barlow text-gray-400 font-bold uppercase tracking-widest text-xs">Meta de XP</label>
            <input 
              type="number" value={minXP} onChange={(e) => setMinXP(e.target.value)}
              className="w-full bg-[#232622] border border-gray-700 p-3 rounded-sm text-[#ea580c] font-staatliches text-2xl outline-none focus:border-[#ea580c] transition-colors"
              placeholder="10000" required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-barlow text-gray-400 font-bold uppercase tracking-widest text-xs">Caminho do Ícone (SVG)</label>
            <input 
              type="text" value={icon} onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-[#232622] border border-gray-700 p-3 rounded-sm text-gray-400 font-barlow text-sm outline-none focus:border-cyan-400 transition-colors"
              required
            />
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-white font-barlow font-bold uppercase text-xs tracking-widest px-4">Cancelar</button>
            <button type="submit" className="px-8 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-barlow font-bold rounded-sm uppercase text-xs tracking-widest transition-colors shadow-lg">Adicionar ao Reino</button>
          </div>
        </form>
      </div>
    </div>
  );
}