"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface LoveLanguages {
  presentes: number;
  toqueFisico: number;
  tempoQualidade: number;
  palavrasAfirmacao: number;
  atosServico: number;
}

export default function LoveLanguagesChart({ data }: { data?: LoveLanguages }) {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-gray-500 text-center py-10 font-barlow italic">Sem dados de linguagem...</div>;
  }

  // 1. DYNAMIC GRADIENT PALETTE
  // Each language gets a 2-color gradient to make it look rich and deep
  const LANG_CONFIG = [
    { name: 'Presentes', key: 'presentes', colors: ['#fbbf24', '#d97706'] },        // Gold
    { name: 'Toque Físico', key: 'toqueFisico', colors: ['#fb7185', '#e11d48'] },    // Rose
    { name: 'Tempo de Qual.', key: 'tempoQualidade', colors: ['#c084fc', '#6d28d9'] },// Purple
    { name: 'Afirmação', key: 'palavrasAfirmacao', colors: ['#22d3ee', '#0284c7'] }, // Cyan
    { name: 'Serviço', key: 'atosServico', colors: ['#34d399', '#059669'] },         // Emerald
  ];

  const chartData = LANG_CONFIG.map((lang, index) => ({
    name: lang.name,
    value: data[lang.key as keyof LoveLanguages] || 0,
    gradientId: `grad-${index}`,
    colors: lang.colors
  }));

  // 2. CUSTOM DARK TOOLTIP
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1c19] border border-gray-700 p-3 rounded-sm shadow-2xl">
          <p className="font-barlow text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">
            {payload[0].name}
          </p>
          <p className="font-staatliches text-white text-2xl leading-none">
            {payload[0].value} <span className="text-sm text-gray-500">Pts</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    // Increased height slightly to give the legend room to breathe
    <div className="h-[280px] w-full flex flex-col">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* INJECTING SVG GRADIENTS */}
            <defs>
              {chartData.map((entry, index) => (
                <linearGradient key={`grad-${index}`} id={entry.gradientId} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={entry.colors[0]} />
                  <stop offset="100%" stopColor={entry.colors[1]} />
                </linearGradient>
              ))}
            </defs>
            
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={6}           // Creates spacing between slices
              cornerRadius={6}           // Rounds the tips of the slices
              dataKey="value"
              stroke="#232622"           // Matches the card background to make cuts look transparent
              strokeWidth={3}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#${entry.gradientId})`} // Uses the custom gradients
                  className="hover:opacity-80 transition-opacity duration-300 outline-none" 
                />
              ))}
            </Pie>
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 3. THE CUSTOM LEGEND */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded-sm border border-gray-800 shadow-sm"
              style={{ background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})` }}
            />
            <span className="font-barlow text-gray-400 text-[9px] uppercase font-bold tracking-widest">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}