"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateValenteProfile } from "@/app/actions/valenteActions";
import { ESTRUTURAS } from "@/constants/gameConfig";
import AvatarUploader from "@/components/game/AvatarUploader";

/**
 * EditValenteForm Component
 * Maintains the profile's tactical aesthetic while providing recalibration tools.
 */
export default function EditValenteForm({ valente }: { valente: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(valente.image); // Dedicated state to bypass cache
  const [formData, setFormData] = useState({
    name: valente.name,
    description: valente.description || "",
    structure: valente.structure,
    attributes: { ...valente.attributes }
  });

  const getTheme = (structureLabel: string) => {
    const entry = Object.values(ESTRUTURAS).find(
      s => s.label.toLowerCase() === structureLabel.toLowerCase()
    ) || ESTRUTURAS.GAD;
    return { hex: entry.color, label: entry.label };
  };

  const theme = getTheme(formData.structure);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateValenteProfile(valente.id, formData);
    if (result.success) {
      router.push(`/admin/valentes/${valente.id}`);
      router.refresh();
    }
    setLoading(false);
  };

  const handleAttrChange = (attr: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: { 
        ...prev.attributes, 
        [attr]: value 
      }
    }));
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: valente.name,
      description: valente.description || "",
      structure: valente.structure,
      attributes: { ...valente.attributes }
    }));
    // Also update currentAvatar if valente prop changes from a server refresh
    if(valente.image !== currentAvatar){
        setCurrentAvatar(valente.image);
    }
  }, [valente]); 

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMN 1: IDENTITY RECALIBRATION */}
        <div className="flex flex-col gap-8">
          <div className="bg-dark-bg/40 backdrop-blur-xl p-8 border border-white/5 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <h2 className="hud-title-md text-white text-center border-b border-white/5 pb-4 w-full mb-8 uppercase">
              Identidade
            </h2>

            {/* AVATAR UPLOADER (Holographic Rectangle UI) */}
            <div className="relative w-full max-w-[220px] aspect-[3/4] flex items-center justify-center bg-dark-bg/60 border border-white/10 rounded-xl shadow-2xl overflow-hidden group mb-8">
              <div className="absolute inset-0 z-10">
                <AvatarUploader 
                  valenteId={valente.id} 
                  currentImage={currentAvatar} 
                  onImageUpdated={(newUrl) => setCurrentAvatar(newUrl)}
                  className="w-full h-full object-cover p-5 opacity-90 transition-opacity group-hover:opacity-100"
                  alt={`Foto de ${formData.name}`}
                />
              </div>
              
              {/* Hologram visual effects */}
              <div className="absolute left-0 right-0 h-[1.5px] z-[15] pointer-events-none animate-scan-hologram mix-blend-screen" style={{ background: `linear-gradient(90deg, transparent, ${theme.hex}, transparent)`, boxShadow: `0 0 20px ${theme.hex}`, width: '100%' }} />
              <div className="absolute inset-4 border border-solid z-20 pointer-events-none" style={{ borderColor: theme.hex }}>
                <div className="absolute inset-0" style={{ boxShadow: `inset 0 0 15px ${theme.hex}44` }} />
              </div>
              <div className="absolute top-4 left-4 w-3 h-3 border-t-4 border-l-4 border-solid z-30 pointer-events-none" style={{ borderColor: theme.hex }}></div>
              <div className="absolute top-4 right-4 w-3 h-3 border-t-4 border-r-4 border-solid z-30 pointer-events-none" style={{ borderColor: theme.hex }}></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 border-b-4 border-l-4 border-solid z-30 pointer-events-none" style={{ borderColor: theme.hex }}></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 border-b-4 border-r-4 border-solid z-30 pointer-events-none" style={{ borderColor: theme.hex }}></div>
            </div>

            <div className="space-y-6 w-full">
              <div className="flex flex-col gap-2">
                <label className="hud-label-tactical text-gray-500 text-[10px]">Nome de Guerra</label>
                <input 
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand/50 transition-all text-white font-barlow"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="hud-label-tactical text-gray-500 text-[10px]">Estrutura</label>
                <select 
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand/50 transition-all text-white font-barlow appearance-none"
                  value={formData.structure}
                  onChange={e => setFormData({...formData, structure: e.target.value})}
                >
                  {Object.values(ESTRUTURAS).map(s => (
                    <option key={s.label} value={s.label} className="bg-dark-bg">{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-dark-bg/40 backdrop-blur-xl p-8 border border-white/5 rounded-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-5 rounded-full" style={{ backgroundColor: theme.hex }}></div>
              <h3 className="hud-label-tactical text-gray-400 text-[15px] uppercase tracking-widest">Crônicas</h3>
            </div>
            <textarea 
              rows={6}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand/50 transition-all resize-none text-gray-300 text-sm leading-relaxed font-barlow"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva os feitos e a jornada deste herói..."
            />
          </div>
        </div>

        {/* COLUMN 2 & 3: ATTRIBUTE FORGE */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-dark-bg/40 backdrop-blur-xl p-8 border border-white/5 rounded-2xl shadow-2xl">
            <h2 className="hud-title-md text-white text-center border-b border-white/5 pb-4 mb-10 uppercase">
              Calibração de Atributos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              {['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'].map((attr) => (
                <div key={attr} className="flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <label className="hud-label-tactical text-gray-400 uppercase tracking-tighter text-[11px]">{attr}</label>
                    <span className="hud-value text-xl text-white" style={{ textShadow: `0 0 10px ${theme.hex}60` }}>
                      {formData.attributes[attr as keyof typeof formData.attributes]}
                    </span>
                  </div>
                  <div className="relative group w-full">
                    <input 
                      type="range" min="0" max="20" 
                      className="absolute inset-0 w-full h-1.5 opacity-0 cursor-pointer z-10"
                      value={formData.attributes[attr as keyof typeof formData.attributes]}
                      onChange={e => handleAttrChange(attr, parseInt(e.target.value))}
                    />
                    {/* Visual Progress Bar Background */}
                    <div className="w-full h-1.5 bg-white/5 rounded-lg pointer-events-none mt-3 relative overflow-hidden">
                      {/* Visual Progress Fill */}
                      <div 
                        className="absolute top-0 left-0 h-full transition-all duration-300 pointer-events-none"
                        style={{ 
                          width: `${(formData.attributes[attr as keyof typeof formData.attributes] / 20) * 100}%`,
                          backgroundColor: theme.hex,
                          boxShadow: `0 0 15px ${theme.hex}80`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-6 mt-4">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="hud-label-tactical text-gray-500 hover:text-white transition-colors uppercase tracking-widest px-4"
            >
              Abortar Alterações
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="hud-btn-text text-white px-12 py-3 rounded-2xl hover:brightness-110 transition-all shadow-lg disabled:opacity-50 uppercase tracking-widest"
              style={{ backgroundColor: theme.hex }}
            >
              {loading ? "Sincronizando..." : "Gravar Dados"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}