"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* CONFIGURATION IMPORTS */
import { ESTRUTURAS, LOVE_LANGUAGES, ICONS } from "@/constants/gameConfig";
import { updateValenteProfile, createValente, deleteValente } from "@/app/actions/valenteActions";
import AvatarUploader from "@/components/game/AvatarUploader";
import { uploadValenteImage } from "@/app/actions/uploadActions";

interface ValenteFormProps {
  initialData?: any;
  mode: "create" | "edit";
}

export default function ValenteForm({ initialData, mode }: ValenteFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // CORE IDENTITY STATE
  const [name, setName] = useState(initialData?.name || "");
  const [structure, setStructure] = useState(initialData?.structure || ESTRUTURAS.GAD.label);
  const [description, setDescription] = useState(initialData?.description || "");
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  // --- LOVE LANGUAGES LOGIC ---
  const defaultLoveLanguages = LOVE_LANGUAGES.reduce((acc, lang) => {
    acc[lang.key] = initialData?.loveLanguages?.[lang.key] ?? 0;
    return acc;
  }, {} as Record<string, number>);
  const [loveLanguages, setLoveLanguages] = useState(defaultLoveLanguages);

  // --- HOLY POWER LOGIC (Synced with Engine v3) ---
  const formatInitialHolyPower = () => {
    const defaultHp = { 
      Oração: { current: 0, goal: 30, streak: 0, unit: 'min', isResetDaily: true },
      Leitura: { current: 0, goal: 1, streak: 0, unit: 'cap', isResetDaily: true },
      Jejum: { current: 0, goal: 12, streak: 0, unit: 'hrs', isResetDaily: false }
    };

    if (!initialData?.holyPower || !Array.isArray(initialData.holyPower)) return defaultHp;

    const formatted: any = { ...defaultHp };
    initialData.holyPower.forEach((hp: any) => {
      if (formatted[hp.name]) {
        formatted[hp.name] = {
          current: hp.current,
          goal: hp.goal,
          streak: hp.streak,
          isResetDaily: hp.isResetDaily ?? formatted[hp.name].isResetDaily,
          unit: formatted[hp.name].unit
        };
      }
    });
    return formatted;
  };
  
  const [holyPower, setHolyPower] = useState(formatInitialHolyPower());

  useEffect(() => {
    if (initialData?.image && initialData.image !== imagePreview) {
      setImagePreview(initialData.image);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleHolyPowerChange = (powerKey: string, field: string, value: string | number | boolean) => {
    setHolyPower((prev: any) => ({
      ...prev,
      [powerKey]: { 
        ...prev[powerKey], 
        [field]: typeof value === 'boolean' ? value : Number(value) 
      }
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("O Valente precisa de um nome de guerra.");
    
    setIsSubmitting(true);

    const payload = {
      name,
      structure,
      description,
      loveLanguages,
      holyPower: Object.entries(holyPower).map(([name, data]: [string, any]) => ({
        name,
        current: data.current,
        goal: data.goal,
        streak: data.streak,
        isResetDaily: data.isResetDaily
      }))
    };

    if (mode === "edit" && initialData?.id) {
      const result = await updateValenteProfile(initialData.id, payload);
      if (result.success) {
        router.push(`/admin/valentes/${initialData.id}`);
        router.refresh();
      } else {
        alert("Falha ao atualizar registro.");
        setIsSubmitting(false);
      }
    } else {
      const result = await createValente(payload);
      
      if (result.success && result.id) {
        const file = fileInputRef.current?.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append("image", file);
          await uploadValenteImage(result.id, formData);
        }
        router.push(`/admin/valentes/${result.id}`);
        router.refresh();
      } else {
        alert("Falha ao recrutar herói.");
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    const confirmed = window.confirm(`ATENÇÃO: Deseja realmente excluir ${name}? Todos os registros de XP e Relíquias serão perdidos.`);
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteValente(initialData.id);
    if (result.success) {
      router.push("/admin/valentes");
      router.refresh();
    } else {
      alert("Erro na operação de exclusão.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700">
      {/* 1. CINEMATIC_HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <Link href={mode === "edit" ? `/admin/valentes/${initialData?.id}` : "/admin/valentes"} className="hud-label-tactical text-brand text-xs hover:pl-2 transition-all flex items-center gap-2 mb-4 italic-none group">
            <span className="group-hover:translate-x-[-4px] transition-transform">←</span> CANCELAR OPERAÇÃO
          </Link>
          <h1 className="hud-title-lg text-6xl text-white m-0 drop-shadow-[0_0_30px_rgba(6,182,212,0.2)] uppercase tracking-tighter">
            {mode === "create" ? "FORJAR VALENTE" : "EDITAR FICHA"}
          </h1>
          <div className="flex gap-4 mt-2">
            <span className="hud-label-tactical text-gray-500 text-[10px] italic-none border border-white/10 px-2 py-0.5 rounded">ID: {initialData?.id?.slice(0,8) || "NEW_UNIT"}</span>
            <span className="hud-label-tactical text-brand text-[10px] italic-none border border-brand/20 px-2 py-0.5 rounded uppercase">Protocolo heroi-v3</span>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          {mode === "edit" && (
            <button 
              type="button" onClick={handleDelete} disabled={isSubmitting || isDeleting}
              className="bg-red-950/20 border border-red-500/30 text-red-500 hud-label-tactical text-sm px-6 py-4 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
            >
              {isDeleting ? "DELETANDO..." : "EXCLUIR REGISTRO"}
            </button>
          )}
          <button 
            onClick={handleSave} disabled={isSubmitting || isDeleting}
            className="flex-1 md:flex-none bg-brand text-white hud-title-md text-2xl px-12 py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "PROCESSANDO..." : (mode === "create" ? "RECRUTAR" : "SALVAR ALTERAÇÕES")}
          </button>
        </div>
      </header>

      {/* 2. IDENTITY_SECTION (#01) */}
      <section className="bg-dark-bg/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl group">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-50"></div>
        <h2 className="hud-title-md text-4xl text-white mb-8 flex items-center gap-4">
          <span className="text-brand text-2xl font-mono">#01</span> 
          IDENTIDADE <div className="h-px flex-1 bg-white/5"></div>
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <label className="hud-label-tactical text-gray-500 text-[10px] italic-none uppercase tracking-[0.2em]">Nome de Guerra</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} 
                className="w-full bg-black/40 border border-white/10 p-5 text-white hud-title-md text-3xl rounded-xl focus:border-brand/60 focus:bg-black/60 outline-none transition-all shadow-inner" 
                placeholder="NOME DO HERÓI" 
              />
            </div>
            
            <div className="space-y-3">
              <label className="hud-label-tactical text-gray-500 text-[10px] italic-none uppercase tracking-[0.2em]">Estrutura (Fração de Combate)</label>
              <div className="relative">
                <select 
                  value={structure} onChange={(e) => setStructure(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 p-5 text-white hud-label-tactical font-bold text-sm rounded-xl focus:border-brand/60 outline-none transition-all appearance-none cursor-pointer pr-12"
                >
                  {Object.values(ESTRUTURAS).map((est) => (
                    <option key={est.label} value={est.label} className="bg-dark-surface text-white">
                      {est.label.toUpperCase()} — {est.fullName.toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-brand/60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="hud-label-tactical text-gray-500 text-[10px] italic-none uppercase tracking-[0.2em]">Crônicas do Valente (Lore)</label>
              <textarea 
                value={description} onChange={(e) => setDescription(e.target.value)} rows={4} 
                className="w-full bg-black/40 border border-white/10 p-5 text-gray-300 font-barlow text-sm rounded-xl focus:border-brand/60 outline-none transition-all resize-none" 
                placeholder="A história de origem deste herói..." 
              />
            </div>
          </div>

          <div className="w-full lg:w-[280px] space-y-4">
            <label className="hud-label-tactical text-gray-500 text-[10px] italic-none uppercase tracking-[0.2em]">Bio-Scan (Retrato)</label>
            
            {mode === "edit" ? (
              <div className="w-full aspect-[3/4] bg-black/60 border border-white/10 rounded-2xl flex items-center justify-center transition-all relative overflow-hidden group shadow-2xl">
                <AvatarUploader 
                    valenteId={initialData.id} 
                    currentImage={imagePreview}
                    onImageUpdated={(newUrl) => setImagePreview(newUrl)} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={`Foto de ${name}`}
                  />
                  <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-brand/40 pointer-events-none"></div>
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-brand/40 pointer-events-none"></div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="w-full aspect-[3/4] bg-black/60 border-2 border-dashed border-white/10 hover:border-brand/40 hover:bg-brand/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group shadow-2xl"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="text-center opacity-40 group-hover:opacity-100 text-brand flex flex-col items-center">
                    {/* ⚔️ UPDATED TO CAMERA-ICON */}
                    <img 
                      src="/images/camera-icon.svg" 
                      alt="Upload Icon" 
                      className="w-14 h-14 mb-4 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                    />
                    <span className="hud-label-tactical text-[10px] italic-none uppercase tracking-widest text-white">Upload Bio-Scan</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-brand/40 pointer-events-none"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-brand/40 pointer-events-none"></div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. SPIRITUAL_PROGRESS (#02) - THE REWORKED ENGINE */}
      <section className="bg-dark-bg/40 border border-white/10 rounded-2xl p-8 relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mission to-transparent opacity-50"></div>
        <h2 className="hud-title-md text-4xl text-white mb-10 flex items-center gap-4">
          <span className="text-mission text-2xl font-mono">#02</span> PODER SANTO
          <div className="h-px flex-1 bg-white/5"></div>
        </h2>
        
        <div className="space-y-6">
          {Object.entries(holyPower).map(([key, data]: [string, any]) => (
            <div key={key} className="bg-black/20 p-8 border border-white/5 rounded-2xl group hover:border-mission/30 transition-all">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <img 
                    src={key === 'Oração' ? ICONS.oracao : key === 'Leitura' ? ICONS.leitura : ICONS.jejum}
                    alt={key}
                    className="w-8 h-8 object-contain brightness-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  />
                  <h3 className="hud-title-md text-2xl text-white uppercase tracking-tight">{key}</h3>
                </div>

                {/* ENGINE BEHAVIOR TOGGLE */}
                <div className="flex items-center gap-3 bg-black/40 p-2 rounded-xl border border-white/5">
                  <span className={`hud-label-tactical text-[9px] uppercase tracking-widest ${data.isResetDaily ? 'text-mission' : 'text-gray-500'}`}>Streak</span>
                  <button
                    type="button"
                    onClick={() => handleHolyPowerChange(key, 'isResetDaily', !data.isResetDaily)}
                    className={`w-12 h-6 rounded-full relative transition-all ${data.isResetDaily ? 'bg-mission/40' : 'bg-amber-500/40'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${data.isResetDaily ? 'left-7 bg-mission' : 'left-1 bg-amber-500'}`} />
                  </button>
                  <span className={`hud-label-tactical text-[9px] uppercase tracking-widest ${!data.isResetDaily ? 'text-amber-500' : 'text-gray-500'}`}>Acumulativo</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* CURRENT PROGRESS */}
                <div className="space-y-3">
                  <label className="hud-label-tactical text-gray-500 text-[10px] uppercase tracking-widest">Progresso Atual</label>
                  <div className="relative flex items-center">
                    <input 
                      type="number" value={data.current} 
                      onChange={(e) => handleHolyPowerChange(key, 'current', e.target.value)} 
                      className={`w-full bg-black/40 border border-white/10 p-4 pr-16 text-white hud-value text-3xl rounded-xl outline-none shadow-inner transition-colors ${data.isResetDaily ? 'focus:border-mission' : 'focus:border-amber-500'}`} 
                    />
                    <span className="absolute right-4 text-gray-600 hud-label-tactical text-[10px] font-bold uppercase pointer-events-none">
                      {data.unit}
                    </span>
                  </div>
                </div>

                {/* MAIN GOAL - DYNAMIC LABEL */}
                <div className="space-y-3">
                  <label className="hud-label-tactical text-[10px] uppercase tracking-widest flex items-center gap-2 text-gray-400">
                    {data.isResetDaily ? (
                      <><span className="text-mission">⚡</span> Objetivo Diário</>
                    ) : (
                      <><span className="text-amber-500">📜</span> Objetivo Total (Acumulativo)</>
                    )}
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type="number" value={data.goal} 
                      onChange={(e) => handleHolyPowerChange(key, 'goal', e.target.value)} 
                      className={`w-full bg-black/40 border border-white/10 p-4 pr-16 text-gray-400 hud-value text-3xl rounded-xl outline-none transition-colors ${data.isResetDaily ? 'focus:border-mission' : 'focus:border-amber-500'}`} 
                    />
                    <span className="absolute right-4 text-gray-600 hud-label-tactical text-[10px] font-bold uppercase pointer-events-none">
                      {data.unit}
                    </span>
                  </div>
                </div>

                {/* STREAK RECORD */}
                <div className="space-y-3">
                  <label className="hud-label-tactical text-xp text-[10px] flex items-center gap-2 uppercase tracking-widest">Sequência (Streak)</label>
                  <div className="relative flex items-center">
                    <input 
                      type="number" value={data.streak} 
                      onChange={(e) => handleHolyPowerChange(key, 'streak', e.target.value)} 
                      className="w-full bg-black/40 border border-xp/20 p-4 pr-16 text-xp hud-value text-3xl rounded-xl focus:border-xp outline-none" 
                    />
                    <span className="absolute right-4 text-xp/40 hud-label-tactical text-[10px] font-bold uppercase pointer-events-none">
                      Dias
                    </span>
                  </div>
                </div>
              </div>

              {/* HELPER TEXT FOR ADMIN */}
              <p className="mt-4 text-[9px] hud-label-tactical text-gray-600 italic uppercase">
                {data.isResetDaily 
                  ? "⚡ MODO STREAK: O objetivo diário deve ser atingido para manter a sequência. Reseta à meia-noite." 
                  : "📜 MODO ACUMULATIVO: O progresso é somado até atingir o objetivo total. Não reseta."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. LOVE_LANGUAGES (#03) */}
      <section className="bg-dark-bg/40 border border-white/10 rounded-2xl p-8 relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <h2 className="hud-title-md text-4xl text-white mb-10 flex items-center gap-4">
          <span className="text-gray-400 text-2xl font-mono">#03</span> LINGUAGENS DE AMOR
          <div className="h-px flex-1 bg-white/5"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LOVE_LANGUAGES.map((lang) => {
            const val = loveLanguages[lang.key] || 0;
            return (
              <div key={lang.key} className="bg-black/20 p-6 border border-white/5 rounded-xl hover:border-white/20 transition-all">
                <div className="flex justify-between items-center mb-6">
                  <label className="hud-label-tactical text-gray-400 text-[10px] italic-none uppercase tracking-widest">{lang.name}</label>
                  <span className="hud-value text-4xl leading-none" style={{ color: lang.colors[0], filter: `drop-shadow(0 0 10px ${lang.colors[0]}44)` }}>{val}</span>
                </div>
                <input 
                  type="range" min="0" max="12" value={val} 
                  onChange={(e) => setLoveLanguages({...loveLanguages, [lang.key]: parseInt(e.target.value)})} 
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-current" 
                  style={{ accentColor: lang.colors[0] }}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}