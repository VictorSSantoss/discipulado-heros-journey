"use client";

interface Medal {
  name: string;
  icon: string;
  tier: string;
}

export default function MedalRack({ medals }: { medals: Medal[] }) {
  return (
    <div className="bg-[#232622] p-4 border border-gray-800 rounded-sm">
      <h3 className="font-bebas text-2xl text-white tracking-widest mb-4 border-b border-gray-700 pb-2">
        MEDALHAS DE HONRA
      </h3>
      
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {medals.length > 0 ? (
          medals.map((medal, index) => (
            <div 
              key={index} 
              className="group relative flex flex-col items-center"
              title={medal.name}
            >
              {/* Medal Circle */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all group-hover:scale-110 border-2 ${
                medal.tier === 'gold' ? 'bg-yellow-500/10 border-yellow-500 shadow-yellow-500/20' :
                medal.tier === 'silver' ? 'bg-gray-400/10 border-gray-400 shadow-gray-400/20' :
                'bg-amber-700/10 border-amber-700 shadow-amber-700/20'
              }`}>
                {medal.icon}
              </div>
              
              {/* Tooltip on Hover */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-barlow font-bold uppercase tracking-widest z-50">
                {medal.name}
              </div>
            </div>
          ))
        ) : (
          <p className="font-barlow text-gray-600 text-[10px] uppercase font-bold italic tracking-widest">
            Nenhuma medalha conquistada ainda...
          </p>
        )}
      </div>
    </div>
  );
}