"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ValenteFormProps {
  initialData?: any;
  mode: "create" | "edit";
}

export default function ValenteForm({ initialData, mode }: ValenteFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // FORM STATE
  const [name, setName] = useState(initialData?.name || "");
  const [structure, setStructure] = useState(initialData?.structure || "GAD");
  const [description, setDescription] = useState(initialData?.description || "");
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const [skills, setSkills] = useState(initialData?.skills || {
    Liderança: 5, TrabalhoEmEquipe: 5, Criatividade: 5, ResoluçãoDeProblemas: 5, Comunicação: 5
  });

  // THE NEW HOLY POWER STATE (Habit Tracker Format)
  const [holyPower, setHolyPower] = useState(initialData?.holyPower || { 
    Oração: { current: 0, goal: 7, streak: 0, unit: 'dias' },
    Leitura: { current: 0, goal: 5, streak: 0, unit: 'capítulos' },
    Jejum: { current: 0, goal: 1, streak: 0, unit: 'dia' }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Helper to cleanly update the complex habit objects
  const handleHolyPowerChange = (powerKey: string, field: string, value: string | number) => {
    setHolyPower((prev: any) => ({
      ...prev,
      [powerKey]: {
        ...prev[powerKey],
        [field]: field === 'unit' ? value : Number(value)
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(mode === "create" ? "Herói recrutado!" : "Ficha atualizada!");
    router.push('/admin/valentes');
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER SECTION */}
      <header className="w-full bg-[#232622] border border-gray-700 p-4 rounded-sm flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/admin/valentes" className="text-gray-400 hover:text-[#ea580c] font-barlow font-bold uppercase tracking-widest text-sm transition-colors">
            ← Cancelar
          </Link>
          <div className="h-6 w-px bg-gray-700"></div>
          <span className="font-bebas text-xl text-[#ea580c] tracking-widest uppercase">
            {mode === "create" ? "Forjar Novo Valente" : "Editar Ficha"}
          </span>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#ea580c] text-white font-barlow font-bold px-8 py-2 rounded-sm uppercase text-sm shadow-lg hover:bg-[#c2410c] transition-all"
        >
          {mode === "create" ? "Recrutar" : "Salvar Alterações"}
        </button>
      </header>

      {/* IDENTITY & PORTRAIT */}
      <section className="bg-[#1a1c19] border border-gray-800 p-8 rounded-sm shadow-xl">
        <h2 className="font-bebas text-3xl text-white tracking-widest mb-8 border-b border-gray-700 pb-2">Identidade</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-barlow text-gray-400 font-bold uppercase tracking-widest text-xs">Nome de Guerra</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} 
                className="bg-[#232622] border border-gray-700 p-3 text-white font-barlow text-lg rounded-sm focus:border-[#ea580c] outline-none transition-colors w-full" 
                placeholder="Ex: CADU" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-barlow text-gray-400 font-bold uppercase tracking-widest text-xs">Estrutura (Fração)</label>
              <select 
                value={structure} onChange={(e) => setStructure(e.target.value)} 
                className="bg-[#232622] border border-gray-700 p-3 text-white font-barlow text-lg rounded-sm focus:border-[#ea580c] outline-none transition-colors w-full"
              >
                <option value="GAD">GAD (Geração de Adoradores)</option>
                <option value="Mídia">Mídia e Comunicação</option>
                <option value="Louvor">Louvor e Artes</option>
                <option value="Intercessão">Intercessão</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-barlow text-gray-400 font-bold uppercase tracking-widest text-xs">Lore do Personagem (Opcional)</label>
              <textarea 
                value={description} onChange={(e) => setDescription(e.target.value)} rows={4} 
                className="bg-[#232622] border border-gray-700 p-3 text-white font-barlow text-sm rounded-sm focus:border-[#ea580c] outline-none transition-colors w-full resize-none" 
                placeholder="A história de origem deste herói..." 
              />
            </div>
          </div>

          <div className="w-full lg:w-[260px] flex flex-col items-center gap-4">
            <label className="font-barlow text-gray-400 font-bold uppercase tracking-widest text-xs w-full text-left">Retrato do Herói</label>
            <div 
              onClick={() => fileInputRef.current?.click()} 
              className="w-full aspect-[3/4] bg-[#232622] border-2 border-dashed border-gray-700 hover:border-[#ea580c] rounded-sm flex items-center justify-center cursor-pointer transition-all relative overflow-hidden group shadow-2xl"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover z-10" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <span className="text-white font-barlow font-bold tracking-widest uppercase text-xs">Trocar Imagem</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <span className="text-4xl block mb-2 opacity-50">📷</span>
                  <span className="text-gray-500 font-barlow text-xs uppercase font-bold tracking-widest">Upload de Imagem</span>
                </div>
              )}
              
              <div className="absolute inset-3 border border-cyan-500/20 pointer-events-none z-30"></div>
              <div className="absolute top-3 left-3 w-2 h-2 border-t-2 border-l-2 border-cyan-500/50 z-30"></div>
              <div className="absolute top-3 right-3 w-2 h-2 border-t-2 border-r-2 border-cyan-500/50 z-30"></div>
              <div className="absolute bottom-3 left-3 w-2 h-2 border-b-2 border-l-2 border-cyan-500/50 z-30"></div>
              <div className="absolute bottom-3 right-3 w-2 h-2 border-b-2 border-r-2 border-cyan-500/50 z-30"></div>
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          </div>
        </div>
      </section>

      {/* ATTRIBUTES SECTION */}
      <section className="bg-[#1a1c19] border border-gray-800 p-8 rounded-sm shadow-xl">
        <h2 className="font-bebas text-3xl text-white tracking-widest mb-8 border-b border-gray-700 pb-2">Atributos Base (0-10)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {Object.entries(skills).map(([key, value]) => (
            <div key={key} className="flex flex-col bg-[#232622] p-4 border border-gray-800 rounded-sm relative">
              <div className="flex justify-between items-end mb-4">
                <label className="font-barlow text-gray-400 font-bold uppercase text-[10px] tracking-widest">{key}</label>
                <span className="font-staatliches text-3xl text-[#ea580c] leading-none">{value as number}</span>
              </div>
              <input 
                type="range" min="0" max="10" value={value as number} 
                onChange={(e) => setSkills({...skills, [key]: parseInt(e.target.value)})} 
                className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-[#ea580c]" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* NEW HABIT TRACKER SECTION (Poder Santo) */}
      <section className="bg-[#1a1c19] border border-gray-800 p-8 rounded-sm shadow-xl">
        <div className="flex justify-between items-end mb-8 border-b border-gray-700 pb-2">
          <h2 className="font-bebas text-3xl text-white tracking-widest m-0">Habit Tracker: Poder Santo</h2>
          <span className="font-barlow text-[#ea580c] font-bold text-[10px] uppercase tracking-widest">Painel de Disciplinas</span>
        </div>
        
        <div className="flex flex-col gap-6">
          {Object.entries(holyPower).map(([key, data]: [string, any]) => (
            <div key={key} className="bg-[#232622] p-6 border border-gray-800 rounded-sm shadow-md">
              <h3 className="font-bebas text-2xl text-cyan-400 tracking-widest mb-6 flex items-center gap-3">
                <span className="text-3xl drop-shadow-md">
                  {key === 'Oração' ? '🙏' : key === 'Leitura' ? '📖' : '🕊️'}
                </span> 
                {key}
              </h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="flex flex-col gap-2">
                  <label className="font-barlow text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    Progresso Atual
                  </label>
                  <input 
                    type="number" min="0" value={data.current} 
                    onChange={(e) => handleHolyPowerChange(key, 'current', e.target.value)} 
                    className="bg-[#1a1c19] border border-gray-700 p-3 text-white font-staatliches text-2xl rounded-sm focus:border-cyan-400 outline-none transition-colors" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-barlow text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    Meta Semanal
                  </label>
                  <input 
                    type="number" min="1" value={data.goal} 
                    onChange={(e) => handleHolyPowerChange(key, 'goal', e.target.value)} 
                    className="bg-[#1a1c19] border border-gray-700 p-3 text-gray-300 font-staatliches text-2xl rounded-sm focus:border-cyan-400 outline-none transition-colors" 
                  />
                </div>

                <div className="flex flex-col gap-2 relative">
                  <label className="font-barlow text-orange-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    Dias de Ofensiva (Streak) 🔥
                  </label>
                  <input 
                    type="number" min="0" value={data.streak} 
                    onChange={(e) => handleHolyPowerChange(key, 'streak', e.target.value)} 
                    className="bg-[#1a1c19] border border-orange-900/50 p-3 text-orange-500 font-staatliches text-2xl rounded-sm focus:border-orange-500 outline-none transition-colors" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-barlow text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    Unidade (Medida)
                  </label>
                  <input 
                    type="text" value={data.unit} 
                    onChange={(e) => handleHolyPowerChange(key, 'unit', e.target.value)} 
                    placeholder="Ex: dias, cap..."
                    className="bg-[#1a1c19] border border-gray-700 p-3 text-gray-400 font-barlow font-bold text-sm uppercase tracking-widest rounded-sm focus:border-cyan-400 outline-none transition-colors" 
                  />
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}