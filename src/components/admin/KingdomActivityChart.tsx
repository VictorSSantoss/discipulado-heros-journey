"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

/**
 * Tactical XP Chart Component
 * Visualizes kingdom momentum over time.
 */
export default function KingdomActivityChart({ data }: { data: any[] }) {
  // Mock data if none is provided yet
  const chartData = data?.length > 0 ? data : [
    { day: 'Seg', xp: 400 },
    { day: 'Ter', xp: 700 },
    { day: 'Qua', xp: 500 },
    { day: 'Qui', xp: 1200 },
    { day: 'Sex', xp: 900 },
    { day: 'Sáb', xp: 1500 },
    { day: 'Dom', xp: 2100 },
  ];

  return (
    <div className="w-full h-[300px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(255,255,255,0.05)" 
          />
          
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }}
            dy={10}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 10 }}
          />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#08090a', 
              border: '1px solid rgba(234, 88, 12, 0.3)',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'inherit'
            }}
            itemStyle={{ color: '#ea580c', textTransform: 'uppercase' }}
            cursor={{ stroke: '#ea580c', strokeWidth: 1 }}
          />
          
          <Area 
            type="stepAfter" 
            dataKey="xp" 
            stroke="#ea580c" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorXp)" 
            animationDuration={2000}
            dot={{ r: 4, fill: '#08090a', stroke: '#ea580c', strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#ea580c' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}