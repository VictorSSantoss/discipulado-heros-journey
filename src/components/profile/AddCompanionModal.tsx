"use client";

import { useState } from "react";
import { searchValentes } from "@/app/actions/companheiroActions";
import { motion, AnimatePresence } from "framer-motion";

export default function AddCompanionModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  currentValenteId 
}: { 
  isOpen: boolean; onClose: () => void; onAdd: (id: string) => void; currentValenteId: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length < 2) return setResults([]);
    
    setLoading(true);
    const data = await searchValentes(val, currentValenteId);
    setResults(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md bg-dark-bg border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
      >
        <h3 className="hud-title-md text-white mb-4 uppercase">Recrutar Companheiro</h3>
        
        <input 
          type="text" autoFocus
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-brand/50 outline-none transition-all"
          placeholder="Digite o nome do Valente..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="mt-4 space-y-2 min-h-[200px]">
          {loading ? (
            <div className="flex justify-center py-10 text-brand animate-pulse">Buscando...</div>
          ) : (
            results.map((res) => (
              <button 
                key={res.id}
                onClick={() => { onAdd(res.id); onClose(); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-transparent hover:border-brand/30 hover:bg-brand/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden shrink-0">
                  <img src={res.image || '/images/man-silhouette.svg'} className="object-cover w-full h-full" alt="" />
                </div>
                <div className="flex flex-col items-start overflow-visible"> {/* Changed to overflow-visible */}
                  
                  {/* Guilda badge with improved spacing to prevent clipping on hover */}
                  {res.managedBy?.guildaName && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 mb-1.5 rounded-md bg-gradient-to-r from-mission/20 to-transparent border border-mission/30 backdrop-blur-sm shadow-[0_0_10px_rgba(16,185,129,0.1)] w-fit transition-all duration-500 group-hover:border-mission/50 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-[1.05] origin-left">
                      <span className="hud-label-tactical text-[8px] text-mission uppercase tracking-widest font-bold">
                        {res.managedBy.guildaName}
                      </span>
                      {res.managedBy.guildaIcon && (
                        <img 
                          src={res.managedBy.guildaIcon} 
                          alt="" 
                          className="w-3 h-3 object-contain brightness-110 transition-all duration-500 group-hover:brightness-125" 
                        />
                      )}
                    </div>
                  )}
                  
                  <span className="text-sm font-medium text-white truncate max-w-[180px] transition-colors group-hover:text-brand">{res.name}</span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">{res.structure}</span>
                  </div>
                </div>
                <span className="ml-auto opacity-0 group-hover:opacity-100 text-brand text-xs font-bold whitespace-nowrap">VINCULAR +</span>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}