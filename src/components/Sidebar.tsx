"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
/* GLOBAL_CONFIG_IMPORTS */
import { SIDEBAR_MENU, ICONS } from '@/constants/gameConfig';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false); 
      } else {
        setIsVisible(true); 
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* 1. MOBILE TRIGGER */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`
          lg:hidden fixed top-4 left-4 z-50 p-3 bg-dark-bg/80 backdrop-blur-xl 
          border border-white/10 rounded-xl shadow-[0_0_15px_rgba(17,194,199,0.2)] 
          active:scale-95 transition-all duration-500 ease-in-out
          ${isVisible || isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"}
        `}
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className="w-full h-0.5 bg-brand"></span>
          <span className="w-3/4 h-0.5 bg-brand"></span>
          <span className="w-full h-0.5 bg-brand"></span>
        </div>
      </button>

      {/* 2. BACKDROP OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. SIDEBAR SHELL */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-dark-bg/95 backdrop-blur-xl border-r border-white/5 
        flex flex-col z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* BRANDING_HEADER */}
        <div className="p-6 border-b border-white/5 bg-dark-bg/10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand opacity-10 blur-3xl rounded-full"></div>
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="hud-title-lg text-4xl text-white m-0 leading-none drop-shadow-[0_2px_10px_rgba(17,194,199,0.3)]">
                DISCIPULADO
              </h2>
              <h2 className="hud-label-tactical text-brand mt-2 italic-none text-[10px] tracking-[0.3em]">
                HERO'S JOURNEY
              </h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
               ✕
            </button>
          </div>
        </div>

        {/* NAVIGATION - Automatically includes "Relíquias" if added to SIDEBAR_MENU */}
        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto custom-scrollbar">
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
                <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                  <img src={item.iconPath} alt="" className={`w-full h-full object-contain transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-110'}`} />
                </div>
                
                <span className="hud-label-tactical text-[14px] italic-none relative z-10 transition-colors font-bold uppercase">
                  {item.name}
                </span>

                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand rounded-l-full shadow-[0_0_15px_rgba(17,194,199,0.6)]"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* TAVERNA_PORTAL_TRIGGER */}
        <div className="px-4 mb-6">
          <Link 
            href="/taverna"
            className="relative flex items-center justify-center gap-3 px-4 py-5 rounded-full border border-yellow-500/20 border-t-yellow-500/50 bg-yellow-500/10 backdrop-blur-md text-yellow-500 hover:bg-yellow-500/20 transition-all group overflow-hidden shadow-lg"
          >
            <img src={ICONS.taverna} alt="" className="w-8 h-8 object-contain transition-transform group-hover:scale-110" />
            <span className="hud-title-md text-xl italic-none tracking-widest">A TAVERNA</span>
          </Link>
        </div>
        
        {/* USER_IDENT_DOSSIER - Integrated with Profile Logic */}
        <div className="p-6 border-t border-white/5 bg-white/[0.03] flex items-center gap-4">
          <div className="w-10 h-10 bg-black/20 backdrop-blur-sm border border-brand/20 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden shadow-inner">
            <img 
              src="/images/admin-avatar.png" // Replace with your admin image source if available
              alt="João" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.currentTarget.src = "/images/man-silhouette.svg";
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="hud-title-md text-lg text-white m-0 truncate">João</p>
            <p className="hud-label-tactical text-brand text-[9px] mt-1 italic-none truncate uppercase tracking-widest">Gerente do Reino</p>
          </div>
        </div>
      </aside>
    </>
  );
}