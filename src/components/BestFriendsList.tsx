"use client";

import Image from "next/image";
import { ESTRUTURAS } from "@/constants/gameConfig";
import { removeCompanheiro } from "@/app/actions/companheiroActions";
import { useState } from "react";

export default function BestFriendsList({ 
  friends, 
  currentValenteId 
}: { 
  friends: any[]; 
  currentValenteId: string; 
}) {
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

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

  return (
    <div className="space-y-4">
      {friends.map((friend) => {
        const structureColor = Object.values(ESTRUTURAS).find(
          s => s.label === friend.structure
        )?.color || "#ffffff";

        return (
          <div key={friend.id} className="flex items-center gap-4 group relative">
            <div 
              className="relative w-12 h-12 rounded-full border-2 overflow-hidden shrink-0"
              style={{ borderColor: structureColor, boxShadow: `0 0 10px ${structureColor}40` }}
            >
              <Image 
                src={friend.image || '/images/man-silhouette.svg'} 
                alt={friend.name} 
                fill 
                className="object-cover"
              />
            </div>

            <div className="flex flex-col flex-1 items-start">
              {/* Guilda badge with interactive hover state */}
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
              
              <span className="hud-title-md text-sm text-white truncate max-w-[140px] transition-colors group-hover:text-brand">
                {friend.name}
              </span>
              
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
              className="opacity-0 group-hover:opacity-100 transition-all p-2 hover:text-red-500 text-gray-600 disabled:animate-pulse"
              title="Romper Vínculo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}