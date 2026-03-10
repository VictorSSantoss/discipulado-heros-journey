"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MISSION_CATEGORIES, ATTRIBUTE_MAP } from "@/constants/gameConfig";
import { createMission } from "@/app/actions/missionActions";

export default function MissionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FORM STATE
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(MISSION_CATEGORIES[0] || "Hábitos Espirituais");
  const [xpReward, setXpReward] = useState<number | string>(100);
  const [description, setDescription] = useState("");
  const [rewardAttribute, setRewardAttribute] = useState<string>("");
  const [rewardAttrValue, setRewardAttrValue] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setIsSubmitting(true);

    const finalXpReward = xpReward === 'LVL UP DIRETO' ? 9999 : Number(xpReward);

    const result = await createMission({
      title,
      description,
      xpReward: finalXpReward,
      type: category,
      rewardAttribute: rewardAttribute || null,
      rewardAttrValue: rewardAttribute ? Number(rewardAttrValue) : 0,
    });

    if (result.success) {
      router.push('/admin/missoes');
      router.refresh();
    } else {
      alert("Falha ao forjar missão.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* THE FORGE (FORM) */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-dark-bg/40 backdrop-blur-xl border border-white/5 p-6 md:p-10 rounded-2xl shadow-2xl space-y-10 relative overflow-hidden">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col">
            <label className="hud-label-tactical mb-3 uppercase">Título da Quest</label>
            <input 
              required type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="bg-dark-bg/80 border border-white/10 p-4 rounded-xl text-white hud-title-md outline-none focus:border-mission/50 shadow-inner"
              placeholder="EX: LER O LIVRO DE NEEMIAS"
            />
          </div>

          <div className="flex flex-col">
            <label className="hud-label-tactical mb-3 uppercase">Categoria</label>
            <select 
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="bg-dark-bg/80 border border-white/10 p-4 rounded-xl text-white font-barlow font-bold uppercase tracking-widest text-sm outline-none focus:border-mission/50 h-[68px] appearance-none cursor-pointer shadow-inner"
            >
              {MISSION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-mission/5 border border-mission/10 p-8 rounded-2xl space-y-8 relative overflow-hidden">
          <h3 className="hud-label-tactical text-mission text-xs italic-none tracking-[0.3em] uppercase">Recompensa</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* XP */}
            <div className="flex flex-col">
              <label className="hud-label-tactical mb-3 text-xp uppercase">XP Base</label>
              <div className="flex gap-2 items-center bg-dark-bg/60 p-2 rounded-xl border border-white/5 shadow-inner">
                <input 
                  type="number" value={xpReward === 'LVL UP DIRETO' ? '' : xpReward}
                  onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
                  disabled={xpReward === 'LVL UP DIRETO'}
                  className="bg-dark-bg/80 border border-white/10 p-2 rounded-lg text-xp hud-value w-full outline-none"
                />
                <button 
                  type="button" onClick={() => setXpReward(xpReward === 'LVL UP DIRETO' ? 100 : 'LVL UP DIRETO')}
                  className={`px-3 py-2 border rounded-lg hud-label-tactical text-[9px] ${xpReward === 'LVL UP DIRETO' ? "bg-brand border-brand text-dark-bg" : "bg-dark-bg/80 border-white/10 text-gray-500"}`}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* ATTR SELECT */}
            <div className="flex flex-col">
              <label className="hud-label-tactical mb-3 uppercase">Atributo</label>
              <select 
                value={rewardAttribute} onChange={(e) => setRewardAttribute(e.target.value)}
                className="bg-dark-bg/80 border border-white/10 p-4 rounded-xl text-white font-barlow text-sm outline-none shadow-inner h-[58px] appearance-none cursor-pointer"
              >
                <option value="">NENHUM</option>
                {Object.entries(ATTRIBUTE_MAP).map(([key, label]) => <option key={key} value={key}>{label.toUpperCase()}</option>)}
              </select>
            </div>

            {/* ATTR POINTS */}
            <div className={`flex flex-col ${!rewardAttribute ? 'opacity-20' : 'opacity-100'}`}>
              <label className="hud-label-tactical mb-3 uppercase">Pontos</label>
              <input 
                type="number" disabled={!rewardAttribute} value={rewardAttrValue}
                onChange={(e) => setRewardAttrValue(parseInt(e.target.value) || 0)}
                className="bg-dark-bg/80 border border-white/10 p-3.5 rounded-xl text-white hud-value text-3xl outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="hud-label-tactical mb-3 uppercase">Instruções</label>
          <textarea 
            rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
            className="bg-dark-bg/80 border border-white/10 p-5 rounded-xl text-gray-300 font-barlow text-sm outline-none focus:border-mission/50 resize-none shadow-inner"
          />
        </div>

        <button 
          type="submit" disabled={isSubmitting}
          className="w-full bg-brand hover:brightness-110 text-dark-bg hud-title-md text-2xl py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(17,194,199,0.3)] disabled:opacity-50"
        >
          {isSubmitting ? "FORJANDO..." : "PUBLICAR MISSÃO"}
        </button>
      </form>

      {/* LIVE PREVIEW (RIGHT COLUMN) */}
      <div className="lg:col-span-1 hidden lg:block">
        <div className="sticky top-8 bg-dark-bg/40 backdrop-blur-xl border border-mission/30 p-8 rounded-2xl shadow-2xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mission to-transparent"></div>
          <span className="bg-white/5 text-gray-500 border border-white/10 hud-label-tactical px-3 py-1 rounded-full text-[9px] uppercase mb-6 inline-block">{category}</span>
          <div className="hud-value text-mission text-4xl mb-4">+{xpReward === 9999 ? 'LVL UP' : xpReward} XP</div>
          <h3 className="hud-title-md text-white text-2xl mb-4 uppercase">{title || "NOME DA MISSÃO"}</h3>
          <p className="font-barlow text-gray-500 text-sm mb-8 line-clamp-3">{description || "Instruções aqui..."}</p>
          {rewardAttribute && (
            <div className="border-t border-white/5 pt-4">
              <span className="hud-label-tactical text-[10px] text-brand uppercase">Buff: +{rewardAttrValue} {ATTRIBUTE_MAP[rewardAttribute]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}