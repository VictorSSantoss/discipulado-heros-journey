"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Import the global config
import { SIDEBAR_MENU, ICONS } from '@/constants/gameConfig';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#1a1c19] border-r border-gray-800 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-40">
      
      {/* HEADER: Kingdom Branding */}
      <div className="p-6 border-b border-gray-800 bg-[#232622] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#ea580c] opacity-10 blur-3xl rounded-full"></div>
        <h2 className="font-bebas text-4xl tracking-widest text-white m-0 leading-none drop-shadow-[0_2px_10px_rgba(234,88,12,0.4)]">
          DISCIPULADO
        </h2>
        <h2 className="font-bebas text-2xl tracking-widest text-[#ea580c] m-0 leading-none mb-1">
          HERO'S JOURNEY
        </h2>
      </div>

      {/* MAIN NAVIGATION */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {/* Mapping through SIDEBAR_MENU from config */}
        {SIDEBAR_MENU.map((item) => {
          const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin');
          
          return (
            <Link 
              key={item.name}
              href={item.path} 
              className={`relative flex items-center gap-4 px-4 py-3 font-barlow font-bold uppercase tracking-widest text-sm rounded-sm transition-all group overflow-hidden ${
                isActive ? "bg-[#ea580c]/10 text-white border-l-2 border-[#ea580c]" : "text-gray-500 hover:text-white hover:bg-[#232622] border-l-2 border-transparent"
              }`}
            >
              {/* ICON CONTAINER */}
              <div className="relative w-10 h-10 flex items-center justify-center">
                <img 
                  src={item.iconPath} 
                  alt={item.name}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                  className={`w-full h-full object-contain transition-all duration-300 ${isActive ? 'opacity-100 scale-110' : ' group-hover:opacity-100'}`}
                />
              </div>
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* PORTAL: A TAVERNA */}
      <div className="px-4 mb-6">
        <Link 
          href="/taverna"
          className="relative flex items-center justify-center gap-3 px-4 py-4 rounded-sm border border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/20 hover:border-yellow-500 transition-all group overflow-hidden"
        >
          {/* Linked to ICONS.taverna */}
          <img src={ICONS.taverna} alt="Taverna" className="w-10 h-10 object-contain transition-transform group-hover:scale-125 group-hover:-rotate-12" />
          <span className="font-bebas text-xl text-yellow-500 tracking-widest">A TAVERNA</span>
        </Link>
      </div>
      
      {/* ADMIN DOSSIER */}
      <div className="p-4 border-t border-gray-800 bg-[#232622] flex items-center gap-4">
        <div className="w-10 h-10 bg-[#1a1c19] border border-[#ea580c] rounded-sm flex items-center justify-center text-[#ea580c] font-bebas text-xl">
          {/* Placeholder for Avatar */}
        </div>
        <div>
          <p className="font-bebas text-lg text-white tracking-widest leading-none">João</p>
          <p className="font-barlow text-[#ea580c] text-[9px] uppercase font-black">Gerente</p>
        </div>
      </div>
    </aside>
  );
}