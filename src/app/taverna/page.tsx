"use client";

import { mockValentes } from "@/lib/mockData";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// 1. THE OUTER SHELL (The Page)
// This must stay incredibly simple to provide the Suspense "Shield".
export default function TavernaPage() {
  return (
    <main className="min-h-screen bg-[#1a1c19] p-6 md:p-12 max-w-6xl mx-auto relative">
      <Suspense fallback={<div className="text-white font-bebas text-center pt-20">Entrando na Taverna...</div>}>
        <TavernaContent />
      </Suspense>
    </main>
  );
}

// 2. THE INNER CONTENT (The Logic)
// All the hooks and data are safely tucked inside here!
function TavernaContent() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('from') || '/admin/valentes';
  
  const rankedValentes = [...mockValentes].sort((a, b) => b.totalXP - a.totalXP);
  const topThree = rankedValentes.slice(0, 3);
  const others = rankedValentes.slice(3);

  return (
    <>
      {/* BACK BUTTON */}
      <div className="absolute top-8 left-6 md:left-12 z-50">
        <Link 
          href={returnUrl} 
          className="flex items-center gap-2 text-gray-500 hover:text-[#ea580c] font-barlow font-bold uppercase tracking-widest text-sm transition-all group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span>Voltar</span>
        </Link>
      </div>

      <header className="text-center mb-16">
        <h1 className="font-bebas text-7xl tracking-[0.2em] text-white uppercase drop-shadow-[0_0_15px_rgba(234,88,12,0.5)]">
          A TAVERNA
        </h1>
        <p className="font-staatliches text-2xl text-[#ea580c] tracking-widest mt-2 uppercase">
          Mural de Glória dos Valentes
        </p>
      </header>

      {/* SECTION: THE PODIUM (Top 3) */}
      <section className="flex flex-wrap justify-center items-end gap-4 md:gap-8 mb-20">
        {topThree[1] && (
          <PodiumCard valente={topThree[1]} rank={2} color="border-gray-400" text="text-gray-400" />
        )}
        {topThree[0] && (
          <PodiumCard valente={topThree[0]} rank={1} color="border-yellow-500" text="text-yellow-500" size="scale-110" />
        )}
        {topThree[2] && (
          <PodiumCard valente={topThree[2]} rank={3} color="border-amber-700" text="text-amber-700" />
        )}
      </section>

      {/* SECTION: ALL HEROES GRID */}
      <section>
        <h2 className="font-bebas text-3xl text-white mb-8 border-b border-gray-800 pb-2 tracking-widest">
          TODOS OS VALENTES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {others.length > 0 ? (
            others.map((v) => <TavernaHeroCard key={v.id} valente={v} />)
          ) : (
            rankedValentes.map((v) => <TavernaHeroCard key={v.id} valente={v} />)
          )}
        </div>
      </section>
    </>
  );
}

// 3. COMPONENT: Podium Card for Top 3
function PodiumCard({ valente, rank, color, text, size = "" }: any) {
  return (
    <div className={`flex flex-col items-center transition-all hover:-translate-y-2 ${size}`}>
      <div className={`w-24 h-24 md:w-32 md:h-32 bg-[#232622] border-4 ${color} rounded-sm shadow-2xl flex items-center justify-center relative`}>
        <span className="font-bebas text-5xl text-gray-700">{valente.name.substring(0, 2)}</span>
        <div className={`absolute -top-4 -right-4 w-10 h-10 ${color.replace('border', 'bg')} flex items-center justify-center rounded-full border-2 border-[#1a1c19]`}>
          <span className="font-staatliches text-xl text-[#1a1c19]">{rank}º</span>
        </div>
      </div>
      <h3 className="font-bebas text-2xl text-white mt-4 tracking-wider">{valente.name}</h3>
      <span className={`font-barlow font-bold text-sm uppercase ${text}`}>{valente.totalXP} XP</span>
    </div>
  );
}

// 4. COMPONENT: Standard Hero Card
function TavernaHeroCard({ valente }: any) {
  return (
    <Link href={`/admin/valentes/${valente.id}`} className="block">
      <div className="bg-[#232622] border border-gray-800 rounded-sm p-4 flex items-center gap-4 hover:border-[#ea580c] transition-all group shadow-lg">
        <div className="w-16 h-16 bg-[#1a1c19] border-2 border-gray-700 group-hover:border-[#ea580c] rounded-sm flex items-center justify-center transition-colors">
          <span className="font-bebas text-2xl text-gray-600 group-hover:text-[#ea580c]">
            {valente.name.substring(0, 2)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bebas text-2xl text-white m-0 tracking-wide uppercase truncate">
            {valente.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className="font-barlow text-[10px] font-bold text-[#ea580c] uppercase tracking-widest leading-none">
              {valente.currentLevel}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2">
             <div className="flex items-center gap-1">
                <span className="text-[10px]">👥</span>
                <span className="font-barlow text-[10px] text-gray-400 font-bold uppercase">
                   {valente.friendIds?.length || 0} ALIADOS
                </span>
             </div>
             <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
             <span className="font-barlow text-[10px] text-gray-400 font-bold uppercase truncate">
                {valente.structure}
             </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-staatliches text-2xl text-blue-400 m-0 leading-none">
            {valente.totalXP}
          </p>
          <p className="font-barlow text-[8px] text-gray-500 uppercase font-bold tracking-widest">XP TOTAL</p>
        </div>
      </div>
    </Link>
  );
}