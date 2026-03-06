"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LogEntry {
  id: string;
  amount: number;
  reason: string;
  createdAt: Date | string;
}

export default function MissionLog({ logs }: { logs?: LogEntry[] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="hud-label-tactical text-gray-600 text-center py-10 opacity-30 tracking-[0.2em]">
        SEM REGISTROS DE MISSÃO...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-black/20 rounded-xl border border-white/5 overflow-hidden">
      {/* HEADER TACTICAL STRIP */}
      <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex justify-between items-center">
        <span className="hud-label-tactical text-[10px] text-gray-400 tracking-widest uppercase">
          Fluxo de Atividade
        </span>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
      </div>

      {/* SCROLLABLE LOG AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 max-h-[300px]">
        {logs.map((log) => {
          const isPositive = log.amount >= 0;
          
          return (
            <div 
              key={log.id} 
              className="group flex items-center justify-between gap-4 border-b border-white/[0.02] pb-3 last:border-0"
            >
              <div className="flex flex-col gap-1">
                <span className="hud-value text-sm text-white/90 group-hover:text-white transition-colors">
                  {log.reason}
                </span>
                <span className="hud-label-tactical text-[9px] text-gray-600 uppercase">
                  {format(new Date(log.createdAt), "dd MMM · HH:mm", { locale: ptBR })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`hud-value text-lg ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{log.amount}
                </span>
                <span className="hud-label-tactical text-[8px] text-gray-700 font-bold">XP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER DECORATION */}
      <div className="bg-white/[0.02] px-4 py-1.5 flex justify-center">
        <div className="w-1/3 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}