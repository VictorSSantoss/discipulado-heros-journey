import Link from "next/link";
import { ICONS } from "@/constants/gameConfig";
import { getKingdomOverview } from "@/app/actions/dashboardActions";

/**
 * AdminDashboard Component (Server Component)
 * Fetches live kingdom analytics and renders the strategic overview.
 */
export default async function AdminDashboard() {
  const overview = await getKingdomOverview();
  const metrics = overview.data;

  return (
    <main className="p-6 max-w-7xl mx-auto min-h-screen flex flex-col pb-20 text-white font-barlow">
      {/* CONTAINER 1: DASHBOARD_MASTER_WRAPPER */}
      
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        {/* CONTAINER 2: STRATEGIC_HEADER_BLOCK */}
        <div>
          <h1 className="hud-title-lg text-white m-0 flex items-center gap-4 text-5xl">
            <img 
              src={ICONS.overview}
              alt="Visão Geral"
              className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />
            VISÃO GERAL DO REINO
          </h1>
          <p className="hud-label-tactical mt-2 text-gray-400 italic-none tracking-[0.2em] uppercase">
            Resumo Estratégico do Discipulado
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* CONTAINER 3: CORE_METRICS_GRID */}
        
        {/* METRIC_CARD: TOTAL_VALENTES */}
        <div className="relative group bg-dark-bg/60 backdrop-blur-xl border border-white/5 border-t-brand/50 p-6 rounded-2xl shadow-2xl overflow-hidden hover:bg-brand/5 hover:border-brand/30 hover:border-t-brand transition-all">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="hud-label-tactical text-gray-400 uppercase tracking-widest">Total de Valentes</h3>
            <img src={ICONS.valentes} alt="Valentes" className="w-8 h-8 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
          </div>
          <p className="hud-value text-white relative z-10 text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            {metrics?.totalValentes || 0}
          </p>
          <p className="hud-label-tactical mt-3 text-brand relative z-10 italic-none uppercase text-xs">
            +{metrics?.newRecruitsThisMonth || 0} Recrutados este mês
          </p>
        </div>
        
        {/* METRIC_CARD: WEEKLY_XP_FLOW */}
        <div className="relative group bg-dark-bg/60 backdrop-blur-xl border border-white/5 border-t-xp/50 p-6 rounded-2xl shadow-2xl overflow-hidden hover:bg-xp/5 hover:border-xp/30 hover:border-t-xp transition-all">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-xp/50 to-transparent"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="hud-label-tactical text-gray-400 uppercase tracking-widest">XP Distribuído (Semana)</h3>
            <img src={ICONS.xp} alt="XP" className="w-8 h-8 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_10px_rgba(234,88,12,0.4)]" />
          </div>
          <p className="hud-value text-xp relative z-10 text-5xl drop-shadow-[0_0_15px_rgba(234,88,12,0.6)]">
            {metrics?.weeklyXp?.toLocaleString('pt-BR') || 0}
          </p>
          <p className="hud-label-tactical mt-3 text-xp/70 relative z-10 italic-none uppercase text-xs">
            Média de {metrics?.avgXp || 0} XP por Valente
          </p>
        </div>

        {/* METRIC_CARD: ENGAJAMENTO_SEMANAL */}
        <div className="relative group bg-dark-bg/60 backdrop-blur-xl border border-white/5 border-t-mission/50 p-6 rounded-2xl shadow-2xl overflow-hidden hover:bg-mission/5 hover:border-mission/30 hover:border-t-mission transition-all">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mission/50 to-transparent"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="hud-label-tactical text-gray-400 uppercase tracking-widest">Engajamento Semanal</h3>
            <img src={ICONS.missoes} alt="Missões" className="w-8 h-8 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
          </div>
          <p className="hud-value text-mission relative z-10 text-5xl drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">
            {metrics?.weeklyCompletedMissions || 0}
          </p>
          <p className="hud-label-tactical mt-3 text-mission/70 relative z-10 italic-none uppercase text-xs">
            {metrics?.totalAvailableMissions || 0} Missões no Mural
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CONTAINER 4: OPERATIONAL_DATA_GRID */}
        
        <section className="lg:col-span-2 bg-dark-bg/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {/* COMBAT_LOG_VIEWPORT */}
          <div className="p-8 border-b border-white/5">
            <h2 className="hud-title-md text-3xl text-white m-0 flex items-center gap-3">
              REGISTRO DE COMBATE
            </h2>
            <p className="hud-label-tactical mt-2 text-gray-400 uppercase tracking-widest">Últimas atividades do reino</p>
          </div>
          
          <div className="p-8 space-y-4 flex-1 overflow-y-auto">
            {metrics?.recentLogs && metrics.recentLogs.length > 0 ? (
              metrics.recentLogs.map((log: any) => (
                <div key={log.id} className="flex justify-between items-center p-5 bg-black/40 backdrop-blur-sm rounded-xl border border-white/5 hover:border-brand/30 hover:border-t-brand/50 hover:bg-brand/5 transition-all group shadow-inner">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-black/60 rounded-xl flex items-center justify-center hud-title-md text-white border border-white/10 shadow-lg overflow-hidden">
                      {log.valente.image ? (
                        <img src={log.valente.image} alt={log.valente.name} className="w-full h-full object-cover" />
                      ) : (
                        log.valente.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-barlow text-gray-400 text-sm">
                        <strong className="text-white uppercase tracking-wider">{log.valente.name}</strong> 
                      </p>
                      <p className="hud-label-tactical text-brand italic-none text-xs mt-1">{log.reason}</p>
                    </div>
                  </div>
                  <div className="bg-xp/10 border border-xp/20 px-4 py-2 rounded-lg shadow-[inset_0_1px_4px_rgba(234,88,12,0.2)]">
                    <span className="hud-value text-xp text-2xl drop-shadow-[0_0_5px_rgba(234,88,12,0.4)]">+{log.amount} XP</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-50">
                <p className="hud-label-tactical text-gray-400 uppercase tracking-widest">Nenhuma atividade recente registrada.</p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-dark-bg/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {/* QUICK_ACTION_COMMAND_CENTER */}
          <div className="p-8 border-b border-white/5">
            <h2 className="hud-title-md text-3xl text-white m-0">
              AÇÕES RÁPIDAS
            </h2>
          </div>
          <div className="p-8 flex flex-col gap-4 flex-1">
            
            <Link href="/admin/valentes/create" className="flex items-center gap-5 p-5 bg-black/40 backdrop-blur-sm border border-white/5 rounded-xl transition-all group hover:bg-brand/5 hover:border-brand/30 hover:border-t-brand/50 shadow-inner">
              <img src={ICONS.valentes} alt="Recrutar" className="w-10 h-10 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
              <div className="flex flex-col">
                <span className="hud-title-md text-xl text-white group-hover:text-brand transition-colors">RECRUTAR VALENTE</span>
                <span className="hud-label-tactical text-gray-400 text-xs">Adicionar nova ficha</span>
              </div>
            </Link>

            <Link href="/admin/missoes" className="flex items-center gap-5 p-5 bg-black/40 backdrop-blur-sm border border-white/5 rounded-xl transition-all group hover:bg-mission/5 hover:border-mission/30 hover:border-t-mission/50 shadow-inner">
              <img src={ICONS.missoes} alt="Missões" className="w-10 h-10 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
              <div className="flex flex-col">
                <span className="hud-title-md text-xl text-white group-hover:text-mission transition-colors">CRIAR DECRETO</span>
                <span className="hud-label-tactical text-gray-400 text-xs">Nova missão para a tropa</span>
              </div>
            </Link>

            <Link href="/admin/patentes" className="flex items-center gap-5 p-5 bg-black/40 backdrop-blur-sm border border-white/5 rounded-xl transition-all group hover:bg-white/5 hover:border-white/30 hover:border-t-white/50 shadow-inner">
              <img src={ICONS.patentes} alt="Patentes" className="w-10 h-10 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
              <div className="flex flex-col">
                <span className="hud-title-md text-xl text-white group-hover:text-white transition-colors">FORJAR PATENTE</span>
                <span className="hud-label-tactical text-gray-400 text-xs">Ajustar níveis de XP</span>
              </div>
            </Link>

          </div>
        </section>

      </div>
    </main>
  );
}