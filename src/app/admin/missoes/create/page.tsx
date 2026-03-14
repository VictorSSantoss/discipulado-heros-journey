"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createMission } from "@/app/actions/missionActions";
import { MISSION_CATEGORIES, ATTRIBUTE_MAP } from "@/constants/gameConfig";

export default function CreateMissionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [xpReward, setXpReward] = useState("50");
  
  // ⚔️ FIXED: Added <string> type to allow any category from the array
  const [type, setType] = useState<string>(MISSION_CATEGORIES[0]);
  
  const [triggerType, setTriggerType] = useState("MANUAL");
  const [targetValue, setTargetValue] = useState(0);

  const [rewardAttribute, setRewardAttribute] = useState("");
  const [rewardAttribute2, setRewardAttribute2] = useState(""); 
  const [rewardAttrValue, setRewardAttrValue] = useState(0);
  const [showSecondary, setShowSecondary] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("O título é obrigatório.");
    
    setIsSubmitting(true);

    const finalXpReward = xpReward === 'LVL UP DIRETO' ? 9999 : Number(xpReward);

    const result = await createMission({
      title,
      description,
      xpReward: finalXpReward,
      type,
      triggerType,
      targetValue: Number(targetValue),
      rewardAttribute: rewardAttribute || null,
      rewardAttribute2: (showSecondary && rewardAttribute2) ? rewardAttribute2 : null,
      rewardAttrValue: Number(rewardAttrValue),
    });

    if (result.success) {
      router.push("/admin/missoes");
      router.refresh();
    } else {
      alert("Erro ao criar missão.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto text-white font-barlow">
       <header className="mb-8 flex items-center justify-between">
          <Link href="/admin/missoes" className="hud-label-tactical text-[10px] text-gray-500 hover:text-white transition-all uppercase">
            ← Voltar ao Mural
          </Link>
          <h1 className="hud-title-md text-brand uppercase tracking-widest">Publicar Novo Decreto</h1>
       </header>

       <form onSubmit={handleSubmit} className="space-y-6 bg-dark-bg/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
          <div className="space-y-4">
            <label className="hud-label-tactical text-[10px] text-gray-400 uppercase">Dados Principais</label>
            <input 
              required className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-brand/40 uppercase"
              placeholder="Título da Operação" value={title} onChange={(e) => setTitle(e.target.value)} 
            />
            <textarea 
              required className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none h-32 resize-none focus:border-brand/40"
              placeholder="Instruções e Lore..." value={description} onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 border border-white/5 rounded-xl">
             <div className="space-y-2">
               <label className="hud-label-tactical text-[10px] text-gray-500 uppercase">Categoria</label>
               <select className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none" value={type} onChange={(e) => setType(e.target.value)}>
                  {MISSION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
               </select>
             </div>
             <div className="space-y-2">
               <label className="hud-label-tactical text-[10px] text-brand uppercase">Mecânica de Conclusão</label>
               <select className="w-full bg-black/40 border border-brand/20 p-4 rounded-xl outline-none" value={triggerType} onChange={(e) => setTriggerType(e.target.value)}>
                 <option value="MANUAL">MANUAL (Líder)</option>
                 <option value="FRIEND_COUNT">AUTOMÁTICO (Meta de Amigos)</option>
               </select>
             </div>
          </div>

          {triggerType === "FRIEND_COUNT" && (
            <div className="p-4 bg-brand/10 border border-brand/20 rounded-xl animate-in zoom-in-95">
              <label className="hud-label-tactical text-[10px] text-brand uppercase">Meta de Companheiros Requerida</label>
              <input 
                type="number" min="1" className="w-full bg-transparent p-2 text-2xl hud-value text-white outline-none"
                value={targetValue} onChange={(e) => setTargetValue(Number(e.target.value))}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
             <div className="space-y-2">
                <label className="hud-label-tactical text-[10px] text-xp uppercase">XP Recompensa</label>
                <input type="number" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-xp hud-value text-2xl" value={xpReward} onChange={(e) => setXpReward(e.target.value)} />
             </div>
             <div className="space-y-2">
                <label className="hud-label-tactical text-[10px] text-gray-500 uppercase">Atributo Primário</label>
                <select className="w-full bg-black/40 border border-white/10 p-4 rounded-xl" value={rewardAttribute} onChange={(e) => setRewardAttribute(e.target.value)}>
                  <option value="">NENHUM</option>
                  {Object.entries(ATTRIBUTE_MAP).map(([key, label]) => <option key={key} value={key}>{label.toUpperCase()}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="hud-label-tactical text-[10px] text-gray-500 uppercase">Pontos (+)</label>
                <input type="number" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl" value={rewardAttrValue} onChange={(e) => setRewardAttrValue(Number(e.target.value))} />
             </div>
          </div>

          {rewardAttribute && (
            <div className="p-4 border-t border-white/5">
              {!showSecondary ? (
                <button type="button" onClick={() => setShowSecondary(true)} className="hud-label-tactical text-brand text-[9px] border border-brand/30 px-3 py-1 rounded-md">
                  + ADICIONAR ATRIBUTO SECUNDÁRIO
                </button>
              ) : (
                <div className="flex gap-4 items-end">
                   <div className="flex-1 space-y-2">
                      <label className="hud-label-tactical text-[10px] text-gray-500 uppercase">Atributo 2</label>
                      <select className="w-full bg-black/40 border border-brand/20 p-4 rounded-xl" value={rewardAttribute2} onChange={(e) => setRewardAttribute2(e.target.value)}>
                        <option value="">SELECIONE...</option>
                        {Object.entries(ATTRIBUTE_MAP).filter(([k]) => k !== rewardAttribute).map(([key, label]) => <option key={key} value={key}>{label.toUpperCase()}</option>)}
                      </select>
                   </div>
                   <button type="button" onClick={() => { setShowSecondary(false); setRewardAttribute2(""); }} className="p-4 text-red-500 hud-label-tactical uppercase text-[10px]">Remover</button>
                </div>
              )}
            </div>
          )}

          <button disabled={isSubmitting} className="w-full bg-brand text-dark-bg p-5 rounded-xl hud-title-md uppercase text-xl hover:brightness-110 disabled:opacity-50 transition-all">
            {isSubmitting ? "FORJANDO..." : "PUBLICAR DECRETO"}
          </button>
       </form>
    </main>
  );
}