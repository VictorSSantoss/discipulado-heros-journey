"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ESTRUTURAS } from "@/constants/gameConfig";
import { removeCompanheiro } from "@/app/actions/companheiroActions";

export default function BestFriendsList({ 
  friends, 
  currentValenteId 
}: { 
  friends: any[]; 
  currentValenteId: string; 
}) {
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRemove = async (friendId: string) => {
    setIsRemoving(friendId);
    await removeCompanheiro(currentValenteId, friendId);
    setIsRemoving(null);
  };

  if (!friends || friends.length === 0) {
    return (
      <div className="text-center py-8 opacity-30 italic text-xs uppercase tracking-widest">
        Nenhuma conexão estabelecida ainda.
      </div>
    );
  }

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Search Bar */}
      <div className="relative shrink-0">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="BUSCAR COMPANHEIRO..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black/40 border border-white/10 py-2.5 pl-9 pr-4 rounded-xl text-white hud-label-tactical text-[10px] outline-none focus:border-brand/50 transition-all placeholder:opacity-50"
        />
      </div>

      {/* Scrollable List Container */}
      {/* ⚔️ FIXED: Added px-3 py-2 and -mx-3 to prevent the left glow from being clipped */}
      <div className="overflow-y-auto max-h-[260px] space-y-4 px-3 py-2 -mx-3 custom-scrollbar flex-1">
        {filteredFriends.length === 0 ? (
          <div className="text-center py-4 opacity-50 text-xs">Nenhum companheiro encontrado.</div>
        ) : (
          filteredFriends.map((friend) => {
            const structureColor = Object.values(ESTRUTURAS).find(
              s => s.label === friend.structure
            )?.color || "#ffffff";

            return (
              <div key={friend.id} className="flex items-center gap-4 group relative p-1 rounded-xl transition-colors hover:bg-white/[0.02]">
                {/* Clickable Portrait */}
                <Link href={`/admin/valentes/${friend.id}`} className="shrink-0 relative">
                  <div 
                    className="relative w-12 h-12 rounded-full border-2 overflow-hidden shrink-0 transition-transform group-hover:scale-105"
                    style={{ borderColor: structureColor, boxShadow: `0 0 10px ${structureColor}40` }}
                  >
                    <Image 
                      src={friend.image || '/images/man-silhouette.svg'} 
                      alt={friend.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </Link>

                <div className="flex flex-col flex-1 items-start overflow-hidden">
                  {friend.managedBy?.guildaName && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 mb-1 rounded-md bg-gradient-to-r from-mission/20 to-transparent border border-mission/30 backdrop-blur-sm shadow-[0_0_10px_rgba(16,185,129,0.1)] w-fit transition-all duration-500 group-hover:border-mission/50 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-[1.02]">
                      <span className="hud-label-tactical text-[8px] text-mission uppercase tracking-widest font-bold">
                        {friend.managedBy.guildaName}
                      </span>
                      {friend.managedBy.guildaIcon && (
                        <img 
                          src={friend.managedBy.guildaIcon} 
                          alt="" 
                          className="w-3 h-3 object-contain brightness-110 transition-all duration-500 group-hover:brightness-125" 
                        />
                      )}
                    </div>
                  )}
                  
                  {/* Clickable Name */}
                  <Link 
                    href={`/admin/valentes/${friend.id}`} 
                    className="hud-title-md text-sm text-white truncate max-w-full transition-colors hover:text-brand hover:underline"
                  >
                    {friend.name}
                  </Link>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-tighter" style={{ color: structureColor }}>
                      {friend.structure}
                    </span>

                    <span className="text-white/20 mx-1">•</span>
                    <span className="hud-value text-[10px] text-gray-400">
                      {friend.totalXP} XP
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(friend.id)}
                  disabled={isRemoving === friend.id}
                  className="opacity-0 group-hover:opacity-100 transition-all p-2 hover:text-red-500 text-gray-600 disabled:animate-pulse bg-black/40 rounded-full border border-white/5 hover:border-red-500/30"
                  title="Romper Vínculo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                    <line x1="12" y1="2" x2="12" y2="12" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}