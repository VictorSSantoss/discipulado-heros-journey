"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

/* GLOBAL CONFIGURATION IMPORTS */
import { LOVE_LANGUAGES } from '@/constants/gameConfig';

type LoveLanguages = any; 

/**
 * LoveLanguagesChart Component
 * Visualizes the hero's primary emotional and relational drivers.
 * Recalibrated for a more compact, high-density HUD aesthetic.
 */
export default function LoveLanguagesChart({ data }: { data?: LoveLanguages }) {
  
  /* ERROR_BOUNDARY: EMPTY_STATE */
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="hud-label-tactical text-gray-500 text-center py-8 italic-none">
        Sem registros de linguagem...
      </div>
    );
  }

  /* DATA_MAPPING_LOGIC */
  const chartData = LOVE_LANGUAGES.map((lang, index) => ({
    name: lang.name,
    value: data[lang.key] || 0,
    gradientId: `grad-love-${index}`,
    colors: lang.colors
  }));

  /**
   * CustomTooltip Component
   * Refined to a smaller footprint to prevent UI occlusion.
   */
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-bg/95 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-2xl">
          {/* TOOLTIP_METADATA */}
          <p className="hud-label-tactical text-[9px] text-gray-500 mb-0.5 italic-none">
            {payload[0].name}
          </p>
          {/* TOOLTIP_VALUE */}
          <p className="hud-value text-white text-xl leading-none">
            {payload[0].value} <span className="text-[10px] hud-label-tactical text-gray-700 italic-none">PTS</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[260px] w-full flex flex-col">
      {/* CONTAINER 1: REFINED_CHART_VIEWPORT */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {/* SVG_GRADIENT_DEFINITIONS */}
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
              innerRadius={50}  /* Reduced from 60 */
              outerRadius={80}  /* Reduced from 95 */
              paddingAngle={6}
              cornerRadius={6}
              dataKey="value"
              stroke="none"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#${entry.gradientId})`}
                  className="hover:opacity-80 transition-opacity duration-300 outline-none" 
                />
              ))}
            </Pie>
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* CONTAINER 2: COMPACT_LEGEND_GRID */}
      {/* Tighter spacing and smaller fonts to maintain the rectangular dashboard feel. */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div 
              className="w-4 h-4 rounded-md border border-white/5 shadow-sm"
              style={{ background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})` }}
            />
            <span className="hud-label-tactical text-gray-500 text-[9px] italic-none">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}