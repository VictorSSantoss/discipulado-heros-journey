"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ICONS } from "@/constants/gameConfig";

const GAME_ATTRIBUTES = [
  { label: "FORÇA", value: "FOR" },
  { label: "AGILIDADE", value: "AGI" },
  { label: "VITALIDADE", value: "VIT" },
  { label: "INTELIGÊNCIA", value: "INT" },
  { label: "DESTREZA", value: "DES" }
];

const MISSION_CATEGORIES = [
  "TODAS", 
  "Hábitos Espirituais", 
  "Evangelismo e Liderança", 
  "Conhecimento", 
  "Estrutura e Participação", 
  "Eventos e Especiais"
];

// --- REUSED HUD SELECT ---
function HUDSelect({ label, options, value, onChange, className = "", textStyle = {} }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as any)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt: any) => opt.value === value);

  return (
    <div className={`flex flex-col gap-2 relative ${className}`} ref={containerRef}>
      {label && <label className="hud-label-tactical text-[10px] text-gray-400 uppercase tracking-widest font-normal">{label}</label>}
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white font-barlow text-left flex justify-between items-center hover:border-brand/40 transition-all min-h-[50px]">
        <span style={textStyle} className="uppercase tracking-widest text-sm truncate">{selected?.label || "Selecionar..."}</span>
        <span className={`text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="absolute top-[105%] left-0 w-full z-[100] bg-dark-surface/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-1 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt: any) => (
              <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setIsOpen(false); }} className={`w-full text-left px-4 py-3 text-xs font-barlow uppercase transition-colors rounded-lg ${value === opt.value ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-gray-300'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const rarityRayMap: Record<string, string> = { LEGENDARY: "/images/ray-legendary.png", RARE: "/images/ray-rare.png", COMMON: "/images/ray-common.png" };
const rarityColorMap: Record<string, string> = { LEGENDARY: "255, 170, 0", RARE: "59, 130, 246", COMMON: "255, 255, 255" };

export default function RelicForm({ initialData, missions, onSave, onDelete, isEdit = false }: any) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [activeAltId, setActiveAltId] = useState<number | null>(null);
  const [missionSearch, setMissionSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("TODAS");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    icon: initialData?.icon || "/images/placeholder-relic.svg",
    rarity: initialData?.rarity || "COMMON",
  });

  const [alternatives, setAlternatives] = useState(
    initialData?.alternatives || [{ id: Date.now(), type: "XP", value: "", attr: "FOR" }]
  );

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedFile(file); setFormData({ ...formData, icon: URL.createObjectURL(file) }); }
  };

  const updateAlt = (id: number, fields: any) => {
    setAlternatives(alternatives.map((a: any) => a.id === id ? { ...a, ...fields } : a));
  };

  const handleSelectMission = (missionId: string) => {
    if (activeAltId) updateAlt(activeAltId, { value: missionId });
    setIsMissionModalOpen(false);
    setMissionSearch("");
  };

  const filteredMissions = missions.filter((m: any) => {
    const matchesSearch = m.title.toLowerCase().includes(missionSearch.toLowerCase());
    const matchesCategory = activeCategory === "TODAS" || m.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const baseColor = rarityColorMap[formData.rarity] || "255, 255, 255";

  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto flex flex-col text-white pb-20 font-barlow relative">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
        <div>
          <h1 className="hud-title-lg text-5xl uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] font-normal">
            {isEdit ? "Recalibrar Artefato" : "Forja de Relíquias"}
          </h1>
          <p className="hud-label-tactical text-brand mt-2 text-[11px] tracking-[0.3em]">CONTROLE DE ARTEFATOS DO REINO</p>
        </div>
        <div className="flex gap-4">
          {isEdit && onDelete && (
            <button onClick={onDelete} className="hud-label-tactical text-red-500 text-[11px] px-6 py-3 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all font-normal">DESTRUIR</button>
          )}
          <Link href="/admin/reliquias" className="hud-label-tactical text-[11px] px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-all font-normal">CANCELAR</Link>
          <button 
            onClick={async () => { setIsSaving(true); await onSave({ ...formData, alternatives, selectedFile }); setIsSaving(false); }}
            disabled={isSaving}
            className="bg-brand text-white hud-label-tactical text-[11px] px-10 py-3 rounded-lg shadow-[0_0_20px_rgba(17,194,199,0.4)] disabled:opacity-50 font-normal"
          >
            {isSaving ? "PROCESSANDO..." : "SALVAR ARTEFATO"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-dark-surface border border-white/5 rounded-2xl p-8 backdrop-blur-md">
            <h2 className="hud-title-md text-2xl mb-6 border-b border-white/10 pb-4 uppercase tracking-widest font-normal"><span className="text-brand mr-2">●</span> Dados</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="hud-label-tactical text-[10px] text-gray-400 uppercase tracking-widest font-normal">Nome</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand outline-none h-[52px]" />
                </div>
                <HUDSelect 
                  label="Raridade" value={formData.rarity} onChange={(val: any) => setFormData({...formData, rarity: val})}
                  textStyle={{ color: `rgb(${baseColor})`, textShadow: `0 0 10px rgba(${baseColor}, 0.5)` }}
                  options={[{ label: "COMUM", value: "COMMON" }, { label: "RARA", value: "RARE" }, { label: "LENDÁRIA", value: "LEGENDARY" }]}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="hud-label-tactical text-[10px] text-gray-400 uppercase tracking-widest font-normal">Ícone</label>
                <div className="flex items-center gap-4">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    className="bg-white/5 border border-white/10 hover:border-brand/50 text-white px-6 py-4 rounded-xl flex items-center gap-3 transition-all group hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(17,194,199,0.1)] active:scale-95"
                  >
                    <img src={ICONS.picture} alt="" className="w-8 h-8 object-contain opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    <span className="hud-label-tactical text-[10px] text-brand uppercase font-normal">Escolher Imagem</span>
                  </button>
                  <span className="text-[10px] text-gray-500 italic">{selectedFile ? 'Arquivo pronto ✓' : 'Nenhum arquivo'}</span>
                </div>
              </div>

              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Descrição..." className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand outline-none h-32 resize-none font-barlow leading-relaxed" />
            </div>
          </section>

          <section className="bg-dark-surface border border-brand/20 rounded-2xl p-8 backdrop-blur-md relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6 relative z-10">
              <h2 className="hud-title-md text-2xl text-white uppercase tracking-wider font-normal">ROTAS DE DESBLOQUEIO</h2>
              <button onClick={() => setAlternatives([...alternatives, { id: Date.now(), type: "XP", value: "" }])} className="bg-brand/10 border border-brand/30 text-brand text-[9px] px-4 py-2 rounded hover:bg-brand hover:text-white transition-all">+ ADICIONAR ROTA</button>
            </div>

            <div className="space-y-4 relative z-10">
              {alternatives.map((alt: any, index: number) => (
                <div key={alt.id} className="flex flex-col gap-4 bg-black/40 border border-white/5 p-4 rounded-xl relative group">
                  <div className="flex items-center justify-between">
                    <span className="hud-label-tactical text-gray-500 text-[10px] tracking-widest uppercase">ROTA 0{index + 1}</span>
                    {alternatives.length > 1 && (
                      <button onClick={() => setAlternatives(alternatives.filter((a: any) => a.id !== alt.id))} className="text-red-500 text-[10px] uppercase font-bold tracking-widest hover:text-red-400 transition-colors">Remover</button>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <HUDSelect 
                      className="w-full sm:w-1/3"
                      value={alt.type}
                      onChange={(val: any) => updateAlt(alt.id, { type: val, value: "", attr: "FOR" })}
                      options={[{ label: "Total de XP", value: "XP" }, { label: "Missão", value: "MISSION" }, { label: "Atributo", value: "ATTRIBUTE" }, { label: "Manual", value: "MANUAL" }]}
                    />

                    <div className="flex-1 w-full">
                      {alt.type === "XP" && (
                        <div className="relative">
                          <input type="number" value={alt.value} onChange={(e) => updateAlt(alt.id, { value: e.target.value })} className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 pr-12 text-sm outline-none focus:border-brand h-[50px] font-barlow" placeholder="5000" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand font-black text-[10px] tracking-widest">XP</span>
                        </div>
                      )}

                      {alt.type === "MISSION" && (
                        <button 
                          type="button"
                          onClick={() => { setActiveAltId(alt.id); setIsMissionModalOpen(true); }}
                          className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm text-left truncate hover:border-brand/40 transition-all h-[50px] flex justify-between items-center"
                        >
                          <span className="truncate uppercase tracking-widest font-bold">
                            {missions.find((m:any) => m.id === alt.value)?.title || "SELECIONAR MISSÃO..."}
                          </span>
                          <div>
                              <Image src={ICONS.search} alt="Buscar" width={16} height={16} className="brightness-0 invert" />
                          </div>
                        </button>
                      )}

                      {alt.type === "ATTRIBUTE" && (
                        <div className="flex gap-2 w-full">
                          <HUDSelect 
                            className="flex-[4]" 
                            value={alt.attr || "FOR"}
                            onChange={(val: any) => updateAlt(alt.id, { attr: val })}
                            options={GAME_ATTRIBUTES}
                          />
                          <input 
                            type="number" 
                            value={alt.value} 
                            onChange={(e) => updateAlt(alt.id, { value: e.target.value })} 
                            className="w-[100px] shrink-0 bg-dark-bg border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand h-[50px] font-barlow text-center" 
                            placeholder="VALOR" 
                          />
                        </div>
                      )}

                      {alt.type === "MANUAL" && (
                        <div className="bg-white/10 border border-white/5 rounded-lg p-3 text-gray-500 text-[10px] tracking-widest uppercase italic flex items-center justify-center h-[50px] cursor-not-allowed font-normal">
                          BLOQUEADO: CONCESSÃO MANUAL
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* PREVIEW COLUMN */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 bg-black/80 border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="w-full aspect-square relative flex items-center justify-center mb-6">
                <div className="absolute inset-0">
                  <img src={rarityRayMap[formData.rarity]} className="w-full h-full object-contain mix-blend-screen scale-[1.8] opacity-80" alt="" />
                </div>
                <div className="relative w-[70%] h-[70%] z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                  <Image src={formData.icon} alt="Preview" fill className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]" />
                </div>
              </div>

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="relative z-10 flex items-center justify-center px-6 py-1.5 rounded-full backdrop-blur-xl mb-6 overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(${baseColor}, 0.2) 100%)`,
                    boxShadow: `inset 0 0 12px rgba(${baseColor}, 0.2), 0 4px 15px rgba(0, 0, 0, 0.5)`
                  }}>
                  <div className="absolute top-0 left-0 w-full h-[1px] opacity-40" style={{ background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 1), transparent)` }} />
                  <span className="hud-label-tactical text-[11px] font-black tracking-[0.3em] text-white uppercase relative z-10"
                    style={{ textShadow: `0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(${baseColor}, 1)` }}>
                    {formData.rarity === "LEGENDARY" ? "LENDÁRIA" : formData.rarity === "RARE" ? "RARA" : "COMUM"}
                  </span>
                </div>
                <h3 className="hud-title-md text-xo text-2xl mb-2 uppercase tracking-tight font-normal">{formData.name || "ARTEFATO"}</h3>
                <p className="font-barlow text-sm text-gray-400 leading-relaxed line-clamp-3 italic-none px-4">
                  {formData.description || "Descrição do artefato..."}
                </p>
              </div>
          </div>
        </div>
      </div>

      {/* ⚔️ MISSION SELECTION MODAL */}
      {isMissionModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          {/* Changed overflow-hidden to overflow-visible to let glow bleed */}
          <div className="bg-dark-bg border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] relative animate-in fade-in zoom-in duration-200 overflow-visible">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"></div>

            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="hud-title-md text-4xl text-white m-0 tracking-tighter uppercase font-normal">
                  DIRECIONAR MISSÃO
                </h2>
                <p className="hud-label-tactical text-[11px] mt-1 italic-none">
                  <span className="text-brand">ALVO:</span> <span className="text-orange-500 font-bold uppercase">
                    ROTA 0{alternatives.findIndex((a:any) => a.id === activeAltId) + 1}
                  </span>
                </p>
              </div>
              <button onClick={() => setIsMissionModalOpen(false)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors text-2xl bg-white/5 rounded-full border border-white/10">✕</button>
            </div>

            <div className="p-8 border-b border-white/5 space-y-6 overflow-visible">
              <div className="relative group">
                {/* Added drop-shadow for the neon effect */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    <Image 
                    src={ICONS.search} 
                    alt="" 
                    width={65} 
                    height={65} 
                    className="drop-shadow-[0_0_15px_rgba(17,194,199,0.9)]" 
                    />
                </div>
                
                <input 
                    type="text" 
                    placeholder="BUSCAR NO MURAL DE MISSÕES..." 
                    value={missionSearch}
                    onChange={(e) => setMissionSearch(e.target.value)}
                    style={{ paddingLeft: '90px' }} // This FORCES the text to the right
                    className="w-full bg-brand/20 border border-white/10 p-5 rounded-xl text-white hud-label-tactical text-xs outline-none focus:border-brand/60 transition-all placeholder:opacity-50 font-normal shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                />
                </div>
              
              <div className="relative overflow-visible">
                <div className="flex gap-3 overflow-x-auto px-4 py-4 pb-6 custom-category-scroll">
                  {MISSION_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`whitespace-nowrap px-6 py-2.5 rounded-full hud-label-tactical text-[10px] tracking-widest transition-all border uppercase italic-none font-normal ${
                        activeCategory === cat 
                        ? 'bg-brand/20 border-brand text-brand shadow-[0_0_15px_rgba(17,194,199,0.5)]' 
                        : 'bg-black/40 text-gray-500 border-white/10 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-black/20 rounded-b-2xl">
              {filteredMissions.map((mission: any) => (
                <div 
                  key={mission.id}
                  onClick={() => handleSelectMission(mission.id)}
                  className="p-6 rounded-2xl cursor-pointer border border-white/5 bg-white/5 hover:border-brand/40 hover:bg-brand/10 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <p className="hud-title-md text-2xl text-white group-hover:text-brand transition-colors tracking-tight uppercase font-normal">
                      {mission.title}
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-black/40 border border-white/10 rounded-md hud-label-tactical text-[9px] text-gray-500 uppercase italic-none font-normal">
                        {mission.type || "GERAL"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="hud-value text-3xl text-brand drop-shadow-[0_0_10px_rgba(17,194,199,0.3)] font-normal">
                         +{mission.xpReward} XP
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM SCROLLBAR STYLING FOR THE SLIDER */}
      <style jsx global>{`
        .custom-category-scroll::-webkit-scrollbar {
          height: 8px;
        }
        .custom-category-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          margin: 0 40px;
        }
        .custom-category-scroll::-webkit-scrollbar-thumb {
          background: #11c2c7;
          box-shadow: 0 0 10px rgba(17,194,199,0.5);
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}