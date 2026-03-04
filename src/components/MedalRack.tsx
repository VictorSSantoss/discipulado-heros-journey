"use client";

import Image from "next/image";

interface MedalRackProps {
  // This matches the structure returned by Prisma include: { medals: { include: { medal: true } } }
  medals: {
    medal: {
      name: string;
      icon: string;
      rarity: string;
      description: string;
    };
    awardedAt: Date;
  }[];
}

export default function MedalRack({ medals }: MedalRackProps) {
  const totalSlots = 6;
  const earnedCount = medals.length;
  const emptySlots = Math.max(0, totalSlots - earnedCount);

  return (
    <div className="bg-dark-bg/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="hud-label-tactical text-xs text-gray-500 uppercase tracking-widest">
          Medalhas de Honra
        </h3>
        <span className="hud-value text-brand text-sm">
          {earnedCount}/{totalSlots}
        </span>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {/* EARNED MEDALS */}
        {medals.map((vm, index) => (
          <div 
            key={index}
            className="group relative aspect-square flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:border-brand/50 hover:bg-brand/5 transition-all cursor-help"
          >
            <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
              <Image 
                src={vm.medal.icon} 
                alt={vm.medal.name} 
                fill 
                className="object-contain drop-shadow-[0_0_8px_rgba(17,194,199,0.3)]"
              />
            </div>

            {/* TOOLTIP */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-3 bg-dark-bg border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
              <p className="hud-label-tactical text-[10px] text-brand mb-1">{vm.medal.rarity}</p>
              <p className="hud-title-md text-xs text-white mb-1">{vm.medal.name}</p>
              <p className="text-[9px] text-gray-400 leading-tight mb-2">{vm.medal.description}</p>
              <p className="text-[8px] text-gray-500 border-t border-white/5 pt-1 uppercase">
                Conquistado em: {new Date(vm.awardedAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        ))}

        {/* EMPTY SLOTS */}
        {[...Array(emptySlots)].map((_, i) => (
          <div 
            key={`empty-${i}`}
            className="aspect-square flex items-center justify-center bg-black/20 border border-dashed border-white/5 rounded-xl grayscale opacity-30"
          >
            <div className="w-8 h-8 rounded-full bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}