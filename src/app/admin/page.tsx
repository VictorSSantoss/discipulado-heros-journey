"use client";

import Link from "next/link";
// 1. Imported ICONS from your global rulebook
import { ICONS } from "@/constants/gameConfig";

export default function AdminDashboard() {
  return (
    <main className="p-6 max-w-7xl mx-auto min-h-screen flex flex-col pb-20">
      
      {/* HEADER SECTION */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-bebas text-5xl tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(234,88,12,0.3)] m-0 flex items-center gap-4">
            {/* 2. Replaced static path with ICONS.overview */}
            <img 
              src={ICONS.overview}
              alt="Visão Geral"
              className="w-12 h-12 object-contain"
            />
            Visão Geral do Reino
          </h1>
          <p className="font-barlow text-gray-400 mt-1 uppercase tracking-widest font-bold">
            Resumo Estratégico do Discipulado
          </p>
        </div>
      </header>

      {/* STATS GRID - TACTICAL HUD STYLE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Stat Card 1: Valentes */}
        <div className="relative group bg-[#1a1c19] border border-gray-800 p-6 rounded-sm shadow-xl overflow-hidden hover:border-[#ea580c] transition-all">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#ea580c] shadow-[0_0_10px_rgba(234,88,12,0.8)]"></div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-barlow font-black text-gray-500 uppercase tracking-widest text-[10px]">Total de Valentes</h3>
            <img 
              src={ICONS.valentes} 
              alt="Valentes" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <p className="font-staatliches text-6xl text-white leading-none">45</p>
          <p className="font-barlow text-[10px] text-green-400 font-bold uppercase tracking-widest mt-2">
            +3 Recrutados este mês
          </p>
        </div>
        
        {/* Stat Card 2: XP */}
        <div className="relative group bg-[#1a1c19] border border-gray-800 p-6 rounded-sm shadow-xl overflow-hidden hover:border-cyan-500 transition-all">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-barlow font-black text-gray-500 uppercase tracking-widest text-[10px]">XP Distribuído (Semana)</h3>
            <img 
              src={ICONS.xp}
              alt="XP" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <p className="font-staatliches text-6xl text-cyan-400 leading-none">12.500</p>
          <p className="font-barlow text-[10px] text-cyan-500/70 font-bold uppercase tracking-widest mt-2">
            Média de 277 XP por Valente
          </p>
        </div>

        {/* Stat Card 3: Missões */}
        <div className="relative group bg-[#1a1c19] border border-gray-800 p-6 rounded-sm shadow-xl overflow-hidden hover:border-yellow-500 transition-all">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-barlow font-black text-gray-500 uppercase tracking-widest text-[10px]">Decretos Ativos</h3>
            <img 
              src={ICONS.missoes} 
              alt="Missões" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <p className="font-staatliches text-6xl text-yellow-400 leading-none">26</p>
          <p className="font-barlow text-[10px] text-yellow-500/70 font-bold uppercase tracking-widest mt-2">
            8 Missões expiram em breve
          </p>
        </div>

      </div>

      {/* TWO COLUMN LAYOUT: ACTIVITY LOG & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Activity Log (Takes up 2/3 space) */}
        <section className="lg:col-span-2 bg-[#232622] border border-gray-800 rounded-sm shadow-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-800 bg-[#1a1c19]">
            <h2 className="font-bebas text-3xl tracking-widest text-white uppercase m-0 flex items-center gap-3">
              ⚔️ Registro de Combate
            </h2>
            <p className="font-barlow text-gray-500 text-[10px] uppercase tracking-widest font-black mt-1">Últimas atividades do reino</p>
          </div>
          
          <div className="p-6 space-y-4 flex-1">
            {/* Log Item 1 */}
            <div className="flex justify-between items-center p-4 bg-[#1a1c19] rounded-sm border border-gray-800 hover:border-[#ea580c]/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#232622] rounded-sm flex items-center justify-center font-bebas text-xl text-white border border-gray-700">C</div>
                <div>
                  <p className="font-barlow text-gray-300 text-sm">
                    <strong className="text-white">Cadu</strong> completou a missão:
                  </p>
                  <p className="font-barlow text-[#ea580c] font-bold uppercase tracking-widest text-xs">Ler Neemias</p>
                </div>
              </div>
              <div className="bg-[#232622] border border-gray-700 px-3 py-1 rounded-sm shadow-inner group-hover:border-cyan-500/50 transition-colors">
                <span className="font-staatliches text-xl text-cyan-400">+300 XP</span>
              </div>
            </div>

            {/* Log Item 2 */}
            <div className="flex justify-between items-center p-4 bg-[#1a1c19] rounded-sm border border-gray-800 hover:border-[#ea580c]/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#232622] rounded-sm flex items-center justify-center font-bebas text-xl text-white border border-gray-700">N</div>
                <div>
                  <p className="font-barlow text-gray-300 text-sm">
                    <strong className="text-white">Nathan</strong> completou a missão:
                  </p>
                  <p className="font-barlow text-[#ea580c] font-bold uppercase tracking-widest text-xs">Participar da Sala de Oração</p>
                </div>
              </div>
              <div className="bg-[#232622] border border-gray-700 px-3 py-1 rounded-sm shadow-inner group-hover:border-cyan-500/50 transition-colors">
                <span className="font-staatliches text-xl text-cyan-400">+200 XP</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Quick Actions (Takes up 1/3 space) */}
        <section className="bg-[#232622] border border-gray-800 rounded-sm shadow-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-800 bg-[#1a1c19]">
            <h2 className="font-bebas text-3xl tracking-widest text-white uppercase m-0">
              ⚡ Ações Rápidas
            </h2>
          </div>
          <div className="p-6 flex flex-col gap-4 flex-1">
            <Link href="/admin/valentes/novo" className="flex items-center gap-4 p-4 bg-[#1a1c19] border border-gray-700 hover:border-[#ea580c] rounded-sm transition-all group">
              <img 
                src={ICONS.valentes} 
                alt="Missões" 
                className="w-8 h-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-bebas text-xl text-white tracking-widest">Recrutar Valente</span>
                <span className="font-barlow text-gray-500 text-[10px] uppercase font-bold tracking-widest">Adicionar nova ficha</span>
              </div>
            </Link>

            <Link href="/admin/missoes" className="flex items-center gap-4 p-4 bg-[#1a1c19] border border-gray-700 hover:border-yellow-500 rounded-sm transition-all group">
              <img 
                src={ICONS.missoes} 
                alt="Missões" 
                className="w-8 h-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-bebas text-xl text-white tracking-widest">Criar Decreto</span>
                <span className="font-barlow text-gray-500 text-[10px] uppercase font-bold tracking-widest">Nova missão para a tropa</span>
              </div>
            </Link>

            <Link href="/admin/patentes" className="flex items-center gap-4 p-4 bg-[#1a1c19] border border-gray-700 hover:border-cyan-500 rounded-sm transition-all group">
              <img 
                src={ICONS.patentes} 
                alt="Missões" 
                className="w-8 h-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-bebas text-xl text-white tracking-widest">Forjar Patente</span>
                <span className="font-barlow text-gray-500 text-[10px] uppercase font-bold tracking-widest">Ajustar níveis de XP</span>
              </div>
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}