"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ATTRIBUTE_MAP, MISSION_CATEGORIES } from "@/constants/gameConfig";
import { createMission } from "@/app/actions/missionActions";

interface MissionFormData {
  title: string;
  description: string;
  xpReward: number | string; 
  type: string;
  triggerType: string;      // Added to define manual vs automated
  targetValue: number;      // Added to define the friends count requirement
  rewardAttribute: string;
  rewardAttribute2: string; 
  rewardAttrValue: number;
}

export default function MissionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false); 

  const [formData, setFormData] = useState<MissionFormData>({
    title: "",
    description: "",
    xpReward: 50,
    type: MISSION_CATEGORIES[0],
    triggerType: "MANUAL",   // Default state
    targetValue: 0,          // Initial count
    rewardAttribute: "",
    rewardAttribute2: "",
    rewardAttrValue: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("A missão precisa de um título.");
    
    setIsSubmitting(true);

    const finalXpReward = formData.xpReward === 'LVL UP DIRETO' ? 9999 : Number(formData.xpReward);
    
    const result = await createMission({
        ...formData,
        xpReward: finalXpReward,
        triggerType: formData.triggerType,
        targetValue: Number(formData.targetValue),
        rewardAttribute: formData.rewardAttribute || null,
        rewardAttribute2: (showSecondary && formData.rewardAttribute2) ? formData.rewardAttribute2 : null,
    });
    
    if (result.success) {
      router.push("/admin/missoes"); 
      router.refresh();
    } else {
      alert("Falha ao registrar missão no mural.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN: THE FORGE (FORM) */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8 bg-dark-bg/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl animate-in fade-in duration-500">
        
        {/* 1. CORE INTEL */}
        <div className="space-y-6">
          <h3 className="hud-label-tactical text-gray-500 text-xs italic-none tracking-[0.3em] flex items-center gap-3">
            <span className="w-8 h-px bg-white/10"></span> DADOS DA JORNADA
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="hud-label-tactical text-[10px] text-gray-400 uppercase">Título da Operação</label>
              <input 
                required type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-mission/60 transition-all uppercase"
                placeholder="Ex: Evangelismo no Terminal"
              />
            </div>
            
            <div className="space-y-2">
              <label className="hud-label-tactical text-[10px] text-gray-400 uppercase">Categoria</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none appearance-none cursor-pointer h-[58px]"
              >
                {MISSION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="hud-label-tactical text-[10px] text-gray-400 uppercase">Objetivo Detalhado / Lore</label>
            <textarea 
              required value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-gray-300 outline-none focus:border-mission/60 h-32 resize-none transition-all font-barlow"
              placeholder="Descreva as instruções e o contexto desta missão..."
            />
          </div>

          {/* New Trigger Logic Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="hud-label-tactical text-[10px] text-gray-400 uppercase">Mecânica de Conclusão</label>
              <select 
                value={formData.triggerType}
                onChange={(e) => setFormData({...formData, triggerType: e.target.value})}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none appearance-none cursor-pointer h-[58px]"
              >
                <option value="MANUAL">MANUAL (Avaliado pelo Líder)</option>
                <option value="FRIEND_COUNT">AUTOMÁTICO (Meta de Companheiros)</option>
              </select>
            </div>

            {formData.triggerType === "FRIEND_COUNT" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="hud-label-tactical text-[10px] text-mission uppercase">Quantidade de Amigos</label>
                <input 
                  type="number" min="1"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({...formData, targetValue: parseInt(e.target.value) || 0})}
                  className="w-full bg-black/40 border border-mission/30 p-4 rounded-xl text-white outline-none focus:border-mission/60 transition-all h-[58px]"
                  placeholder="Ex: 5"
                />
              </div>
            )}
          </div>
        </div>

        <hr className="border-white/5" />

        {/* 2. REWARD MATRIX */}
        <div className="space-y-6 bg-mission/5 border border-mission/10 p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <span className="text-8xl font-black italic">REWARDS</span>
          </div>

          <h3 className="hud-label-tactical text-mission text-xs italic-none tracking-[0.3em] flex items-center gap-3 relative z-10">
            <span className="w-8 h-px bg-mission/20"></span> MATRIZ DE RECOMPENSA
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-start">
            
            {/* XP */}
            <div className="space-y-2">
              <label className="hud-label-tactical text-[10px] text-mission uppercase">XP Base</label>
              <div className="flex gap-2 items-center bg-black/40 p-2 rounded-xl border border-white/10">
                <input 
                  type="number" step="5" min="0"
                  value={formData.xpReward === 'LVL UP DIRETO' ? '' : formData.xpReward}
                  onChange={(e) => setFormData({...formData, xpReward: parseInt(e.target.value) || 0})}
                  disabled={formData.xpReward === 'LVL UP DIRETO'}
                  className="w-full bg-transparent p-2 text-mission hud-value text-3xl outline-none shadow-none disabled:opacity-20 [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button 
                  type="button" onClick={() => setFormData({...formData, xpReward: formData.xpReward === 'LVL UP DIRETO' ? 100 : 'LVL UP DIRETO'})}
                  className={`px-3 py-3 border rounded-lg hud-label-tactical text-[9px] whitespace-nowrap transition-all ${formData.xpReward === 'LVL UP DIRETO' ? "bg-mission border-mission text-dark-bg" : "bg-black/80 border-white/10 text-gray-500"}`}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* PRIMARY ATTRIBUTE */}
            <div className="space-y-2">
              <label className="hud-label-tactical text-[10px] text-gray-400 uppercase">Atributo Primário</label>
              <select 
                value={formData.rewardAttribute}
                onChange={(e) => setFormData({...formData, rewardAttribute: e.target.value})}
                className="w-full h-[66px] bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none cursor-pointer appearance-none"
              >
                <option value="">NENHUM (APENAS XP)</option>
                {Object.entries(ATTRIBUTE_MAP).map(([key, label]) => (
                  <option key={key} value={key}>{label.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* POINTS */}
            <div className="space-y-2 transition-opacity duration-300" style={{ opacity: formData.rewardAttribute ? 1 : 0.3 }}>
              <label className="hud-label-tactical text-[10px] text-gray-400 uppercase">Pontos (+)</label>
              <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-500 font-mono">+</span>
                  <input 
                      type="number" min="0" max="20"
                      disabled={!formData.rewardAttribute}
                      value={formData.rewardAttrValue}
                      onChange={(e) => setFormData({...formData, rewardAttrValue: parseInt(e.target.value) || 0})}
                      className="w-full bg-black/40 border border-white/10 p-4 pl-8 text-white hud-value text-3xl rounded-xl outline-none disabled:bg-black/20 h-[66px]"
                  />
              </div>
            </div>
          </div>

          {/* DUAL ATTRIBUTE SECTION */}
          {formData.rewardAttribute && (
            <div className="pt-6 mt-4 border-t border-mission/20 relative z-10">
              {!showSecondary ? (
                <button 
                  type="button" onClick={() => setShowSecondary(true)}
                  className="hud-label-tactical text-mission text-[10px] border border-mission/30 px-4 py-2 rounded-lg hover:bg-mission/10 transition-all uppercase tracking-widest flex items-center gap-2"
                >
                  <span className="text-lg leading-none">+</span> Adicionar Atributo Secundário
                </button>
              ) : (
                <div className="flex flex-col md:flex-row gap-6 items-end animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col gap-2 flex-1 w-full">
                    <label className="hud-label-tactical text-[10px] text-gray-400 uppercase flex justify-between">
                      Atributo Secundário
                      <span className="text-mission lowercase opacity-70">(recebe os mesmos +{formData.rewardAttrValue} pontos)</span>
                    </label>
                    <select
                      value={formData.rewardAttribute2} onChange={(e) => setFormData({...formData, rewardAttribute2: e.target.value})}
                      className="bg-black/40 border border-mission/40 p-4 text-white font-barlow text-sm rounded-xl outline-none appearance-none cursor-pointer h-[66px] w-full"
                    >
                      <option value="">SELECIONE UM ATRIBUTO...</option>
                      {Object.entries(ATTRIBUTE_MAP)
                        .filter(([key]) => key !== formData.rewardAttribute) 
                        .map(([key, label]) => <option key={key} value={key}>{label.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <button 
                    type="button" onClick={() => { setShowSecondary(false); setFormData({...formData, rewardAttribute2: ""}); }}
                    className="h-[66px] px-6 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition-all hud-label-tactical text-[10px]"
                  >
                    REMOVER
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. SUBMIT */}
        <button 
          disabled={isSubmitting}
          className="w-full bg-mission text-white hud-title-md text-2xl py-5 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
        >
          {isSubmitting ? "REGISTRANDO NO PERGAMINHO..." : "PUBLICAR DECRETO"}
        </button>
      </form>

      {/* RIGHT COLUMN: LIVE PREVIEW */}
      <div className="lg:col-span-1 space-y-6">
        <h3 className="hud-label-tactical text-gray-500 text-xs italic-none tracking-[0.3em] flex items-center gap-3">
           VISUALIZAÇÃO NO HUD DO VALENTE
        </h3>
        
        <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl flex flex-col hover:border-mission/30 transition-all group relative overflow-hidden sticky top-8 min-h-[400px]">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mission/60 to-transparent"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-2">
              <span className="bg-white/5 text-gray-400 border border-white/10 hud-label-tactical px-3 py-1 rounded-full text-[9px] uppercase tracking-widest w-fit">
                {formData.type}
              </span>
              
              {/* Added Mission Trigger Preview Badge */}
              {formData.triggerType === "FRIEND_COUNT" && formData.targetValue > 0 && (
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 hud-label-tactical px-3 py-1 rounded-full text-[9px] uppercase tracking-widest w-fit">
                  REQUISITO: {formData.targetValue} AMIGOS
                </span>
              )}
            </div>
            <span className="hud-value text-mission text-3xl drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
              {formData.xpReward === 'LVL UP DIRETO' ? 'LVL UP' : `+${formData.xpReward} XP`}
            </span>
          </div>
          
          <h3 className="hud-title-md text-white mb-3 uppercase tracking-wider text-2xl break-words">
            {formData.title || "TÍTULO DA MISSÃO"}
          </h3>
          
          <p className="font-barlow text-gray-500 text-sm mb-8 leading-relaxed break-words line-clamp-4">
            {formData.description || "A descrição e os detalhes estratégicos da missão aparecerão aqui para guiar o Valente..."}
          </p>
          
          {/* LIVE PREVIEW: Dual Attributes */}
          {formData.rewardAttribute && formData.rewardAttrValue > 0 && (
            <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-3 animate-in slide-in-from-bottom-2 duration-500">
              <div className="w-full">
                <p className="hud-label-tactical text-[9px] text-gray-500 mb-2 uppercase tracking-widest">Recompensa Tática</p>
              </div>
              
              <div className="inline-flex items-center gap-2 bg-mission/10 border border-mission/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                 <span className="text-mission text-xs font-black">+{formData.rewardAttrValue}</span>
                 <span className="hud-label-tactical text-[10px] text-mission uppercase tracking-widest">
                   {ATTRIBUTE_MAP[formData.rewardAttribute]}
                 </span>
              </div>

              {/* Secondary Attribute Badge */}
              {showSecondary && formData.rewardAttribute2 && (
                <div className="inline-flex items-center gap-2 bg-mission/10 border border-mission/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.1)] animate-in zoom-in-50 duration-300">
                   <span className="text-mission text-xs font-black">+{formData.rewardAttrValue}</span>
                   <span className="hud-label-tactical text-[10px] text-mission uppercase tracking-widest">
                     {ATTRIBUTE_MAP[formData.rewardAttribute2]}
                   </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}