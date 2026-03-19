"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MISSION_CATEGORIES, ATTRIBUTE_MAP } from "@/constants/gameConfig";
import { createMission, updateMission } from "@/app/actions/missionActions";

/**
 * Shared Tactical Dropdown
 */
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
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        className={`bg-black/50 border ${isOpen ? 'border-brand/60 shadow-[0_0_10px_rgba(17,194,199,0.2)]' : 'border-white/10'} rounded-lg p-3 text-white font-barlow text-left flex justify-between items-center hover:border-brand/40 transition-all min-h-[58px]`}
      >
        <span style={textStyle} className="uppercase tracking-widest text-sm truncate">{selected?.label || "Selecionar..."}</span>
        <span className={`text-[10px] transition-transform ${isOpen ? 'rotate-180 text-brand' : 'text-gray-500'}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-[105%] left-0 w-full z-[100] bg-[#0c0d0e] backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-1 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt: any) => (
              <button 
                key={opt.value} 
                type="button" 
                onClick={() => { onChange(opt.value); setIsOpen(false); }} 
                className={`w-full text-left px-4 py-3 text-xs font-barlow uppercase transition-colors rounded-lg ${value === opt.value ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-gray-300'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MissionForm({ mission, isEdit = false }: { mission?: any; isEdit?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [title, setTitle] = useState(mission?.title || "");
  const [category, setCategory] = useState<string>(mission?.type || MISSION_CATEGORIES[0]);
  const [description, setDescription] = useState(mission?.description || "");
  const [triggerType, setTriggerType] = useState(mission?.triggerType || "MANUAL");
  const [targetValue, setTargetValue] = useState(mission?.targetValue || 0);
  
  const [periodicity, setPeriodicity] = useState(mission?.periodicity || "NONE");
  const [expiresAt, setExpiresAt] = useState(
    mission?.expiresAt ? new Date(mission.expiresAt).toISOString().slice(0, 16) : ""
  );

  const isInitialLvlUp = mission?.xpReward === 9999;
  const [isLvlUp, setIsLvlUp] = useState(isInitialLvlUp);
  const [xpReward, setXpReward] = useState(isInitialLvlUp ? "" : String(mission?.xpReward || "50"));

  const [rewardAttribute, setRewardAttribute] = useState<string>(mission?.rewardAttribute || "");
  const [rewardAttribute2, setRewardAttribute2] = useState<string>(mission?.rewardAttribute2 || "");
  const [rewardAttrValue, setRewardAttrValue] = useState<number>(mission?.rewardAttrValue || 0);
  const [showSecondary, setShowSecondary] = useState(!!mission?.rewardAttribute2);

  // --- PREVIEW THEME LOGIC ---
  const isSpecial = periodicity !== "NONE";
  const theme = useMemo(() => ({
    border: isSpecial ? 'border-amber-500/30' : 'border-brand/30',
    glow: isSpecial ? 'via-amber-500/40' : 'via-brand/40',
    text: isSpecial ? 'text-amber-400' : 'text-brand',
    badge: isSpecial ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-brand/10 text-brand border-brand/20',
    shadow: isSpecial ? 'drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'drop-shadow-[0_0_10px_rgba(17,194,199,0.4)]'
  }), [isSpecial]);

  // Mappings
  const categoryOptions = MISSION_CATEGORIES.map(cat => ({ label: cat.toUpperCase(), value: cat }));
  const triggerOptions = [
    { label: "MANUAL (Avaliado pelo Líder)", value: "MANUAL" },
    { label: "AUTOMÁTICO (Meta de Companheiros)", value: "FRIEND_COUNT" }
  ];
  
  const periodicityOptions = [
    { label: "PADRÃO (Sem limite)", value: "NONE" },
    { label: "DIÁRIA (Reseta meia-noite)", value: "DAILY" },
    { label: "SEMANAL (Reseta domingo)", value: "WEEKLY" },
    { label: "MENSAL (Reseta dia 1º)", value: "MONTHLY" },
    { label: "EVENTO (Data Fixa de Fim)", value: "EVENT" }
  ];

  const attributeOptions = [
    { label: "NENHUM (APENAS XP)", value: "" },
    ...Object.entries(ATTRIBUTE_MAP).map(([key, label]) => ({ label: label.toUpperCase(), value: key }))
  ];
  const secondaryAttributeOptions = [
    { label: "SELECIONE UM ATRIBUTO...", value: "" },
    ...Object.entries(ATTRIBUTE_MAP)
      .filter(([key]) => key !== rewardAttribute)
      .map(([key, label]) => ({ label: label.toUpperCase(), value: key }))
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsSubmitting(true);
    const finalXpReward = isLvlUp ? 9999 : Number(xpReward);
    
    let parsedExpiresAt = null;
    if (periodicity === "EVENT" && expiresAt) {
      parsedExpiresAt = new Date(expiresAt).toISOString();
    }

    const payload = {
      title,
      type: category,
      xpReward: finalXpReward,
      description,
      triggerType,
      targetValue: Number(targetValue),
      periodicity,
      expiresAt: parsedExpiresAt,
      rewardAttribute: rewardAttribute || null,
      rewardAttribute2: (showSecondary && rewardAttribute2) ? rewardAttribute2 : null,
      rewardAttrValue: rewardAttribute ? Number(rewardAttrValue) : 0,
    };

    const result = isEdit 
      ? await updateMission(mission.id, payload)
      : await createMission(payload);

    if (result.success) {
      router.push('/admin/missoes');
      router.refresh();
    } else {
      setIsSubmitting(false);
      alert("Erro ao salvar decreto.");
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto flex flex-col pb-20 text-white font-barlow">
      
      <header className="w-full bg-dark-bg/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex justify-between items-center shadow-2xl mb-8 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"></div>
        <div className="flex items-center gap-5">
          <Link href="/admin/missoes" className="hud-label-tactical text-[9px] hover:text-brand transition-all uppercase tracking-widest">
            ← {isEdit ? "CANCELAR REFORJA" : "CANCELAR FORJA"}
          </Link>
          <div className="h-6 w-px bg-white/5"></div>
          <span className="hud-title-md text-brand mt-0.5 uppercase tracking-widest">
            {isEdit ? "REFORJAR DECRETO" : "FORJA DE DECRETO"}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: THE FORM */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl space-y-10 relative">
          
          <div className="space-y-6">
            <h3 className="hud-label-tactical text-gray-500 text-xs tracking-[0.3em] flex items-center gap-3">
              <span className="w-8 h-px bg-white/10"></span> DADOS DA JORNADA
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-50">
              <div className="flex flex-col gap-2">
                <label className="hud-label-tactical uppercase">Título da Missão</label>
                <input
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="bg-black/40 border border-white/10 p-4 text-white rounded-xl focus:border-brand/50 outline-none transition-all w-full uppercase h-[58px]"
                  placeholder="NOME DA OPERAÇÃO"
                />
              </div>

              <HUDSelect label="Categoria" value={category} onChange={setCategory} options={categoryOptions} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="hud-label-tactical uppercase">Lore / Instruções</label>
              <textarea
                rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                className="bg-black/40 border border-white/10 p-4 text-gray-300 font-barlow rounded-xl focus:border-brand/50 outline-none transition-all w-full resize-none"
                placeholder="DESCRIÇÃO TÁTICA DA MISSÃO..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5 relative z-40">
              <HUDSelect 
                label="Mecânica de Conclusão" value={triggerType} onChange={setTriggerType} options={triggerOptions}
                textStyle={triggerType !== "MANUAL" ? { color: '#818cf8' } : { color: '#10b981' }}
              />

              <HUDSelect 
                label="Ciclo da Missão" value={periodicity} onChange={setPeriodicity} options={periodicityOptions}
                textStyle={periodicity !== "NONE" ? { color: '#f59e0b' } : { color: '#9ca3af' }}
              />

              {triggerType === "FRIEND_COUNT" && (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="hud-label-tactical text-brand uppercase">Quantidade de Amigos</label>
                  <input 
                    type="number" min="1" value={targetValue}
                    onChange={(e) => setTargetValue(parseInt(e.target.value) || 0)}
                    className="bg-black/40 border border-brand/30 p-4 text-white rounded-xl focus:border-brand outline-none transition-all h-[58px] hud-number-input"
                  />
                </div>
              )}

              {periodicity === "EVENT" && (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="hud-label-tactical text-orange-400 uppercase">Expiração do Evento</label>
                  <input 
                    type="datetime-local" 
                    required 
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="bg-black/40 border border-orange-500/30 p-4 text-white rounded-xl focus:border-orange-500 outline-none transition-all h-[58px] hud-date-input"
                  />
                </div>
              )}
            </div>
          </div>

          <hr className="border-white/5" />

          {/* REWARD MATRIX */}
          <div className="bg-brand/5 border border-brand/10 p-8 rounded-2xl space-y-6 relative">
            <h3 className="hud-label-tactical text-brand text-xs tracking-[0.3em] uppercase relative z-10 flex items-center gap-3">
              <span className="w-8 h-px bg-brand/20"></span> Matriz de Recompensa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start relative z-30">
              <div className="flex flex-col gap-2">
                <label className="hud-label-tactical text-xp uppercase">XP Base</label>
                <div className="flex gap-2 items-center bg-black/40 p-2 rounded-xl border border-white/10 h-[66px] focus-within:border-xp/50 focus-within:shadow-[0_0_15px_rgba(234,88,12,0.2)] transition-all">
                  <input
                    type="number" required={!isLvlUp} disabled={isLvlUp} value={xpReward} onChange={(e) => setXpReward(e.target.value)}
                    className="w-full bg-transparent p-2 text-xp hud-value text-3xl outline-none disabled:opacity-20 [&::-webkit-inner-spin-button]:appearance-none hud-number-input"
                  />
                  <button
                    type="button" onClick={() => { setIsLvlUp(!isLvlUp); if (!isLvlUp) setXpReward(""); }}
                    className={`px-3 py-3 border rounded-lg hud-label-tactical text-[9px] whitespace-nowrap transition-all ${isLvlUp ? "bg-brand border-brand text-dark-bg" : "bg-black/80 border-white/10 text-gray-500"}`}
                  >
                    MAX
                  </button>
                </div>
              </div>

              <HUDSelect label="Atributo Primário" value={rewardAttribute} onChange={setRewardAttribute} options={attributeOptions} />

              <div className={`flex flex-col gap-2 transition-all ${!rewardAttribute ? 'opacity-20' : 'opacity-100'}`}>
                <label className="hud-label-tactical text-gray-400 uppercase">Pontos (+)</label>
                <input
                  type="number" disabled={!rewardAttribute} value={rewardAttrValue} onChange={(e) => setRewardAttrValue(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 p-4 text-white hud-value text-3xl rounded-xl outline-none h-[66px] text-center focus:border-brand/60 focus:shadow-[0_0_15px_rgba(17,194,199,0.2)] hud-number-input"
                />
              </div>
            </div>

            {rewardAttribute && (
              <div className="pt-6 mt-4 border-t border-brand/20 relative z-20">
                {!showSecondary ? (
                  <button 
                    type="button" onClick={() => setShowSecondary(true)}
                    className="hud-label-tactical text-brand text-[10px] border border-brand/30 px-4 py-2 rounded-lg hover:bg-brand/10 transition-all uppercase tracking-widest"
                  >
                    + Adicionar Atributo Secundário
                  </button>
                ) : (
                  <div className="flex flex-col md:flex-row gap-6 items-end animate-in fade-in slide-in-from-top-2 duration-300">
                    <HUDSelect className="flex-1 w-full" label="Atributo Secundário" value={rewardAttribute2} onChange={setRewardAttribute2} options={secondaryAttributeOptions} />
                    <button 
                      type="button" onClick={() => { setShowSecondary(false); setRewardAttribute2(""); }}
                      className="h-[58px] px-6 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition-all hud-label-tactical text-[10px]"
                    >
                      REMOVER
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-6">
            <button
              type="submit" disabled={isSubmitting}
              className="w-full bg-brand hover:brightness-110 text-dark-bg hud-title-md text-2xl py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(17,194,199,0.3)] disabled:opacity-50"
            >
              {isSubmitting ? "PROCESSANDO..." : isEdit ? "SALVAR ALTERAÇÕES" : "PUBLICAÇÃO OFICIAL"}
            </button>
          </div>
        </form>

        {/* RIGHT COLUMN: TACTICAL PREVIEW */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="hud-label-tactical text-gray-500 text-xs tracking-[0.3em] flex items-center gap-3">
             VISUALIZAÇÃO NO HUD
          </h3>
          
          <div className={`bg-dark-bg/40 backdrop-blur-xl border p-8 rounded-2xl flex flex-col transition-all group relative overflow-hidden sticky top-8 min-h-[400px] shadow-2xl ${theme.border}`}>
            {/* Dynamic Glow Line */}
            <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${theme.glow} to-transparent`}></div>
            
            <div className="flex justify-between items-start mb-6 gap-2 relative z-10">
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/5 text-gray-400 border border-white/10 hud-label-tactical px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest w-fit">
                  {category}
                </span>
                
                {/* ⏳ Time-Gating Badge with Dynamic Color */}
                {isSpecial && (
                  <span className={`hud-label-tactical px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest w-fit border shadow-lg animate-in zoom-in-95 duration-300 ${theme.badge}`}>
                    {periodicity === "DAILY" ? "DIÁRIA" : periodicity === "WEEKLY" ? "SEMANAL" : periodicity === "MONTHLY" ? "MENSAL" : "EVENTO"}
                  </span>
                )}

                {triggerType === "FRIEND_COUNT" && targetValue > 0 && (
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hud-label-tactical px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest w-fit">
                    META: {targetValue} AMIGOS
                  </span>
                )}
              </div>
              <span className={`hud-value text-3xl shrink-0 ${theme.text} ${theme.shadow}`}>
                {isLvlUp ? 'LVL UP' : `+${xpReward || 0} XP`}
              </span>
            </div>
            
            <h3 className="hud-title-md text-white mb-3 uppercase tracking-wider text-2xl break-words relative z-10">{title || "NOME DO DECRETO"}</h3>
            <p className="font-barlow text-gray-500 text-sm mb-8 leading-relaxed break-words line-clamp-5 uppercase tracking-tighter relative z-10">
              {description || "Aguardando entrada de dados táticos para descrição da operação..."}
            </p>
            
            {rewardAttribute && rewardAttrValue > 0 && (
              <div className="mt-auto pt-6 border-t border-white/5 flex flex-wrap gap-3 relative z-10">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors ${theme.badge}`}>
                   <span className="font-black text-xs">+{rewardAttrValue}</span>
                   <span className="hud-label-tactical text-[10px] uppercase tracking-widest">{ATTRIBUTE_MAP[rewardAttribute]}</span>
                </div>
                {showSecondary && rewardAttribute2 && (
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors ${theme.badge}`}>
                     <span className="font-black text-xs">+{rewardAttrValue}</span>
                     <span className="hud-label-tactical text-[10px] uppercase tracking-widest">{ATTRIBUTE_MAP[rewardAttribute2]}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hud-number-input::-webkit-inner-spin-button,
        .hud-number-input::-webkit-outer-spin-button {
          opacity: 1;
          filter: invert(1) brightness(2) sepia(1) saturate(5) hue-rotate(140deg);
          cursor: pointer;
          height: 24px;
          width: 14px;
        }

        .hud-number-input::-webkit-inner-spin-button:hover {
          filter: invert(1) brightness(3) sepia(1) saturate(10) hue-rotate(140deg) drop-shadow(0 0 5px rgba(17, 194, 199, 0.8));
        }

        .hud-date-input::-webkit-calendar-picker-indicator {
          filter: invert(1) sepia(1) saturate(5) hue-rotate(350deg) brightness(1.2);
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}