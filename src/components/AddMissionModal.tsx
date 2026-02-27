"use client"; // Required for using interactive state (useState)

import { useState, useEffect } from "react";
import { Mission } from "@/types";

interface AddMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMission: (newMission: Mission) => void;
  defaultCategory?: Mission["category"];
}

const CATEGORIES: Mission["category"][] = [
  "Hábitos Espirituais",
  "Evangelismo e Liderança",
  "Conhecimento",
  "Estrutura e Participação",
  "Eventos e Especiais",
];

export default function AddMissionModal({ isOpen, onClose, onAddMission, defaultCategory }: AddMissionModalProps) {
  // "Memory slots" for what the Admin types
  const [title, setTitle] = useState("");
  const [xpReward, setXpReward] = useState("");
  const [isLvlUp, setIsLvlUp] = useState(false);
  const [category, setCategory] = useState<Mission["category"]>("Hábitos Espirituais");

  // When modal opens, set the dropdown to the category they clicked from
  useEffect(() => {
    if (defaultCategory) setCategory(defaultCategory);
  }, [defaultCategory, isOpen]);

  // If the modal is told to be closed, don't render anything
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from reloading

    // 1. Create the new mission using the blueprint
    const newMission: Mission = {
      id: `m-${Date.now()}`, // Creates a random unique ID
      title: title.toUpperCase(),
      xpReward: isLvlUp ? "LVL UP DIRETO" : Number(xpReward),
      category: category,
    };

    // 2. Send it back to the main page to be saved
    onAddMission(newMission);

    // 3. Clear the form and close the modal
    setTitle("");
    setXpReward("");
    setIsLvlUp(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      {/* The Modal Box */}
      <div className="bg-[#1a1c19] border border-gray-700 rounded-sm w-full max-w-md shadow-2xl">
        
        {/* Header */}
        <div className="bg-[#ea580c] py-3 px-4 text-center">
          <h2 className="font-bebas text-3xl tracking-widest text-white uppercase m-0">
            NOVA MISSÃO
          </h2>
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title Input */}
          <div>
            <label className="block font-barlow text-gray-400 text-sm font-bold mb-2 uppercase">Nome da Missão</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#2a2c29] text-white border border-gray-600 rounded p-2 font-barlow outline-none focus:border-[#ea580c]"
              placeholder="Ex: LER UM CAPÍTULO"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block font-barlow text-gray-400 text-sm font-bold mb-2 uppercase">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Mission["category"])}
              className="w-full bg-[#2a2c29] text-white border border-gray-600 rounded p-2 font-barlow outline-none focus:border-[#ea580c]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* XP Input & LVL UP Toggle */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block font-barlow text-gray-400 text-sm font-bold mb-2 uppercase">Recompensa (XP)</label>
              <input
                type="number"
                required={!isLvlUp}
                disabled={isLvlUp}
                value={xpReward}
                onChange={(e) => setXpReward(e.target.value)}
                className="w-full bg-[#2a2c29] text-white border border-gray-600 rounded p-2 font-barlow outline-none focus:border-[#ea580c] disabled:opacity-50"
                placeholder="Ex: 100"
              />
            </div>
            
            <div className="flex items-center h-[42px] px-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLvlUp}
                  onChange={(e) => setIsLvlUp(e.target.checked)}
                  className="mr-2 w-5 h-5 accent-[#ea580c]"
                />
                <span className="font-bebas text-xl text-red-400 tracking-wider">LVL UP DIRETO</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 font-barlow font-bold hover:text-white transition-colors"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-barlow font-bold rounded-sm transition-colors"
            >
              ADICIONAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}