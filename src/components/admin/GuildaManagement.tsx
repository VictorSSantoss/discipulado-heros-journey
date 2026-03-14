"use client";

import { useState } from "react";
import { updateGuildaIdentity } from "@/app/actions/userActions";

export default function GuildaManagement({ 
  userId, 
  currentName,
  currentIcon
}: { 
  userId: string; 
  currentName: string;
  currentIcon: string;
}) {
  const [name, setName] = useState(currentName || "");
  
  // Initializes the icon state with the database value or a default image path from the public folder
  const [icon, setIcon] = useState(currentIcon || "/images/ranking-icon.svg");
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Submits the updated text and image path identifiers to the server action
  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    
    const result = await updateGuildaIdentity(userId, name, icon);
    
    if (result.success) {
      setMessage("Identidade da guilda atualizada com sucesso.");
    } else {
      setMessage("Erro ao salvar alterações.");
    }
    setIsSaving(false);
  };

  return (
    <div className="bg-dark-bg/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-4 bg-brand rounded-full"></div>
        <h3 className="hud-label-tactical text-gray-400 text-[12px] uppercase tracking-widest">Identidade do Discipulado</h3>
      </div>
      
      <div className="space-y-4">
        {/* Renders an image preview alongside a text input for the file path */}
        <div className="space-y-2">
          <label className="hud-label-tactical text-[10px] text-gray-500 uppercase">Brasão da Guilda (Caminho da Imagem)</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-black/40 border border-white/10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
              {icon ? (
                <img src={icon} alt="Brasão" className="w-full h-full object-contain" />
              ) : (
                <span className="text-[10px] text-gray-600 uppercase">Vazio</span>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <input 
                type="text" 
                value={icon} 
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-brand/60 transition-all"
                placeholder="Ex: /images/guilda-temporary.svg"
              />
              <span className="hud-label-tactical text-[9px] text-gray-500 uppercase">
                Insira o caminho da imagem presente na pasta public/images.
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="hud-label-tactical text-[10px] text-gray-500 uppercase">Nome da Guilda / Grupo</label>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-brand/60 transition-all uppercase"
              placeholder="Ex: Guerreiros da Alvorada"
            />
            <button 
              onClick={handleSave} disabled={isSaving}
              className="bg-brand text-dark-bg px-8 py-4 rounded-xl hud-label-tactical uppercase font-bold hover:brightness-110 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(17,194,199,0.2)]"
            >
              {isSaving ? "Gravando..." : "Atualizar"}
            </button>
          </div>
          {message && (
            <p className="text-[10px] text-brand uppercase tracking-tighter mt-2 animate-pulse">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}