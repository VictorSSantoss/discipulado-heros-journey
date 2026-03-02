"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
/* GLOBAL_CONFIG_IMPORTS */
import { SIDEBAR_MENU, ICONS } from '@/constants/gameConfig';

/**
 * Sidebar Component
 * Persistent navigation terminal for the Hero's Journey administration.
 * Now featuring the unified silhouette fallback for the master profile.
 */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-dark-bg/95 backdrop-blur-xl border-r border-white/5 flex flex-col z-40">
      {/* CONTAINER 1: SIDEBAR_SHELL */}
      
      <div className="p-6 border-b border-white/5 bg-dark-bg/10 relative overflow-hidden">
        {/* CONTAINER 2: BRANDING_HEADER - Boosted Scale */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand opacity-10 blur-3xl rounded-full"></div>
        
        <h2 className="hud-title-lg text-5xl text-white m-0 leading-none drop-shadow-[0_2px_10px_rgba(17,194,199,0.3)]">
          DISCIPULADO
        </h2>
        <h2 className="hud-label-tactical text-brand mt-2 italic-none text-[11px] tracking-[0.3em]">
          HERO'S JOURNEY
        </h2>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto custom-scrollbar">
        {/* CONTAINER 3: MAIN_NAVIGATION_MATRIX */}
        {SIDEBAR_MENU.map((item) => {
          const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin');
          
          return (
            <Link 
              key={item.name}
              href={item.path} 
              className={`relative flex items-center gap-4 px-4 py-4 transition-all group overflow-hidden rounded-xl border ${
                isActive 
                  ? "bg-brand/15 backdrop-blur-md border-brand/30 border-t-brand/60 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]" 
                  : "text-gray-300 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10"
              }`}
            >
              {/* ITEM_ICON_VIEWPORT - Opacity fixed at 100% */}
              <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                <img 
                  src={item.iconPath} 
                  alt=""
                  className={`w-full h-full object-contain transition-all duration-300 ${
                    isActive ? 'scale-110' : 'scale-100 group-hover:scale-110'
                  }`}
                />
              </div>
              
              {/* ITEM_LABEL - Increased to 14px */}
              <span className="hud-label-tactical text-[14px] italic-none relative z-10 transition-colors font-bold">
                {item.name}
              </span>

              {/* ACTIVE_INDICATOR_GLOW */}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand rounded-l-full shadow-[0_0_15px_rgba(17,194,199,0.6)]"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mb-6">
        {/* CONTAINER 4: TAVERNA_PORTAL_TRIGGER - Boosted Scale */}
        <Link 
          href="/taverna"
          className="relative flex items-center justify-center gap-3 px-4 py-5 rounded-full border border-yellow-500/20 border-t-yellow-500/50 bg-yellow-500/10 backdrop-blur-md text-yellow-500 hover:bg-yellow-500/20 transition-all group overflow-hidden shadow-lg"
        >
          <img src={ICONS.taverna} alt="" className="w-10 h-10 object-contain transition-transform group-hover:scale-110" />
          <span className="hud-title-md text-2xl italic-none tracking-widest">A TAVERNA</span>
          
          <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </Link>
      </div>
      
      <div className="p-6 border-t border-white/5 bg-white/[0.03] flex items-center gap-4">
        {/* CONTAINER 5: USER_IDENT_DOSSIER - Integrated Silhouette */}
        <div className="w-12 h-12 bg-black/20 backdrop-blur-sm border-t border-brand/40 border border-brand/10 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden shadow-inner">
          <img 
            src="/images/man-silhouette.svg" 
            alt="" 
            onError={(e) => { 
              e.currentTarget.onerror = null; 
              e.currentTarget.src = '/images/man-silhouette.svg'; 
            }}
            className="w-full h-full object-contain p-1" 
          />
        </div>
        <div className="min-w-0">
          <p className="hud-title-md text-xl text-white m-0 truncate">João</p>
          <p className="hud-label-tactical text-brand text-[10px] mt-1 italic-none truncate uppercase tracking-widest">Gerente do Reino</p>
        </div>
      </div>
    </aside>
  );
}