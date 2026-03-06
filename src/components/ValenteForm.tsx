"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* CONFIGURATION IMPORTS */
import { ESTRUTURAS, BASE_ATTRIBUTES, LOVE_LANGUAGES, ICONS } from "@/constants/gameConfig";
import { updateValenteProfile, createValente, deleteValente } from "@/app/actions/valenteActions";

interface ValenteFormProps {
  initialData?: any;
  mode: "create" | "edit";
}

/**
 * ValenteForm Component
 * Renders the primary interface for hero record creation and record modification.
 * Manages complex mappings between the ministry-style UI and the RPG stat database schema.
 */
export default function ValenteForm({ initialData, mode }: ValenteFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  /* FINAL_ATTRIBUTE_REGISTRY */
  const ministrySkills = ["Liderança", "Trabalho em Equipe", "Evangelismo", "Servo", "Mestre", "Profeta"];

  /* RPG_TO_MINISTRY_MAPPING */
  const rpgToMinistryMap: Record<string, string> = {
    forca: "Liderança",
    constituicao: "Trabalho em Equipe",
    carisma: "Evangelismo",
    destreza: "Servo",
    inteligencia: "Mestre",
    sabedoria: "Profeta"
  };

  /* STATE_MANAGEMENT: INITIALIZATION */
  const [name, setName] = useState(initialData?.name || "");
  const [structure, setStructure] = useState(initialData?.structure || ESTRUTURAS.GAD.label);
  const [description, setDescription] = useState(initialData?.description || "");
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const defaultSkills = ministrySkills.reduce((acc, skill) => {
    const rpgKey = Object.keys(rpgToMinistryMap).find(key => rpgToMinistryMap[key] === skill);
    acc[skill] = initialData?.attributes?.[rpgKey as string] ?? 5;
    return acc;
  }, {} as Record<string, number>);
  const [skills, setSkills] = useState(defaultSkills);

  const defaultLoveLanguages = LOVE_LANGUAGES.reduce((acc, lang) => {
    acc[lang.key] = initialData?.loveLanguages?.[lang.key] ?? 0;
    return acc;
  }, {} as Record<string, number>);
  const [loveLanguages, setLoveLanguages] = useState(defaultLoveLanguages);

  const formatInitialHolyPower = () => {
    const defaultHp = { 
      Oração: { current: 0, goal: 7, streak: 0, unit: 'dias' },
      Leitura: { current: 0, goal: 5, streak: 0, unit: 'capítulos' },
      Jejum: { current: 0, goal: 1, streak: 0, unit: 'dia' }
    };
    if (!initialData?.holyPower || !Array.isArray(initialData.holyPower)) return defaultHp;
    const formatted: any = { ...defaultHp };
    initialData.holyPower.forEach((hp: any) => {
      if (formatted[hp.name]) {
        formatted[hp.name] = {
          current: hp.current,
          goal: hp.goal,
          streak: hp.streak,
          unit: hp.name === 'Oração' ? 'dias' : hp.name === 'Leitura' ? 'capítulos' : 'dia'
        };
      }
    });
    return formatted;
  };
  const [holyPower, setHolyPower] = useState(formatInitialHolyPower());

  /* IMAGE_HANDLING */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  /* HOLY_POWER */
  const handleHolyPowerChange = (powerKey: string, field: string, value: string | number) => {
    setHolyPower((prev: any) => ({
      ...prev,
      [powerKey]: { ...prev[powerKey], [field]: field === 'unit' ? value : Number(value) }
    }));
  };

  /* FORM_SUBMISSION: Orchestrates transactional update or creation protocol. */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      structure,
      description,
      attributes: skills, 
      loveLanguages,
      holyPower: Object.entries(holyPower).map(([name, data]: [string, any]) => ({
        name,
        current: data.current,
        goal: data.goal,
        streak: data.streak
      }))
    };

    if (mode === "edit" && initialData?.id) {
      const result = await updateValenteProfile(initialData.id, payload);
      if (result.success) {
        router.push(`/admin/valentes/${initialData.id}`);
        router.refresh();
      } else {
        alert("Falha ao salvar alterações.");
        setIsSubmitting(false);
      }
    } else {
      const result = await createValente(payload);
      if (result.success && result.id) {
        router.push(`/admin/valentes/${result.id}`);
        router.refresh();
      } else {
        alert("Falha ao recrutar herói.");
        setIsSubmitting(false);
      }
    }
  };

  /* DELETION_PROTOCOL: Permanently removes the record. */
  const handleDelete = async () => {
    if (!initialData?.id) return;
    
    // Safety check
    const confirmed = window.confirm(`ATENÇÃO: Deseja realmente excluir o registro de ${name}? Esta ação não pode ser desfeita.`);
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteValente(initialData.id);
    
    if (result.success) {
      router.push("/admin/valentes");
      router.refresh();
    } else {
      alert("Erro ao excluir. O banco de dados bloqueou a operação.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-12 pb-32">
      {/* 1. CINEMATIC_HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <Link href={mode === "edit" ? `/admin/valentes/${initialData?.id}` : "/admin/valentes"} className="hud-label-tactical text-brand text-xs hover:brightness-125 transition-all flex items-center gap-2 mb-4 italic-none">
            ← CANCELAR OPERAÇÃO
          </Link>
          <h1 className="hud-title-lg text-6xl text-white m-0 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            {mode === "create" ? "FORJAR VALENTE" : "EDITAR FICHA"}
          </h1>
          <p className="hud-label-tactical text-gray-400 mt-2 italic-none uppercase tracking-widest">
            Configuração de Perfil de Combate
          </p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto mt-4 md:mt-0">
          {mode === "edit" && (
            <button 
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
              className="bg-red-950/40 border border-red-500/30 text-red-500 hud-title-md text-xl md:text-2xl px-8 py-4 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
            >
              {isDeleting ? "EXCLUINDO..." : "EXCLUIR"}
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={isSubmitting || isDeleting}
            className="flex-1 md:flex-none bg-brand text-white hud-title-md text-2xl md:text-3xl px-12 py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "PROCESSANDO..." : (mode === "create" ? "RECRUTAR" : "SALVAR")}
          </button>
        </div>
      </header>

      {/* 2. IDENTITY_SECTION (#01) */}
      <section className="bg-dark-bg/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand to-transparent"></div>
        <h2 className="hud-title-md text-4xl text-white mb-8">
          <span className="text-brand">#01</span> IDENTIDADE
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <label className="hud-label-tactical text-gray-400 italic-none uppercase tracking-widest">Nome de Guerra</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} 
                className="w-full bg-black/40 border border-white/20 p-4 text-white hud-title-md text-3xl rounded-xl focus:border-brand outline-none transition-all shadow-inner" 
                placeholder="EX: CADU" 
              />
            </div>
            
            <div className="space-y-3 relative">
              <label className="hud-label-tactical text-gray-400 italic-none uppercase tracking-widest">Estrutura (Fração)</label>
              <div className="relative">
                <select 
                  value={structure} onChange={(e) => setStructure(e.target.value)} 
                  className="w-full bg-black/40 border border-white/20 p-4 text-white hud-label-tactical font-bold text-sm rounded-xl focus:border-brand outline-none transition-all appearance-none cursor-pointer pr-12 shadow-inner"
                >
                  {Object.values(ESTRUTURAS).map((est) => (
                    <option key={est.label} value={est.label} className="bg-dark-surface text-white">
                      {est.label.toUpperCase()} — {est.fullName.toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-100">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="hud-label-tactical text-gray-400 italic-none uppercase tracking-widest">Crônicas do Valente (Lore)</label>
              <textarea 
                value={description} onChange={(e) => setDescription(e.target.value)} rows={4} 
                className="w-full bg-black/40 border border-white/20 p-4 text-gray-200 font-barlow text-sm rounded-xl focus:border-brand outline-none transition-all resize-none shadow-inner" 
                placeholder="A história de origem deste herói..." 
              />
            </div>
          </div>

          <div className="w-full lg:w-[260px] space-y-4">
            <label className="hud-label-tactical text-gray-400 italic-none uppercase tracking-widest">Retrato do Herói</label>
            <div 
              onClick={() => fileInputRef.current?.click()} 
              className="w-full aspect-[3/4] bg-black/60 border-2 border-dashed border-white/20 hover:border-brand/60 rounded-2xl flex items-center justify-center cursor-pointer transition-all relative overflow-hidden group shadow-2xl"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="text-center opacity-40 group-hover:opacity-100 transition-all">
                  <span className="text-6xl block mb-2">📷</span>
                  <span className="hud-label-tactical text-xs italic-none uppercase tracking-widest">Upload Bio-Scan</span>
                </div>
              )}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-brand"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-brand"></div>
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          </div>
        </div>
      </section>

      {/* 3. SPIRITUAL_PROGRESS (#02) */}
      <section className="bg-dark-bg/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mission to-transparent"></div>
        <div className="flex justify-between items-end mb-10">
          <h2 className="hud-title-md text-4xl text-white m-0">
            <span className="text-mission">#02</span> PODER SANTO
          </h2>
          <span className="hud-label-tactical text-mission font-bold text-xs italic-none uppercase tracking-widest">Disciplinas Espirituais</span>
        </div>
        
        <div className="space-y-6">
          {Object.entries(holyPower).map(([key, data]: [string, any]) => (
            <div key={key} className="bg-black/20 p-8 border border-white/10 rounded-2xl group hover:border-mission transition-all shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <img 
                  src={key === 'Oração' ? ICONS.oracao : key === 'Leitura' ? ICONS.leitura : ICONS.jejum}
                  alt={key}
                  className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                />
                <h3 className="hud-title-md text-3xl text-white">{key}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                
                {/* PROG. ATUAL with tactical arrows */}
                <div className="space-y-3">
                  <label className="hud-label-tactical text-gray-400 italic-none uppercase tracking-widest">Prog. Atual</label>
                  <div className="relative flex items-center">
                    <input 
                      type="number" value={data.current} 
                      onChange={(e) => handleHolyPowerChange(key, 'current', e.target.value)} 
                      className="w-full bg-black/40 border border-white/20 p-4 pr-16 text-white hud-value text-4xl rounded-xl focus:border-mission outline-none shadow-inner [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]" 
                    />
                    <div className="absolute top-0 right-0 h-full w-12 flex flex-col border-l border-white/10">
                      <button type="button" onClick={() => handleHolyPowerChange(key, 'current', Number(data.current) + 1)} className="flex-1 text-mission hover:bg-mission hover:text-white w-full flex items-center justify-center rounded-tr-xl border-b border-white/10 transition-colors text-[10px]">▲</button>
                      <button type="button" onClick={() => handleHolyPowerChange(key, 'current', Math.max(0, Number(data.current) - 1))} className="flex-1 text-mission hover:bg-mission hover:text-white w-full flex items-center justify-center rounded-br-xl transition-colors text-[10px]">▼</button>
                    </div>
                  </div>
                </div>

                {/* META SEMANAL with tactical arrows */}
                <div className="space-y-3">
                  <label className="hud-label-tactical text-gray-500 italic-none uppercase tracking-widest">Meta Semanal</label>
                  <div className="relative flex items-center">
                    <input 
                      type="number" value={data.goal} 
                      onChange={(e) => handleHolyPowerChange(key, 'goal', e.target.value)} 
                      className="w-full bg-black/40 border border-white/20 p-4 pr-16 text-gray-400 hud-value text-4xl rounded-xl focus:border-mission outline-none shadow-inner [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]" 
                    />
                    <div className="absolute top-0 right-0 h-full w-12 flex flex-col border-l border-white/10">
                      <button type="button" onClick={() => handleHolyPowerChange(key, 'goal', Number(data.goal) + 1)} className="flex-1 text-mission hover:bg-mission hover:text-white w-full flex items-center justify-center rounded-tr-xl border-b border-white/10 transition-colors text-[10px]">▲</button>
                      <button type="button" onClick={() => handleHolyPowerChange(key, 'goal', Math.max(0, Number(data.goal) - 1))} className="flex-1 text-mission hover:bg-mission hover:text-white w-full flex items-center justify-center rounded-br-xl transition-colors text-[10px]">▼</button>
                    </div>
                  </div>
                </div>

                {/* STREAK with tactical arrows (XP Color Theme) */}
                <div className="space-y-3">
                  <label className="hud-label-tactical text-xp italic-none flex items-center gap-2 uppercase tracking-widest">
                    STREAK <img src={ICONS.xp} className="w-4 h-4" alt="xp" />
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type="number" value={data.streak} 
                      onChange={(e) => handleHolyPowerChange(key, 'streak', e.target.value)} 
                      className="w-full bg-black/40 border border-xp/40 p-4 pr-16 text-xp hud-value text-4xl rounded-xl focus:border-xp outline-none shadow-[0_0_15px_rgba(234,88,12,0.15)] [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]" 
                    />
                    <div className="absolute top-0 right-0 h-full w-12 flex flex-col border-l border-xp/20">
                      <button type="button" onClick={() => handleHolyPowerChange(key, 'streak', Number(data.streak) + 1)} className="flex-1 text-xp hover:bg-xp hover:text-white w-full flex items-center justify-center rounded-tr-xl border-b border-xp/20 transition-colors text-[10px]">▲</button>
                      <button type="button" onClick={() => handleHolyPowerChange(key, 'streak', Math.max(0, Number(data.streak) - 1))} className="flex-1 text-xp hover:bg-xp hover:text-white w-full flex items-center justify-center rounded-br-xl transition-colors text-[10px]">▼</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="hud-label-tactical text-gray-500 italic-none uppercase tracking-widest">UNIDADE</label>
                  <input 
                    type="text" value={data.unit} 
                    onChange={(e) => handleHolyPowerChange(key, 'unit', e.target.value)} 
                    className="w-full bg-black/40 border border-white/20 p-4 text-gray-400 hud-label-tactical text-sm rounded-xl focus:border-mission outline-none shadow-inner" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ATTRIBUTES (#03) */}
      <section className="bg-dark-bg/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-xp to-transparent"></div>
        <h2 className="hud-title-md text-4xl text-white mb-8">
          <span className="text-xp">#03</span> ATRIBUTOS BASE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ministrySkills.map((skill) => (
            <div key={skill} className="bg-black/20 p-6 border border-white/10 rounded-xl group hover:border-xp transition-all shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <label className="hud-label-tactical text-gray-400 italic-none uppercase tracking-widest">{skill}</label>
                <span className="hud-value text-4xl text-xp drop-shadow-[0_0_15px_rgba(234,88,12,0.7)]">{skills[skill]}</span>
              </div>
              <input 
                type="range" min="0" max="10" value={skills[skill]} 
                onChange={(e) => setSkills({...skills, [skill]: parseInt(e.target.value)})} 
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-xp" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* 5. LOVE_LANGUAGES (#04) */}
      <section className="bg-dark-bg/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        <h2 className="hud-title-md text-4xl text-white mb-8">
          <span className="text-gray-400">#04</span> LINGUAGENS DE AMOR
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LOVE_LANGUAGES.map((lang) => {
            const val = loveLanguages[lang.key] || 0;
            return (
              <div key={lang.key} className="bg-black/20 p-6 border border-white/10 rounded-xl group hover:border-white/40 transition-all shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <label className="hud-label-tactical text-gray-400 italic-none uppercase tracking-widest">{lang.name}</label>
                  <span 
                    className="hud-value text-4xl leading-none" 
                    style={{ 
                        color: lang.colors[0],
                        filter: `drop-shadow(0 0 15px ${lang.colors[0]}88)` 
                    }}
                  >
                    {val}
                  </span>
                </div>
                <input 
                  type="range" min="0" max="12" value={val} 
                  onChange={(e) => setLoveLanguages({...loveLanguages, [lang.key]: parseInt(e.target.value)})} 
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer" 
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