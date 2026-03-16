"use client";

import { useState, useRef } from "react";
import { updateGuildaIdentity } from "@/app/actions/userActions";
import { ICONS } from "@/constants/gameConfig";

export default function GuildaManagement({ 
  userId, 
  currentName,
  currentIcon
}: { 
  userId: string; 
  currentName: string;
  currentIcon: string;
}) {
  /* Component state definitions including name, icon source, scale factor, and interface modes */
  const [name, setName] = useState(currentName || "");
  const [icon, setIcon] = useState(currentIcon || "/images/ranking-icon.svg");
  const [scale, setScale] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isClipping = scale > 2.15;

  /* Function triggers the hidden file input when editing mode is active */
  const handleTriggerUpload = () => isEditing && fileInputRef.current?.click();

  /* Logic to convert selected local image file to a base64 string for immediate preview */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setIcon(reader.result as string); setScale(1); };
      reader.readAsDataURL(file);
    }
  };

  /* Method for rendering the scaled image onto an off-screen canvas to produce standardized output */
  const generateScaledBase64 = async (base64Src: string, currentScale: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 512;
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(base64Src);
        ctx.clearRect(0, 0, size, size);
        const bScale = Math.min(size / img.width, size / img.height);
        const finalScale = bScale * currentScale;
        const w = img.width * finalScale; const h = img.height * finalScale;
        const x = (size - w) / 2; const y = (size - h) / 2;
        ctx.drawImage(img, x, y, w, h);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = base64Src;
    });
  };

  /* Asynchronous handler for saving updated guild information to the server */
  const handleSave = async () => {
    setIsSaving(true);
    const finalIconBase64 = await generateScaledBase64(icon, scale);
    const result = await updateGuildaIdentity(userId, name, finalIconBase64);
    if (result.success) {
      setIcon(finalIconBase64);
      setScale(1);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    setIsSaving(false);
  };

  return (
    <div className={`bg-[#08090a] border transition-all duration-700 p-8 rounded-2xl shadow-2xl relative overflow-hidden ${isEditing ? 'border-brand/30' : 'border-white/5'}`}>
      
      {/* Visual notification displayed upon successful data update */}
      {showSuccess && (
        <div className="absolute inset-0 z-50 bg-brand/20 backdrop-blur-md flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
           <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(17,194,199,0.6)]">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="black" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                 </svg>
              </div>
              <span className="hud-title-md text-brand text-sm tracking-widest">SINCRONIZAÇÃO COMPLETA</span>
           </div>
        </div>
      )}

      {/* Header section containing the operational mode and edit controls */}
      <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner overflow-hidden">
             <img src="/images/shield.svg" className="w-8 h-8 object-contain brightness-125" alt="Kingdom" />
          </div>
          <div>
            <h3 className="hud-title-md text-2xl text-white m-0 tracking-widest">IDENTIDADE DO REINO</h3>
            <p className="hud-label-tactical mt-1 text-gray-500 text-[10px]">
              {isEditing ? "PROTOCOLO DE CONFIGURAÇÃO ATIVO" : "RESUMO DE INSÍGNIA"}
            </p>
          </div>
        </div>
        
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="group bg-white/5 hover:bg-brand/10 border border-white/10 hover:border-brand/40 px-6 py-2.5 rounded-lg hud-label-tactical text-[10px] text-gray-400 hover:text-brand transition-all flex items-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:rotate-12 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            EDITAR IDENTIDADE
          </button>
        )}
      </div>

      <div className="relative z-10">
        {isEditing ? (
          /* Input interface for modifying name and crest dimensions */
          <div className="flex flex-col lg:flex-row gap-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-6 p-6 bg-black/40 border border-brand/20 rounded-xl shrink-0 w-full lg:w-80 shadow-inner">
              <div className="flex flex-col items-center gap-5">
                <div className={`relative w-48 h-48 bg-black border rounded-lg overflow-hidden flex items-center justify-center shadow-2xl ${isClipping ? 'border-red-500/50' : 'border-brand/40'}`}>
                  <div className={`absolute inset-0 border-2 z-30 pointer-events-none ${isClipping ? 'border-red-500 animate-pulse' : 'border-brand/30'}`} />
                  <img src={icon} className="w-full h-full object-contain relative z-10" style={{ transform: `scale(${scale})` }} alt="" />
                </div>
                <button onClick={handleTriggerUpload} className="w-full bg-brand/5 border border-brand/20 text-brand py-3 rounded-lg hud-label-tactical text-[11px] hover:bg-brand/10 transition-all">
                  ALTERAR IMAGEM
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="hud-label-tactical text-[10px] text-gray-500 uppercase">Ajuste de Zoom</label>
                  <span className={`hud-label-tactical text-[11px] font-black ${isClipping ? 'text-red-500' : 'text-brand'}`}>{Math.round(scale * 100)}%</span>
                </div>
                <input type="range" min="0.5" max="2.5" step="0.05" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full accent-brand h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer" />
                <p className={`hud-label-tactical text-[11px] font-black leading-tight lowercase tracking-widest ${isClipping ? 'text-red-400' : 'text-brand/80'}`}>
                  {isClipping ? "AVISO: CORTE DETECTADO." : "Maximize o brasão até as bordas, sem cruzar a linha de limite para evitar cortes."}
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <label className="hud-label-tactical text-[11px] text-brand uppercase font-black tracking-widest">Designação da Guilda</label>
                <input 
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 p-6 rounded-xl text-white font-barlow text-2xl uppercase tracking-[0.2em] outline-none focus:border-brand/60 transition-all shadow-inner"
                />
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={handleSave} disabled={isSaving} className="flex-1 bg-brand text-black py-4 rounded-xl hud-label-tactical text-[12px] font-black hover:brightness-110 shadow-[0_0_20px_rgba(17,194,199,0.3)]">
                  {isSaving ? "PROCESSANDO..." : "SALVAR ALTERAÇÕES"}
                </button>
                <button onClick={() => { setIsEditing(false); setName(currentName); setIcon(currentIcon); }} className="px-10 bg-white/5 text-gray-400 rounded-xl hud-label-tactical text-[10px] hover:bg-white/10">
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Presentation view highlighting the active guild branding and designation */
          <div className="flex flex-col md:flex-row items-center gap-16 py-12 px-10 animate-in fade-in zoom-in-95 duration-700">
            {/* Display container for the guild crest with atmospheric light effect */}
            <div className="relative flex-shrink-0">
               {/* Enhanced background light field using organic drift animation with increased opacity and blur radius */}
               <div className="absolute -inset-20 bg-brand/30 blur-[80px] rounded-full pointer-events-none animate-glow-drift" />
               
               <div className="relative w-64 h-64 flex items-center justify-center">
                  <div className="absolute -inset-6 border border-white/5 rounded-full rotate-45" />
                  <div className="absolute inset-0 border border-white/10 rounded-full -rotate-12 animate-pulse" />
                  
                  {/* The Actual Insignia container with updated colored drop shadow */}
                  <div className="w-44 h-44 relative z-10 drop-shadow-[0_0_30px_rgba(17,194,199,0.25)]">
                    <img src={icon} className="w-full h-full object-contain" alt="Guild Crest" />
                  </div>
               </div>
            </div>

            {/* Guild Name Block containing primary name and technical operational status */}
            <div className="flex flex-col text-center md:text-left">
              <p className="hud-label-tactical text-brand text-sm tracking-[0.3em] mb-3 drop-shadow-[0_0_10px_rgba(17,194,199,0.3)]">
                GUILDA OFICIAL
              </p>
              <h1 className="hud-title-lg text-6xl md:text-8xl text-white leading-[0.9] drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                {name || "SEM NOME"}
              </h1>
              <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-5">
                 <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-full hud-label-tactical text-[10px] text-gray-400">
                    STATUS: SINCRONIZADO
                 </div>
                 <div className="px-5 py-2 bg-brand/5 border border-brand/20 rounded-full hud-label-tactical text-[10px] text-brand">
                    REINO: HEROES JOURNEY
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}