import { Mission } from '@/types';

interface MissionCardProps {
  mission: Mission;
  onDelete?: (id: string) => void; 
}

export default function MissionCard({ mission, onDelete }: MissionCardProps) {
  const isLvlUp = mission.xpReward === 'LVL UP DIRETO';

  return (
    <div className="relative flex items-center justify-between bg-[#2a2c29] text-white p-4 rounded-sm shadow-md min-h-[80px] group">
      
      <div className="flex-1 pr-4 font-barlow font-bold uppercase text-sm md:text-base tracking-wide leading-tight text-gray-200">
        {mission.title}
      </div>
      
      <div className="w-[2px] h-10 bg-gray-500 mx-4 opacity-50"></div>

      <div className="w-24 text-center shrink-0">
        <span className={`font-bebas text-3xl tracking-widest ${isLvlUp ? 'text-red-500' : 'text-white'}`}>
          {isLvlUp ? mission.xpReward : `+${mission.xpReward} XP`}
        </span>
      </div>

      {/* The Delete Button - Only renders if onDelete is provided */}
      {onDelete && (
        <button
          onClick={() => onDelete(mission.id)}
          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
          title="Deletar Missão"
        >
          ✕
        </button>
      )}
    </div>
  );
}