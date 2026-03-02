"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* CONFIGURATION IMPORTS */
import { ESTRUTURAS, BASE_ATTRIBUTES, LOVE_LANGUAGES, ICONS } from "@/constants/gameConfig";

interface ValenteFormProps {
  initialData?: any;
  mode: "create" | "edit";
}

export default function ValenteForm({ initialData, mode }: ValenteFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  /* STATE_MANAGEMENT */
  const [name, setName] = useState(initialData?.name || "");
  const [structure, setStructure] = useState(initialData?.structure || ESTRUTURAS.GAD.label);
  const [description, setDescription] = useState(initialData?.description || "");
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const defaultSkills = BASE_ATTRIBUTES.reduce((acc, attr) => {
    acc[attr] = 5;
    return acc;
  }, {} as Record<string, number>);
  const [skills, setSkills] = useState(initialData?.skills || defaultSkills);

  const defaultLoveLanguages = LOVE_LANGUAGES.reduce((acc, lang) => {
    acc[lang.key] = 0;
    return acc;
  }, {} as Record<string, number>);
  const [loveLanguages, setLoveLanguages] = useState(initialData?.loveLanguages || defaultLoveLanguages);

  const [holyPower, setHolyPower] = useState(initialData?.holyPower || { 
    Oração: { current: 0, goal: 7, streak: 0, unit: 'dias' },
    Leitura: { current: 0, goal: 5, streak: 0, unit: 'capítulos' },
    Jejum: { current: 0, goal: 1, streak: 0, unit: 'dia' }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleHolyPowerChange = (powerKey: string, field: string, value: string | number) => {
    setHolyPower((prev: any) => ({
      ...prev,
      [powerKey]: { ...prev[powerKey], [field]: field === 'unit' ? value : Number(value) }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(mode === "create" ? "Herói recrutado!" : "Ficha atualizada!");
    router.push('/admin/valentes');
  };

  return (
    <div className="space-y-12 pb-32">
      
      {/* 1. CINEMATIC_HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <Link href="/admin/valentes" className="hud-label-tactical text-brand text-xs hover:brightness-125 transition-all flex items-center gap-2 mb-4 italic-none">
            ← CANCELAR OPERAÇÃO
          </Link>
          <h1 className="hud-title-lg text-6xl text-white m-0 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            {mode === "create" ? "FORJAR VALENTE" : "EDITAR FICHA"}
          </h1>
          <p className="hud-label-tactical text-gray-400 mt-2 italic-none">
            CONFIGURAÇÃO DE PERFIL DE COMBATE
          </p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-brand text-white hud-title-md text-3xl px-12 py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 transition-all"
        >
          {mode === "create" ? "RECRUTAR" : "SALVAR ALTERAÇÕES"}
        </button>
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
              <label className="hud-label-tactical text-gray-400 italic-none">NOME DE GUERRA</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} 
                className="w-full bg-black/40 border border-white/20 p-4 text-white hud-title-md text-3xl rounded-xl focus:border-brand outline-none transition-all shadow-inner" 
                placeholder="EX: CADU" 
              />
            </div>
            
            <div className="space-y-3 relative">
              <label className="hud-label-tactical text-gray-400 italic-none">ESTRUTURA (FRAÇÃO)</label>
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
                {/* CUSTOM_ARROW: Ensures dropdown visibility */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand text-xl">
                  ▼
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="hud-label-tactical text-gray-400 italic-none">CRÔNICAS DO VALENTE (LORE)</label>
              <textarea 
                value={description} onChange={(e) => setDescription(e.target.value)} rows={4} 
                className="w-full bg-black/40 border border-white/20 p-4 text-gray-200 font-barlow text-sm rounded-xl focus:border-brand outline-none transition-all resize-none shadow-inner" 
                placeholder="A história de origem deste herói..." 
              />
            </div>
          </div>

          <div className="w-full lg:w-[260px] space-y-4">
            <label className="hud-label-tactical text-gray-400 italic-none">RETRATO DO HERÓI</label>
            <div 
              onClick={() => fileInputRef.current?.click()} 
              className="w-full aspect-[3/4] bg-black/60 border-2 border-dashed border-white/20 hover:border-brand/60 rounded-2xl flex items-center justify-center cursor-pointer transition-all relative overflow-hidden group shadow-2xl"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="text-center opacity-40 group-hover:opacity-100 transition-all">
                  <span className="text-6xl block mb-2">📷</span>
                  <span className="hud-label-tactical text-xs italic-none">UPLOAD BIO-SCAN</span>
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
          <span className="hud-label-tactical text-mission font-bold text-xs italic-none">DISCIPLINAS ESPIRITUAIS</span>
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
                <div className="space-y-3">
                  <label className="hud-label-tactical text-gray-400 italic-none">PROG. ATUAL</label>
                  <input 
                    type="number" value={data.current} 
                    onChange={(e) => handleHolyPowerChange(key, 'current', e.target.value)} 
                    className="w-full bg-black/40 border border-white/20 p-4 text-white hud-value text-4xl rounded-xl focus:border-mission outline-none shadow-inner" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="hud-label-tactical text-gray-500 italic-none">META SEMANAL</label>
                  <input 
                    type="number" value={data.goal} 
                    onChange={(e) => handleHolyPowerChange(key, 'goal', e.target.value)} 
                    className="w-full bg-black/40 border border-white/20 p-4 text-gray-400 hud-value text-4xl rounded-xl focus:border-mission outline-none shadow-inner" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="hud-label-tactical text-xp italic-none flex items-center gap-2">
                    STREAK <img src={ICONS.xp} className="w-4 h-4" alt="xp" />
                  </label>
                  <input 
                    type="number" value={data.streak} 
                    onChange={(e) => handleHolyPowerChange(key, 'streak', e.target.value)} 
                    className="w-full bg-black/40 border border-xp/40 p-4 text-xp hud-value text-4xl rounded-xl focus:border-xp outline-none shadow-[0_0_15px_rgba(234,88,12,0.15)]" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="hud-label-tactical text-gray-500 italic-none">UNIDADE</label>
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
          {Object.entries(skills).map(([key, value]) => (
            <div key={key} className="bg-black/20 p-6 border border-white/10 rounded-xl group hover:border-xp transition-all shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <label className="hud-label-tactical text-gray-400 italic-none">{key}</label>
                <span className="hud-value text-4xl text-xp drop-shadow-[0_0_15px_rgba(234,88,12,0.7)]">{value as number}</span>
              </div>
              <input 
                type="range" min="0" max="10" value={value as number} 
                onChange={(e) => setSkills({...skills, [key]: parseInt(e.target.value)})} 
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
                  <label className="hud-label-tactical text-gray-400 italic-none">{lang.name}</label>
                  {/* NUMERIC_GLOW: Matches the Atributos Base effect */}
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