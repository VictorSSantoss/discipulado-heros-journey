import Link from "next/link";
import prisma from "@/lib/prisma"; 
import { ICONS } from "@/constants/gameConfig";
import { getKingdomOverview } from "@/app/actions/dashboardActions";
import GuildaManagement from "@/components/admin/GuildaManagement"; 
import KingdomActivityChart from "@/components/admin/KingdomActivityChart";

export default async function AdminDashboard() {
  /* Server-side retrieval of kingdom analytics and administrative user data */
  const overview = await getKingdomOverview();
  const metrics = overview.data;
  const adminUser = await prisma.user.findFirst();

  return (
    <main className="p-6 max-w-7xl mx-auto min-h-screen flex flex-col pb-20 text-white font-barlow">
      
      {/* Header section providing the dashboard title and strategic context */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="hud-title-lg text-white m-0 flex items-center gap-4 text-5xl">
            <img 
              src={ICONS.overview}
              alt="Visão Geral"
              className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />
            VISÃO GERAL DO REINO
          </h1>
          <p className="hud-label-tactical mt-2 text-gray-400 italic-none tracking-[0.2em] uppercase">
            Centro de Comando e Inteligência Estratégica
          </p>
        </div>
      </header>

      {/* Guilda identity interface for managing crest and naming conventions */}
      {adminUser && (
        <section className="mb-10 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
          <GuildaManagement 
            userId={adminUser.id} 
            currentName={adminUser.guildaName || ""} 
            currentIcon={adminUser.guildaIcon || ""}
          />
        </section>
      )}

      {/* Primary metrics grid displaying real-time kingdom data with permanent color highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        
        {/* Metric container for total population count with teal brand highlights */}
        <div className="relative group bg-[#08090a] backdrop-blur-xl border border-brand/30 p-8 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-100"></div>
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand/10 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <h3 className="hud-label-tactical text-gray-400 uppercase tracking-[0.25em]">Total de Valentes</h3>
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src={ICONS.valentes} 
                alt="" 
                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(17,194,199,0.2)]" 
              />
            </div>
          </div>
          <p className="hud-value text-white relative z-10 text-6xl">
            {metrics?.totalValentes || 0}
          </p>
          <div className="flex items-center gap-2 mt-4 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
            <p className="hud-label-tactical text-brand uppercase text-[10px] tracking-widest">
              +{metrics?.newRecruitsThisMonth || 0} Recrutados este mês
            </p>
          </div>
        </div>
        
        {/* Metric container for weekly experience distribution with orange experience highlights */}
        <div className="relative group bg-[#08090a] backdrop-blur-xl border border-xp/30 p-8 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500">
          {/* Top gradient and border color set to match experience theme variable */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-xp/50 to-transparent opacity-100"></div>
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-xp/10 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <h3 className="hud-label-tactical text-gray-400 uppercase tracking-[0.25em]">XP Distribuído (Semana)</h3>
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src={ICONS.xp} 
                alt="" 
                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]" 
              />
            </div>
          </div>
          <p className="hud-value text-xp relative z-10 text-6xl">
            {metrics?.weeklyXp?.toLocaleString('pt-BR') || 0}
          </p>
          <div className="flex items-center gap-2 mt-4 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-xp animate-pulse"></span>
            <p className="hud-label-tactical text-xp/70 uppercase text-[10px] tracking-widest">
              Média de {metrics?.avgXp || 0} XP por Valente
            </p>
          </div>
        </div>

        {/* Metric container for mission engagement rates with green mission highlights */}
        <div className="relative group bg-[#08090a] backdrop-blur-xl border border-mission/30 p-8 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mission/50 to-transparent opacity-100"></div>
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-mission/10 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <h3 className="hud-label-tactical text-gray-400 uppercase tracking-[0.25em]">Engajamento Semanal</h3>
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src={ICONS.missoes} 
                alt="" 
                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(34,197,94,0.2)]" 
              />
            </div>
          </div>
          <p className="hud-value text-mission relative z-10 text-6xl">
            {metrics?.weeklyCompletedMissions || 0}
          </p>
          <div className="flex items-center gap-2 mt-4 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-mission animate-pulse"></span>
            <p className="hud-label-tactical text-mission/70 uppercase text-[10px] tracking-widest">
              {metrics?.totalAvailableMissions || 0} Missões no Mural
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-1000 delay-500">
        
        {/* Left column containing historical growth charts and activity logs */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#08090a] border border-white/5 rounded-2xl shadow-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-xp/50 to-transparent"></div>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="hud-title-md text-2xl text-white m-0 tracking-widest uppercase">MOMENTUM DO REINO</h2>
                <p className="hud-label-tactical text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Fluxo de XP dos últimos 7 dias</p>
              </div>
              <div className="text-right">
                <span className="hud-value text-xp text-3xl">+{metrics?.weeklyXp?.toLocaleString('pt-BR')} XP</span>
                <p className="hud-label-tactical text-[9px] text-xp/50 uppercase">Rendimento Semanal</p>
              </div>
            </div>
            
            <KingdomActivityChart data={metrics?.xpHistory || []} />
          </section>

          <section className="bg-[#08090a] border border-white/5 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="p-8 border-b border-white/5 bg-black/20">
              <h2 className="hud-title-md text-2xl text-white m-0 tracking-widest uppercase flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                REGISTRO DE COMBATE
              </h2>
            </div>
            
            <div className="p-8 space-y-4 max-h-[480px] overflow-y-auto custom-scrollbar">
              {metrics?.recentLogs && metrics.recentLogs.length > 0 ? (
                metrics.recentLogs.map((log: any) => (
                  <div key={log.id} className="flex justify-between items-center p-5 bg-black/40 rounded-xl border border-white/5 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-black/60 rounded-xl flex items-center justify-center hud-title-md text-white border border-white/10 overflow-hidden shadow-lg">
                        {log.valente.image ? (
                          <img src={log.valente.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          log.valente.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-barlow text-sm">
                          <strong className="text-white uppercase tracking-wider">{log.valente.name}</strong> 
                        </p>
                        <p className="hud-label-tactical text-brand text-[10px] mt-1 uppercase tracking-tighter">{log.reason}</p>
                      </div>
                    </div>
                    <div className="bg-xp/10 border border-xp/20 px-4 py-2 rounded-lg">
                      <span className="hud-value text-xp text-2xl">+{log.amount} XP</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-50">
                  <p className="hud-label-tactical text-gray-400 uppercase tracking-widest">Nenhuma atividade registrada.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar providing fast access to administrative creation forms */}
        <aside className="space-y-6">
          <section className="bg-[#08090a] border border-white/5 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative sticky top-6">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="p-8 border-b border-white/5 bg-black/20">
              <h2 className="hud-title-md text-2xl text-white m-0 tracking-widest uppercase">
                AÇÕES RÁPIDAS
              </h2>
            </div>
            
            <div className="p-8 flex flex-col gap-4">
              <Link href="/admin/valentes/create" className="flex items-center gap-5 p-5 bg-brand/5 border border-brand/30 rounded-xl transition-all group">
                <div className="w-14 h-14 flex items-center justify-center">
                  <img src={ICONS.valentes} alt="" className="w-12 h-12 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="hud-title-md text-lg text-brand uppercase">RECRUTAR VALENTE</span>
                  <span className="hud-label-tactical text-gray-500 text-[9px] uppercase tracking-widest">Nova ficha de combate</span>
                </div>
              </Link>

              <Link href="/admin/missoes" className="flex items-center gap-5 p-5 bg-mission/5 border border-mission/30 rounded-xl transition-all group">
                <div className="w-14 h-14 flex items-center justify-center">
                  <img src={ICONS.missoes} alt="" className="w-12 h-12 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="hud-title-md text-lg text-mission uppercase">CRIAR DECRETO</span>
                  <span className="hud-label-tactical text-gray-500 text-[9px] uppercase tracking-widest">Nova missão oficial</span>
                </div>
              </Link>

              <Link href="/admin/patentes" className="flex items-center gap-5 p-5 bg-white/5 border border-white/30 rounded-xl transition-all group">
                <div className="w-14 h-14 flex items-center justify-center">
                  <img src={ICONS.patentes} alt="" className="w-12 h-12 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="hud-title-md text-lg text-white uppercase">FORJAR PATENTE</span>
                  <span className="hud-label-tactical text-gray-500 text-[9px] uppercase tracking-widest">Ajustar hierarquia</span>
                </div>
              </Link>
            </div>
          </section>
        </aside>

      </div>
    </main>
  );
}