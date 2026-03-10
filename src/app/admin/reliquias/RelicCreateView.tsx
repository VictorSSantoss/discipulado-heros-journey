"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ⚔️ REUSING OUR PROVEN MAPS FOR THE LIVE PREVIEW
const rarityRayMap: Record<string, string> = {
  LEGENDARY: "/images/ray-legendary.png", 
  RARE: "/images/ray-rare.png",           
  COMMON: "/images/ray-common.png",       
};

const rarityColorMap: Record<string, string> = {
  LEGENDARY: "255, 170, 0", 
  RARE: "59, 130, 246", 
  COMMON: "255, 255, 255", 
};

const normalizeRarity = (rarity: string) => {
  const str = (rarity || "").toUpperCase().trim();
  if (str.includes("LEND") || str.includes("LEGEND")) return "LEGENDARY";
  if (str.includes("RAR")) return "RARE";
  return "COMMON";
};

export default function RelicCreateView() {
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "/images/placeholder.png", // Default placeholder
    rarity: "COMMON",
  });

  // --- ALTERNATIVES (UNLOCK PATHS) STATE ---
  const [alternatives, setAlternatives] = useState([
    { id: Date.now(), type: "XP", value: "" }
  ]);

  const handleAddAlternative = () => {
    setAlternatives([...alternatives, { id: Date.now(), type: "XP", value: "" }]);
  };

  const handleRemoveAlternative = (id: number) => {
    setAlternatives(alternatives.filter(alt => alt.id !== id));
  };

  const updateAlternative = (id: number, field: string, value: string) => {
    setAlternatives(alternatives.map(alt => 
      alt.id === id ? { ...alt, [field]: value } : alt
    ));
  };

  const handleSave = async () => {
    // Here you will send formData and alternatives to your API/Server Action
    console.log("Saving Relic:", { ...formData, alternatives });
    alert("Relíquia salva com sucesso! (Ver console)");
  };

  // --- LIVE PREVIEW LOGIC ---
  const normalizedRarity = normalizeRarity(formData.rarity);
  const baseColor = rarityColorMap[normalizedRarity];
  const rayImageSrc = rarityRayMap[normalizedRarity];

  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto flex flex-col text-white pb-20 font-barlow">
      
      {/* HEADER */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
        <div>
          <h1 className="hud-title-lg text-5xl text-white m-0 flex items-center gap-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            FORJA DE RELÍQUIAS
          </h1>
          <p className="hud-label-tactical text-brand mt-2 text-[11px] tracking-[0.3em]">
            SISTEMA DE CRIAÇÃO E REGRAS DE DESBLOQUEIO
          </p>
        </div>
        
        <div className="flex gap-4">
          <Link 
            href="/admin/relics"
            className="hud-label-tactical text-[11px] uppercase tracking-widest px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
          >
            CANCELAR
          </Link>
          <button 
            onClick={handleSave}
            className="bg-brand text-white hud-label-tactical text-[11px] tracking-widest uppercase font-bold px-10 py-3 rounded-lg hover:brightness-125 transition-all shadow-[0_0_20px_rgba(17,194,199,0.4)]"
          >
            SALVAR RELÍQUIA
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* =========================================
            LEFT COLUMN: THE BLUEPRINT (FORM)
        ========================================= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* BASIC INFO */}
          <section className="bg-dark-surface border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
            <h2 className="hud-title-md text-2xl mb-6 text-white border-b border-white/10 pb-4">
              <span className="text-brand mr-2">●</span> Dados do Artefato
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* NAME */}
                <div className="flex flex-col gap-2">
                  <label className="hud-label-tactical text-[10px] text-gray-400 tracking-widest uppercase">Nome da Relíquia</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Coroa dos Caídos"
                    className="bg-black/50 border border-white/10 rounded-lg p-3 text-white font-barlow focus:border-brand focus:outline-none transition-colors"
                  />
                </div>

                {/* RARITY */}
                <div className="flex flex-col gap-2">
                  <label className="hud-label-tactical text-[10px] text-gray-400 tracking-widest uppercase">Raridade</label>
                  <select 
                    value={formData.rarity}
                    onChange={(e) => setFormData({...formData, rarity: e.target.value})}
                    className="bg-black/50 border border-white/10 rounded-lg p-3 text-white font-barlow focus:border-brand focus:outline-none transition-colors appearance-none"
                    style={{ color: `rgb(${baseColor})`, textShadow: `0 0 10px rgba(${baseColor}, 0.5)` }}
                  >
                    <option value="COMMON" className="text-white">COMUM</option>
                    <option value="RARE" className="text-blue-400">RARA</option>
                    <option value="LEGENDARY" className="text-orange-400">LENDÁRIA</option>
                  </select>
                </div>
              </div>

              {/* ICON URL */}
              <div className="flex flex-col gap-2">
                <label className="hud-label-tactical text-[10px] text-gray-400 tracking-widest uppercase">URL do Ícone (PNG com fundo transparente)</label>
                <input 
                  type="text" 
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="/images/relics/my-relic.png"
                  className="bg-black/50 border border-white/10 rounded-lg p-3 text-white font-barlow focus:border-brand focus:outline-none transition-colors"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="flex flex-col gap-2">
                <label className="hud-label-tactical text-[10px] text-gray-400 tracking-widest uppercase">Descrição Criptografada</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="A história ou significado desta relíquia..."
                  className="bg-black/50 border border-white/10 rounded-lg p-3 text-white font-barlow focus:border-brand focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </section>

          {/* UNLOCK ALTERNATIVES */}
          <section className="bg-dark-surface border border-brand/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[100px] pointer-events-none rounded-full" />
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6 relative z-10">
              <h2 className="hud-title-md text-2xl text-white">
                <span className="text-brand mr-2">●</span> Rotas de Desbloqueio
              </h2>
              <button 
                onClick={handleAddAlternative}
                className="bg-brand/10 border border-brand/30 text-brand hud-label-tactical text-[9px] uppercase tracking-widest px-4 py-2 rounded hover:bg-brand hover:text-white transition-all"
              >
                + ADICIONAR ROTA
              </button>
            </div>

            <p className="font-barlow text-sm text-gray-400 mb-6">
              O jogador receberá esta relíquia se cumprir <strong className="text-white">QUALQUER UMA</strong> das rotas (alternativas) abaixo.
            </p>

            <div className="space-y-4 relative z-10">
              {alternatives.map((alt, index) => (
                <div key={alt.id} className="flex flex-col sm:flex-row gap-4 bg-black/40 border border-white/5 p-4 rounded-xl items-center relative group">
                  
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand/50 rounded-r-full" />

                  <span className="hud-label-tactical text-gray-500 text-[10px] tracking-widest w-full sm:w-auto">
                    ROTA 0{index + 1}
                  </span>

                  <select 
                    value={alt.type}
                    onChange={(e) => updateAlternative(alt.id, "type", e.target.value)}
                    className="bg-dark-bg border border-white/10 rounded-lg p-3 text-white font-barlow focus:border-brand focus:outline-none w-full sm:w-1/3 text-sm"
                  >
                    <option value="XP">Total de XP Atingido</option>
                    <option value="MISSION">Completar Missão Específica</option>
                    <option value="ATTRIBUTE">Atributo Atingido (Ex: Força 50)</option>
                    <option value="MANUAL">Concessão Manual (Admin)</option>
                  </select>

                  <input 
                    type="text" 
                    value={alt.value}
                    onChange={(e) => updateAlternative(alt.id, "value", e.target.value)}
                    placeholder={alt.type === "XP" ? "Ex: 5000" : alt.type === "MISSION" ? "ID da Missão" : "Valor/Requisito"}
                    className="bg-dark-bg border border-white/10 rounded-lg p-3 text-white font-barlow focus:border-brand focus:outline-none w-full sm:flex-1 text-sm"
                    disabled={alt.type === "MANUAL"}
                  />

                  {alternatives.length > 1 && (
                    <button 
                      onClick={() => handleRemoveAlternative(alt.id)}
                      className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      title="Remover Rota"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* =========================================
            RIGHT COLUMN: LIVE PREVIEW
        ========================================= */}
        <div className="lg:col-span-4">
          <div className="sticky top-8">
            <h3 className="hud-label-tactical text-[10px] text-gray-400 tracking-widest uppercase mb-4 pl-2 border-l-2 border-brand">
              Pré-visualização (Codex)
            </h3>
            
            <div className="bg-black/80 border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
              
              {/* BF1 Ray Container - Exact match to Codex UI */}
              <div className="w-full aspect-square relative flex items-center justify-center pointer-events-none mb-6">
                
                {/* Ray Image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
                   <img 
                     src={rayImageSrc}
                     alt=""
                     className="w-full h-full object-contain mix-blend-screen scale-[1.8] opacity-80 group-hover:opacity-100 group-hover:scale-[2.0] transition-all duration-700"
                     onError={(e) => e.currentTarget.style.display = 'none'}
                   />
                </div>
                
                {/* Icon Image */}
                <div className="relative w-[70%] h-[70%] z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                  <Image 
                    src={formData.icon || "/images/placeholder.png"} 
                    alt="Preview" 
                    fill 
                    className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)]" 
                  />
                </div>
              </div>

              {/* Text Preview */}
              <div className="flex flex-col items-center text-center relative z-10">
                
                {/* Dynamic Rarity Tag */}
                <div 
                  className="relative overflow-hidden flex items-center justify-center px-4 py-1.5 rounded-md backdrop-blur-md mb-4"
                  style={{
                    color: '#ffffff',
                    textShadow: `0 0 8px rgb(${baseColor}), 0 0 15px rgb(${baseColor})`,
                    border: `1px solid rgba(${baseColor}, 0.8)`,
                    background: `linear-gradient(135deg, rgba(${baseColor}, 0.4) 0%, rgba(${baseColor}, 0.1) 100%)`,
                    boxShadow: `0 0 20px rgba(${baseColor}, 0.4), inset 0 0 15px rgba(${baseColor}, 0.3)`
                  }}
                >
                  <div 
                    className="absolute top-0 left-0 w-full h-[2px] opacity-100"
                    style={{ background: `linear-gradient(90deg, transparent, rgb(${baseColor}), transparent)` }}
                  />
                  <span className="hud-label-tactical text-[10px] tracking-widest uppercase relative z-10 font-bold">
                    {formData.rarity === "LEGENDARY" ? "LENDÁRIA" : formData.rarity === "RARE" ? "RARA" : "COMUM"}
                  </span>
                </div>

                <h3 className="hud-title-md text-white text-2xl mb-2">
                  {formData.name || "NOME DA RELÍQUIA"}
                </h3>
                
                <p className="font-barlow text-sm text-gray-400 leading-relaxed line-clamp-3">
                  {formData.description || "A descrição da relíquia aparecerá aqui. Os jogadores poderão ler a lore e os feitos necessários para conquistá-la."}
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}