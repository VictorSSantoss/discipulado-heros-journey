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
            {/* Avatar with Glow */}
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

            {/* Tactical Info */}
            <div className="flex flex-col flex-1">
              <span className="hud-title-md text-sm text-white truncate max-w-[140px]">
                {friend.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-tighter" style={{ color: structureColor }}>
                  {friend.structure}
                </span>
                <span className="text-white/20">•</span>
                <span className="hud-value text-[10px] text-gray-400">
                  {friend.totalXP} XP
                </span>
              </div>
            </div>

            {/* Tactical Remove Button */}
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