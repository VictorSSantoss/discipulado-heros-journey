"use client";

import Link from "next/link";
import { ICONS } from "@/constants/gameConfig";

/**
 * AdminDashboard Component
 * Primary management interface for the kingdom.
 * Displays strategic metrics and quick-access administrative triggers.
 */
export default function AdminDashboard() {
  return (
    <main className="p-6 max-w-7xl mx-auto min-h-screen flex flex-col pb-20 text-white">
      {/* CONTAINER 1: DASHBOARD_MASTER_WRAPPER */}
      
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        {/* CONTAINER 2: STRATEGIC_HEADER_BLOCK */}
        <div>
          <h1 className="hud-title-lg text-white m-0 flex items-center gap-4">
            <img 
              src={ICONS.overview}
              alt="Visão Geral"
              className="w-12 h-12 object-contain"
            />
            Visão Geral do Reino
          </h1>
          <p className="hud-label-tactical mt-1 text-gray-400 italic-none">
            Resumo Estratégico do Discipulado
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* CONTAINER 3: CORE_METRICS_GRID */}
        
        {/* METRIC_CARD: TOTAL_VALENTES */}
        <div className="relative group bg-dark-bg backdrop-blur-md border border-white/5 border-t-brand/50 p-6 rounded-xl shadow-lg overflow-hidden hover:bg-brand/5 hover:border-brand/30 hover:border-t-brand transition-all">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <h3 className="hud-label-tactical text-gray-400">Total de Valentes</h3>
            <img src={ICONS.valentes} alt="Valentes" className="w-8 h-8 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
          </div>
          <p className="hud-value text-white relative z-10">45</p>
          <p className="hud-label-tactical mt-2 text-brand relative z-10 italic-none">
            +3 Recrutados este mês
          </p>
        </div>
        
        {/* METRIC_CARD: WEEKLY_XP_FLOW */}
        <div className="relative group bg-dark-bg backdrop-blur-md border border-white/5 border-t-xp/50 p-6 rounded-xl shadow-lg overflow-hidden hover:bg-xp/5 hover:border-xp/30 hover:border-t-xp transition-all">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-xp/30 to-transparent"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <h3 className="hud-label-tactical text-gray-400">XP Distribuído (Semana)</h3>
            <img src={ICONS.xp} alt="XP" className="w-8 h-8 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
          </div>
          <p className="hud-value text-xp relative z-10">12.500</p>
          <p className="hud-label-tactical mt-2 text-xp/70 relative z-10 italic-none">
            Média de 277 XP por Valente
          </p>
        </div>

        {/* METRIC_CARD: ACTIVE_DECREES */}
        <div className="relative group bg-dark-bg backdrop-blur-md border border-white/5 border-t-mission/50 p-6 rounded-xl shadow-lg overflow-hidden hover:bg-mission/5 hover:border-mission/30 hover:border-t-mission transition-all">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mission/30 to-transparent"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <h3 className="hud-label-tactical text-gray-400">Decretos Ativos</h3>
            <img src={ICONS.missoes} alt="Missões" className="w-8 h-8 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
          </div>
          <p className="hud-value text-mission relative z-10">26</p>
          <p className="hud-label-tactical mt-2 text-mission/70 relative z-10 italic-none">
            8 Missões expiram em breve
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CONTAINER 4: OPERATIONAL_DATA_GRID */}
        
        <section className="lg:col-span-2 bg-dark-border backdrop-blur-xl border border-white/5 rounded-xl shadow-2xl overflow-hidden flex flex-col">
          {/* COMBAT_LOG_VIEWPORT */}
          <div className="p-6 border-b border-white/5 bg-dark-bg">
            <h2 className="hud-title-md text-white m-0 flex items-center gap-3">
              Registro de Combate
            </h2>
            <p className="hud-label-tactical mt-1 text-gray-400">Últimas atividades do reino</p>
          </div>
          
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            {[
              { name: "Cadu", mission: "Ler Neemias", xp: 300, initial: "C" },
              { name: "Nathan", mission: "Participar da Sala de Oração", xp: 200, initial: "N" }
            ].map((log, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-dark-surface backdrop-blur-sm rounded-xl border border-white/5 hover:border-brand/30 hover:border-t-brand/50 hover:bg-brand/5 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-dark-surface rounded-lg flex items-center justify-center hud-title-md text-white border border-white/10 shadow-inner">{log.initial}</div>
                  <div>
                    <p className="font-barlow text-gray-400 text-sm">
                      <strong className="text-white">{log.name}</strong> completou a missão:
                    </p>
                    <p className="hud-label-tactical text-brand italic-none">{log.mission}</p>
                  </div>
                </div>
                <div className="bg-xp/10 border border-xp/20 px-3 py-1 rounded-md shadow-[inset_0_1px_4px_rgba(234,88,12,0.2)]">
                  <span className="hud-value text-xp text-xl drop-shadow-[0_0_5px_rgba(234,88,12,0.4)]">+{log.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-dark-border backdrop-blur-xl border border-white/5 rounded-xl shadow-2xl overflow-hidden flex flex-col">
          {/* QUICK_ACTION_COMMAND_CENTER */}
          <div className="p-6 border-b border-white/5 bg-dark-bg">
            <h2 className="hud-title-md text-white m-0">
              Ações Rápidas
            </h2>
          </div>
          <div className="p-6 flex flex-col gap-4 flex-1">
            
            <Link href="/admin/valentes/novo" className="flex items-center gap-4 p-4 bg-dark-surface backdrop-blur-sm border border-white/5 rounded-xl transition-all group hover:bg-brand/5 hover:border-brand/30 hover:border-t-brand/50">
              <img src={ICONS.valentes} alt="Recrutar" className="w-8 h-8 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              <div className="flex flex-col">
                <span className="hud-title-md text-white group-hover:text-brand transition-colors">Recrutar Valente</span>
                <span className="hud-label-tactical text-gray-400">Adicionar nova ficha</span>
              </div>
            </Link>

            <Link href="/admin/missoes" className="flex items-center gap-4 p-4 bg-dark-bg/40 backdrop-blur-sm border border-white/5 rounded-xl transition-all group hover:bg-mission/5 hover:border-mission/30 hover:border-t-mission/50">
              <img src={ICONS.missoes} alt="Missões" className="w-8 h-8 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              <div className="flex flex-col">
                <span className="hud-title-md text-white group-hover:text-mission transition-colors">Criar Decreto</span>
                <span className="hud-label-tactical text-gray-400">Nova missão para a tropa</span>
              </div>
            </Link>

            <Link href="/admin/patentes" className="flex items-center gap-4 p-4 bg-dark-bg/40 backdrop-sm border border-white/5 rounded-xl transition-all group hover:bg-white/5 hover:border-white/30 hover:border-t-white/50">
              <img src={ICONS.patentes} alt="Patentes" className="w-8 h-8 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              <div className="flex flex-col">
                <span className="hud-title-md text-white group-hover:text-white transition-colors">Forjar Patente</span>
                <span className="hud-label-tactical text-gray-400">Ajustar níveis de XP</span>
              </div>
            </Link>

          </div>
        </section>

      </div>
    </main>
  );
}