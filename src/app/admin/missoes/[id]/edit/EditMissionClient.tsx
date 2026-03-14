"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MISSION_CATEGORIES, ATTRIBUTE_MAP } from "@/constants/gameConfig";
import { updateMission } from "@/app/actions/missionActions";

export default function EditMissionClient({ mission }: { mission: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hydrates form states from the existing database record
  const [title, setTitle] = useState(mission.title);
  const [category, setCategory] = useState<string>(mission.type || MISSION_CATEGORIES[0]);
  const [description, setDescription] = useState(mission.description || "");
  
  // Defines the trigger logic and target count for automated completions
  const [triggerType, setTriggerType] = useState(mission.triggerType || "MANUAL");
  const [targetValue, setTargetValue] = useState(mission.targetValue || 0);
  
  const isInitialLvlUp = mission.xpReward === 9999;
  const [isLvlUp, setIsLvlUp] = useState(isInitialLvlUp);
  const [xpReward, setXpReward] = useState(isInitialLvlUp ? "" : String(mission.xpReward));

  // Hydrates attribute rewards from the existing database record
  const [rewardAttribute, setRewardAttribute] = useState<string>(mission.rewardAttribute || "");
  const [rewardAttribute2, setRewardAttribute2] = useState<string>(mission.rewardAttribute2 || "");
  const [rewardAttrValue, setRewardAttrValue] = useState<number>(mission.rewardAttrValue || 0);
  
  // Controls the visibility of the secondary attribute selection in the UI
  const [showSecondary, setShowSecondary] = useState(!!mission.rewardAttribute2);

  // Processes the form submission and updates the mission record via server action
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("O título é obrigatório.");
    
    setIsSubmitting(true);

    const finalXpReward = isLvlUp ? 9999 : Number(xpReward);

    const result = await updateMission(mission.id, {
      title,
      type: category,
      xpReward: finalXpReward,
      description,
      triggerType,
      targetValue: Number(targetValue),
      rewardAttribute: rewardAttribute || null,
      rewardAttribute2: (showSecondary && rewardAttribute2) ? rewardAttribute2 : null,
      rewardAttrValue: rewardAttribute ? Number(rewardAttrValue) : 0,
    });

    if (result.success) {
      router.push('/admin/missoes');
      router.refresh();
    } else {
      alert("Erro ao atualizar o decreto no banco de dados.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto flex flex-col pb-20 text-white font-barlow">
      
      <header className="w-full bg-dark-bg/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex justify-between items-center shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"></div>
        <div className="flex items-center gap-5">
          <Link href="/admin/missoes" className="hud-label-tactical text-[9px] hover:text-brand transition-all uppercase tracking-widest">
            ← CANCELAR
          </Link>
          <div className="h-6 w-px bg-white/5"></div>
          <span className="hud-title-md text-brand mt-0.5 uppercase tracking-widest">
            REFORJAR DECRETO
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: THE FORGE FORM */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl space-y-10 relative overflow-hidden">
          
          <div className="space-y-6">
            <h3 className="hud-label-tactical text-gray-500 text-xs italic-none tracking-[0.3em] flex items-center gap-3">
              <span className="w-8 h-px bg-white/10"></span> DADOS DA JORNADA
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="hud-label-tactical uppercase">Título da Missão</label>
                <input
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="bg-black/40 border border-white/10 p-4 text-white rounded-xl focus:border-brand/50 outline-none transition-all w-full uppercase"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="hud-label-tactical uppercase">Categoria</label>
                <select
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="bg-black/40 border border-white/10 p-4 text-white font-barlow font-bold uppercase tracking-widest text-sm rounded-xl focus:border-brand/50 outline-none transition-all w-full appearance-none cursor-pointer h-[58px]"
                >
                  {MISSION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-dark-bg text-white">{cat.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="hud-label-tactical uppercase">Lore / Instruções</label>
              <textarea
                rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                className="bg-black/40 border border-white/10 p-4 text-gray-300 font-barlow rounded-xl focus:border-brand/50 outline-none transition-all w-full resize-none"
              />
            </div>

            {/* Configures the automation rules for the mission completion trigger */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
              <div className="flex flex-col gap-2">
                <label className="hud-label-tactical text-gray-400 uppercase">Mecânica de Conclusão</label>
                <select 
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value)}
                  className="bg-black/40 border border-white/10 p-4 text-white font-barlow text-sm rounded-xl outline-none appearance-none cursor-pointer h-[58px]"
                >
                  <option value="MANUAL">MANUAL (Avaliado pelo Líder)</option>
                  <option value="FRIEND_COUNT">AUTOMÁTICO (Meta de Companheiros)</option>
                </select>
              </div>

              {triggerType === "FRIEND_COUNT" && (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="hud-label-tactical text-brand uppercase">Quantidade de Amigos</label>
                  <input 
                    type="number" min="1"
                    value={targetValue}
                    onChange={(e) => setTargetValue(parseInt(e.target.value) || 0)}
                    className="bg-black/40 border border-brand/30 p-4 text-white rounded-xl focus:border-brand outline-none transition-all h-[58px]"
                    placeholder="Ex: 5"
                  />
                </div>
              )}
            </div>
          </div>

          <hr className="border-white/5" />

          {/* REWARD MATRIX */}
          <div className="bg-brand/5 border border-brand/10 p-8 rounded-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <span className="text-8xl font-black italic">REWARDS</span>
            </div>

            <h3 className="hud-label-tactical text-brand text-xs italic-none tracking-[0.3em] uppercase relative z-10 flex items-center gap-3">
              <span className="w-8 h-px bg-brand/20"></span> Matriz de Recompensa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start relative z-10">
              
              {/* XP */}
              <div className="flex flex-col gap-2">
                <label className="hud-label-tactical text-xp uppercase">XP Base</label>
                <div className="flex gap-2 items-center bg-black/40 p-2 rounded-xl border border-white/10">
                  <input
                    type="number" required={!isLvlUp} disabled={isLvlUp} value={xpReward} onChange={(e) => setXpReward(e.target.value)}
                    className="w-full bg-transparent p-2 text-xp hud-value text-3xl outline-none disabled:opacity-20 [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button" onClick={() => { setIsLvlUp(!isLvlUp); if (!isLvlUp) setXpReward(""); }}
                    className={`px-3 py-3 border rounded-lg hud-label-tactical text-[9px] whitespace-nowrap transition-all ${isLvlUp ? "bg-brand border-brand text-dark-bg" : "bg-black/80 border-white/10 text-gray-500"}`}
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* PRIMARY ATTRIBUTE */}
              <div className="flex flex-col gap-2">
                <label className="hud-label-tactical text-gray-400 uppercase">Atributo Primário</label>
                <select
                  value={rewardAttribute} onChange={(e) => setRewardAttribute(e.target.value)}
                  className="bg-black/40 border border-white/10 p-4 text-white font-barlow text-sm rounded-xl outline-none appearance-none cursor-pointer h-[66px]"
                >
                  <option value="">NENHUM (APENAS XP)</option>
                  {Object.entries(ATTRIBUTE_MAP).map(([key, label]) => <option key={key} value={key}>{label.toUpperCase()}</option>)}
                </select>
              </div>

              {/* POINTS */}
              <div className={`flex flex-col gap-2 transition-opacity ${!rewardAttribute ? 'opacity-20' : 'opacity-100'}`}>
                <label className="hud-label-tactical text-gray-400 uppercase">Pontos (+)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-500 font-mono">+</span>
                  <input
                    type="number" disabled={!rewardAttribute} value={rewardAttrValue} onChange={(e) => setRewardAttrValue(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 p-4 pl-8 text-white hud-value text-3xl rounded-xl outline-none disabled:bg-black/20 h-[66px]"
                  />
                </div>
              </div>
            </div>

            {/* DUAL ATTRIBUTE TOGGLE */}
            {rewardAttribute && (
              <div className="pt-6 mt-4 border-t border-brand/20 relative z-10">
                {!showSecondary ? (
                  <button 
                    type="button" onClick={() => setShowSecondary(true)}
                    className="hud-label-tactical text-brand text-[10px] border border-brand/30 px-4 py-2 rounded-lg hover:bg-brand/10 transition-all uppercase tracking-widest flex items-center gap-2"
                  >
                    <span className="text-lg leading-none">+</span> Adicionar Atributo Secundário
                  </button>
                ) : (
                  <div className="flex flex-col md:flex-row gap-6 items-end animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col gap-2 flex-1 w-full">
                      <label className="hud-label-tactical text-gray-400 uppercase flex justify-between text-[10px]">
                        Atributo Secundário
                        <span className="text-brand lowercase opacity-70">(recebe os mesmos +{rewardAttrValue} pontos)</span>
                      </label>
                      <select
                        value={rewardAttribute2} onChange={(e) => setRewardAttribute2(e.target.value)}
                        className="bg-black/40 border border-brand/40 p-4 text-white font-barlow text-sm rounded-xl outline-none appearance-none cursor-pointer h-[66px] w-full"
                      >
                        <option value="">SELECIONE UM ATRIBUTO...</option>
                        {Object.entries(ATTRIBUTE_MAP)
                          .filter(([key]) => key !== rewardAttribute)
                          .map(([key, label]) => <option key={key} value={key}>{label.toUpperCase()}</option>)}
                      </select>
                    </div>
                    <button 
                      type="button" onClick={() => { setShowSecondary(false); setRewardAttribute2(""); }}
                      className="h-[66px] px-6 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition-all hud-label-tactical text-[10px]"
                    >
                      REMOVER
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-brand hover:brightness-110 text-dark-bg hud-title-md text-2xl py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(17,194,199,0.3)] disabled:opacity-50"
          >
            {isSubmitting ? "ATUALIZANDO..." : "SALVAR ALTERAÇÕES"}
          </button>
        </form>

        {/* RIGHT COLUMN: LIVE PREVIEW */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="hud-label-tactical text-gray-500 text-xs italic-none tracking-[0.3em] flex items-center gap-3">
             VISUALIZAÇÃO NO HUD DO VALENTE
          </h3>
          
          <div className="bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl flex flex-col hover:border-brand/30 transition-all group relative overflow-hidden sticky top-8 min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-2">
                <span className="bg-white/5 text-gray-400 border border-white/10 hud-label-tactical px-3 py-1 rounded-full text-[9px] uppercase tracking-widest w-fit">
                  {category}
                </span>
                
                {/* Visual indicator for the automated requirement in the live preview */}
                {triggerType === "FRIEND_COUNT" && targetValue > 0 && (
                  <span className="bg-brand/10 text-brand border border-brand/20 hud-label-tactical px-3 py-1 rounded-full text-[9px] uppercase tracking-widest w-fit">
                    META: {targetValue} AMIGOS
                  </span>
                )}
              </div>
              <span className="hud-value text-brand text-3xl drop-shadow-[0_0_10px_rgba(17,194,199,0.4)]">
                {isLvlUp ? 'LVL UP' : `+${xpReward || 0} XP`}
              </span>
            </div>
            
            <h3 className="hud-title-md text-white mb-3 uppercase tracking-wider text-2xl break-words">
              {title || "TÍTULO DA MISSÃO"}
            </h3>
            
            <p className="font-barlow text-gray-500 text-sm mb-8 leading-relaxed break-words line-clamp-4">
              {description || "A descrição e os detalhes estratégicos da missão aparecerão aqui para guiar o Valente..."}
            </p>
            
            {/* LIVE PREVIEW: Dual Attributes */}
            {rewardAttribute && rewardAttrValue > 0 && (
              <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-3 animate-in slide-in-from-bottom-2 duration-500">
                <div className="w-full">
                  <p className="hud-label-tactical text-[9px] text-gray-500 mb-2 uppercase tracking-widest">Recompensa Tática</p>
                </div>
                
                <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(17,194,199,0.1)]">
                   <span className="text-brand text-xs font-black">+{rewardAttrValue}</span>
                   <span className="hud-label-tactical text-[10px] text-brand uppercase tracking-widest">
                     {ATTRIBUTE_MAP[rewardAttribute]}
                   </span>
                </div>

                {showSecondary && rewardAttribute2 && (
                  <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/30 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(17,194,199,0.1)] animate-in zoom-in-50 duration-300">
                     <span className="text-brand text-xs font-black">+{rewardAttrValue}</span>
                     <span className="hud-label-tactical text-[10px] text-brand uppercase tracking-widest">
                       {ATTRIBUTE_MAP[rewardAttribute2]}
                     </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}