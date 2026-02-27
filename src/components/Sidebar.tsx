"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  // The separated menu items
  const menuItems = [
    { name: 'Início', path: '/admin', icon: '🏠' },
    { name: 'Valentes', path: '/admin/valentes', icon: '🛡️' },
    { name: 'Missões', path: '/admin/missoes', icon: '🎯' },
    { name: 'Patentes', path: '/admin/patentes', icon: '🏆' },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#232622] border-r border-gray-800 flex flex-col shadow-2xl z-40">
      <div className="p-6 border-b border-gray-800 bg-[#1a1c19]">
        <h2 className="font-staatliches text-3xl tracking-widest text-[#ea580c] m-0 leading-none">
          HERO'S JOURNEY
        </h2>
        <p className="font-barlow text-gray-500 text-xs uppercase tracking-widest mt-1 font-bold">
          Admin Console
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin');
          return (
            <Link 
              key={item.name}
              href={item.path} 
              className={`flex items-center gap-3 px-4 py-3 font-barlow font-bold uppercase tracking-widest text-sm rounded-sm transition-all group ${
                isActive
                  ? "bg-[#ea580c]/10 text-[#ea580c] border border-[#ea580c]/30" 
                  : "text-gray-400 hover:text-white hover:bg-[#ea580c]/10"
              }`}
            >
              <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? '' : 'opacity-70 group-hover:opacity-100'}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* --- A TAVERNA --- */}
      <div className="px-4 mb-4">
        <div className="h-px bg-gray-800 w-full mb-4"></div>
        <Link 
          href={pathname === '/taverna' ? '/taverna' : `/taverna?from=${pathname}`}
          className="flex items-center gap-3 px-4 py-3 rounded-sm text-yellow-500 bg-yellow-500/5 border border-yellow-500/20 hover:bg-yellow-500/10 hover:border-yellow-500 transition-all font-barlow font-bold uppercase tracking-wider text-sm group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🏆</span>
          A TAVERNA
        </Link>
      </div>

      {/* Admin Info */}
      <div className="p-4 border-t border-gray-800 flex items-center gap-3 bg-[#1a1c19]">
        <div className="w-10 h-10 bg-[#ea580c] rounded-full flex items-center justify-center font-bebas text-xl text-white shadow-lg">
          A
        </div>
        <div>
          <p className="font-barlow text-white font-bold uppercase tracking-widest text-xs">Admin</p>
          <p className="font-barlow text-[#ea580c] text-[10px] uppercase tracking-widest font-bold">Mestre da Guilda</p>
        </div>
      </div>
    </aside>
  );
}