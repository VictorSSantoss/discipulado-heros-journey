"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createReliquia, deleteReliquia } from "@/app/actions/reliquiaActions";
import { ICONS } from "@/constants/gameConfig";
import IconUploader from "@/components/game/IconUploader"; // Ensure this import is here

interface ReliquiaClientProps {
  initialCatalog: any[];
}

export default function ReliquiaClient({ initialCatalog }: ReliquiaClientProps) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "/images/medals/default.svg",
    rarity: "COMMON",
    triggerType: "XP_MILESTONE",
    ruleParams: {} as any,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const result = await createReliquia(formData);
    if (result.success) {
      window.location.reload(); 
    }
    setIsProcessing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja banir esta Relíquia da história?")) return;
    const result = await deleteReliquia(id);
    if (result.success) {
      setCatalog(catalog.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* --- ADD NEW RELIC CARD --- */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="group relative h-64 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-brand/40 hover:bg-brand/5 transition-all"
      >
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
          +
        </div>
        <span className="hud-label-tactical text-gray-400 group-hover:text-brand font-bold tracking-widest text-[10px]">FORJAR NOVA RELÍQUIA</span>
      </button>

      {/* --- CATALOG LIST --- */}
      {catalog.map((reliquia) => (
        <div key={reliquia.id} className="bg-dark-bg/40 border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
          <button 
            onClick={() => handleDelete(reliquia.id)}
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg text-red-500 z-20"
          >
            ✕
          </button>
          
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 relative bg-black/20 rounded-2xl p-4">
               <img src={reliquia.icon} className="w-full h-full object-contain" alt="" />
            </div>
            <div>
              <span className="hud-label-tactical text-[10px] opacity-50 block mb-1">{reliquia.rarity}</span>
              <h3 className="hud-title-md text-white">{reliquia.name}</h3>
              <p className="text-[10px] text-gray-500 uppercase mt-2">{reliquia.triggerType}</p>
            </div>
          </div>
        </div>
      ))}

      {/* --- THE FORGE MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-dark-bg border border-brand/20 p-8 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <h2 className="hud-title-md text-white text-2xl mb-8 uppercase tracking-widest">Nova Relíquia</h2>
              
              <form onSubmit={handleCreate} className="space-y-6">
                
                {/* BASIC INFO WITH ICON UPLOADER */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* NEW: ICON UPLOADER */}
                  <IconUploader 
                    currentIcon={formData.icon} 
                    onUploadComplete={(url) => setFormData({ ...formData, icon: url })} 
                  />

                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <label className="hud-label-tactical text-[10px] text-gray-500">NOME</label>
                      <input 
                        required 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand outline-none"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="hud-label-tactical text-[10px] text-gray-500">RARIDADE</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand outline-none"
                        onChange={(e) => setFormData({...formData, rarity: e.target.value})}
                      >
                        <option value="COMMON">COMMON</option>
                        <option value="RARE">RARE</option>
                        <option value="LEGENDARY">LEGENDARY</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* TRIGGER TYPE SELECTION */}
                <div className="space-y-2">
                  <label className="hud-label-tactical text-[10px] text-gray-500">GATILHO (TRIGGER)</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand outline-none text-brand"
                    onChange={(e) => setFormData({...formData, triggerType: e.target.value, ruleParams: {}})}
                  >
                    <option value="XP_MILESTONE">XP ACUMULADO</option>
                    <option value="HABIT_STREAK">STREAK DE HÁBITO (DIÁRIO)</option>
                    <option value="HABIT_WEEKLY">META SEMANAL (HÁBITO)</option>
                    <option value="MISSION_COUNT">CONTADOR DE MISSÕES</option>
                    <option value="ATTRIBUTE_LEVEL">NÍVEL DE ATRIBUTO</option>
                    <option value="MANUAL">CONCESSÃO MANUAL</option>
                  </select>
                </div>

                {/* DYNAMIC PARAMETERS SECTION */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                  <p className="hud-label-tactical text-[10px] text-brand uppercase">Configuração da Regra</p>
                  
                  {formData.triggerType === "XP_MILESTONE" && (
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 uppercase">XP Necessário</label>
                      <input 
                        type="number" 
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white outline-none" 
                        onChange={(e) => setFormData({...formData, ruleParams: { target: parseInt(e.target.value) }})} 
                      />
                    </div>
                  )}

                  {formData.triggerType === "HABIT_STREAK" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase">Hábito</label>
                          <select 
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white outline-none" 
                            onChange={(e) => setFormData({...formData, ruleParams: { ...formData.ruleParams, habit: e.target.value }})}
                          >
                            <option value="">Selecionar...</option>
                            <option value="Leitura">Leitura</option>
                            <option value="Oração">Oração</option>
                            <option value="Jejum">Jejum</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase">Dias de Streak</label>
                          <input 
                            type="number" placeholder="Ex: 7"
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white outline-none"
                            onChange={(e) => setFormData({...formData, ruleParams: { ...formData.ruleParams, days: parseInt(e.target.value) }})} 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase">Min. Capítulos/Minutos</label>
                          <input 
                            type="number" placeholder="Ex: 3"
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white outline-none"
                            onChange={(e) => setFormData({...formData, ruleParams: { ...formData.ruleParams, minValue: parseInt(e.target.value) }})} 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.triggerType === "HABIT_WEEKLY" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase">Dias no Mês</label>
                          <input 
                            type="number" placeholder="Ex: 4"
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white outline-none"
                            onChange={(e) => setFormData({...formData, ruleParams: { ...formData.ruleParams, monthlyTarget: parseInt(e.target.value) }})} 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase">Horas por Jejum</label>
                          <input 
                            type="number" placeholder="Ex: 12"
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white outline-none"
                            onChange={(e) => setFormData({...formData, ruleParams: { ...formData.ruleParams, minHours: parseInt(e.target.value) }})} 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.triggerType === "MANUAL" && (
                    <p className="text-[10px] text-gray-500 italic">Esta relíquia será concedida manualmente pelo Master.</p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 transition-all"
                  >
                    CANCELAR
                  </button>
                  <button 
                    type="submit" disabled={isProcessing}
                    className="flex-1 px-6 py-3 bg-brand text-white font-bold rounded-xl hover:brightness-110 disabled:opacity-50 transition-all"
                  >
                    {isProcessing ? "FORJANDO..." : "CRIAR RELÍQUIA"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}