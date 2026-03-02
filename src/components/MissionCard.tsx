import { Mission } from '@/types';

interface MissionCardProps {
  mission: Mission;
  onDelete?: (id: string) => void; 
}

/**
 * MissionCard Component
 * Represents a single decree or objective within the quest log.
 * Calibrated with HUD typography for a refined, compact readout.
 */
export default function MissionCard({ mission, onDelete }: MissionCardProps) {
  const isLvlUp = mission.xpReward === 'LVL UP DIRETO';

  return (
    <div className="relative flex items-center justify-between bg-dark-bg/40 backdrop-blur-xl border border-white/5 text-white p-4 rounded-xl shadow-xl min-h-[70px] group transition-all hover:border-white/20">
      {/* CONTAINER 1: MISSION_IDENTITY_WRAPPER */}
      <div className="flex-1 pr-4">
        <h4 className="hud-title-md text-base md:text-lg text-gray-200 m-0 leading-tight">
          {mission.title}
        </h4>
        {/* CONTAINER 2: CATEGORY_TAG (Optional metadata) */}
        {mission.category && (
          <span className="hud-label-tactical text-[8px] text-gray-500 mt-1 block italic-none">
            {mission.category.toUpperCase()}
          </span>
        )}
      </div>
      
      {/* CONTAINER 3: TACTICAL_DIVIDER */}
      <div className="w-px h-8 bg-white/10 mx-4"></div>

      {/* CONTAINER 4: REWARD_READOUT */}
      <div className="w-24 text-right shrink-0">
        <span className={`hud-value text-2xl tracking-tight ${isLvlUp ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 'text-white'}`}>
          {isLvlUp ? 'LVL UP' : `+${mission.xpReward} XP`}
        </span>
      </div>

      {/* CONTAINER 5: DESTRUCTION_TRIGGER */}
      {/* Only active for administrative roles when the onDelete handler is passed. */}
      {onDelete && (
        <button
          onClick={() => onDelete(mission.id)}
          className="absolute -top-2 -right-2 bg-red-600/80 hover:bg-red-500 backdrop-blur-md text-white rounded-lg w-6 h-6 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all shadow-lg cursor-pointer z-20 border border-white/10"
          title="Deletar Missão"
        >
          ✕
        </button>
      )}

      {/* Visual top highlight for HUD depth */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
}