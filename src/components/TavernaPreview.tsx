"use client";

import { mockValentes } from "@/lib/mockData";
import Link from "next/link";

export default function TavernaPreview() {
  // Sort and get the top 3
  const topThree = [...mockValentes]
    .sort((a, b) => b.totalXP - a.totalXP)
    .slice(0, 3);

  return (
    <Link href="/taverna" className="block group">
      <div className="bg-[#1a1c19] border border-gray-700 p-4 rounded-sm hover:border-yellow-500 transition-all shadow-lg relative overflow-hidden">
        
        {/* Decorative background trophy icon */}
        <span className="absolute -right-4 -bottom-4 text-7xl opacity-5 group-hover:opacity-10 transition-opacity rotate-12">🏆</span>

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bebas text-xl text-yellow-500 tracking-widest">RANKING GLOBAL</h3>
          <span className="font-barlow text-[10px] text-gray-500 font-bold uppercase group-hover:text-white transition-colors">Ver Tudo →</span>
        </div>

        {/* Mini Podium List */}
        <div className="space-y-3">
          {topThree.map((hero, index) => (
            <div key={hero.id} className="flex items-center gap-3">
              {/* Rank Number */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-staatliches text-xs ${
                index === 0 ? 'bg-yellow-500 text-black' : 
                index === 1 ? 'bg-gray-400 text-black' : 
                'bg-amber-700 text-white'
              }`}>
                {index + 1}º
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-barlow font-bold text-white text-sm truncate uppercase tracking-wider leading-none">
                  {hero.name}
                </p>
                <p className="font-barlow text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  {hero.totalXP} XP
                </p>
              </div>

              {/* Progress bar preview for that hero */}
              <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden shrink-0">
                <div 
                  className="h-full bg-[#ea580c]" 
                  style={{ width: `${Math.min((hero.totalXP / 2000) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}