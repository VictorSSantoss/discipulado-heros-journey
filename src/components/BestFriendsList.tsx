"use client";

import { ICONS } from "@/constants/gameConfig";

/**
 * BestFriendsList Component
 * Manages the display of allied valentes linked to the current profile.
 * Calibrated with a more compact title scale to maintain visual hierarchy.
 */
export default function BestFriendsList({ friendIds = [] }: { friendIds?: string[] }) {
  const alliesCount = friendIds.length;

  /**
   * PLACEHOLDER DATA
   * Temporary data used for UI visualization until the database link is active.
   */
  const previewFriends = [
    { id: '1', name: 'NATHAN', level: 'Nível 1', role: 'GAD', image: null },
    { id: '2', name: 'VITOR', level: 'Nível 2', role: 'Mídia', image: null },
  ];

  return (
    <div className="space-y-6">
      {/* SECTION_HEADER_CONTAINER */}
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <span className="hud-label-tactical text-gray-500 italic-none">
          {alliesCount} ALIADOS RECRUTADOS
        </span>
      </div>

      <div className="space-y-4">
        {/* ALLIES_ITERATION_AREA */}
        {previewFriends.map((friend) => (
          <div 
            key={friend.id} 
            className="flex items-center gap-4 bg-dark-bg backdrop-blur-md border border-white/5 p-3 rounded-2xl hover:border-brand/50 transition-all cursor-pointer group shadow-xl"
          >
            {/* MINI_AVATAR_CONTAINER: Imagem Silhueta e Cores Vivas */}
            <div className="w-12 h-12 bg-black/20 border border-white/10 rounded-lg flex items-center justify-center shrink-0 group-hover:border-brand transition-colors relative overflow-hidden">
              <img 
                src={friend.image || '/images/man-silhouette.svg'} 
                alt="" 
                onError={(e) => { 
                  e.currentTarget.onerror = null; 
                  e.currentTarget.src = '/images/man-silhouette.svg'; 
                }}
                className="w-full h-full object-contain p-1 opacity-100 transition-transform group-hover:scale-110" 
              />
            </div>
            
            <div className="flex-1 min-w-0">
              {/* IDENTITY_INFO_BLOCK */}
              <h4 className="hud-title-md text-xl text-white m-0 truncate leading-none group-hover:text-brand transition-colors">
                {friend.name}
              </h4>
              <div className="flex items-center gap-2 mt-2">
                <span className="hud-value text-sm text-brand uppercase">
                  {friend.level}
                </span>
                <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                <span className="hud-label-tactical text-gray-500 truncate italic-none">
                  {friend.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2">
        {/* ALLIANCE_LINK_TRIGGER */}
        <button className="w-full py-4 border border-dashed border-white/10 text-gray-600 hover:text-brand hover:border-brand/50 hover:bg-brand/5 rounded-2xl hud-label-tactical tracking-[0.4em] transition-all italic-none">
          + VINCULAR ALIADO
        </button>
      </div>
    </div>
  );
}