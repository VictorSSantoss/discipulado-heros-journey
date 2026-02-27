"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovaMissaoPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Hábitos Espirituais");
  const [xpReward, setXpReward] = useState<number | string>(100);
  const [description, setDescription] = useState("");

  const categories = [
    "Hábitos Espirituais", 
    "Evangelismo e Liderança", 
    "Conhecimento", 
    "Estrutura e Participação", 
    "Eventos e Especiais"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save the mission to your list will go here later!
    alert(`Nova Missão: "${title}" forjada com sucesso!`);
    router.push('/admin/missoes');
  };

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      
      {/* Header Bar */}
      <header className="w-full bg-[#232622] border border-gray-700 p-4 mb-8 rounded-sm flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/admin/missoes" className="text-gray-400 hover:text-white font-barlow font-bold uppercase tracking-widest text-sm">
            ← Cancelar
          </Link>
          <div className="h-6 w-px bg-gray-700"></div>
          <span className="font-bebas text-2xl text-[#ea580c] tracking-widest uppercase">
            Forjar Nova Missão
          </span>
        </div>
        <button 
          onClick={handleSubmit}
          className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-barlow font-bold px-8 py-2 rounded-sm tracking-widest uppercase transition-all text-sm shadow-lg"
        >
          Publicar Missão
        </button>
      </header>

      <form onSubmit={handleSubmit} className="bg-[#1a1c19] border border-gray-800 p-8 rounded-sm shadow-2xl space-y-8">
        
        {/* Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <label className="font-barlow text-gray-500 font-bold uppercase text-xs mb-2">Título da Quest</label>
            <input 
              required
              type="text" 
              placeholder="Ex: Ler o Livro de Neemias"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#2a2c29] border border-gray-700 p-4 rounded-sm text-white font-barlow outline-none focus:border-[#ea580c] text-lg"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-barlow text-gray-500 font-bold uppercase text-xs mb-2">Categoria</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#2a2c29] border border-gray-700 p-4 rounded-sm text-white font-barlow outline-none focus:border-[#ea580c] h-[60px]"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        {/* XP Reward */}
        <div className="flex flex-col max-w-xs">
          <label className="font-barlow text-gray-500 font-bold uppercase text-xs mb-2">Recompensa de Experiência</label>
          <div className="flex gap-4 items-center">
            <input 
              type="number" 
              value={xpReward === 'LVL UP DIRETO' ? '' : xpReward}
              onChange={(e) => setXpReward(parseInt(e.target.value))}
              disabled={xpReward === 'LVL UP DIRETO'}
              className="bg-[#2a2c29] border border-gray-700 p-4 rounded-sm text-white font-barlow outline-none focus:border-[#ea580c] w-32 disabled:opacity-30"
            />
            <span className="font-bebas text-2xl text-blue-400">XP</span>
            <div className="h-8 w-px bg-gray-700 mx-2"></div>
            <button 
              type="button"
              onClick={() => setXpReward(xpReward === 'LVL UP DIRETO' ? 100 : 'LVL UP DIRETO')}
              className={`px-4 py-2 border rounded-sm font-barlow font-bold text-[10px] uppercase tracking-widest transition-all ${
                xpReward === 'LVL UP DIRETO' ? 'bg-red-500 border-red-500 text-white' : 'border-gray-600 text-gray-500 hover:border-red-500'
              }`}
            >
              Lvl Up Direto
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="font-barlow text-gray-500 font-bold uppercase text-xs mb-2">Instruções para o Valente</label>
          <textarea 
            rows={4}
            placeholder="Descreva o que o herói precisa fazer para completar esta missão..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-[#2a2c29] border border-gray-700 p-4 rounded-sm text-white font-barlow outline-none focus:border-[#ea580c] resize-none"
          />
        </div>

      </form>
    </main>
  );
}