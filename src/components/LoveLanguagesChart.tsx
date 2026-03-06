"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

/* GLOBAL CONFIGURATION IMPORTS */
import { LOVE_LANGUAGES } from '@/constants/gameConfig';

// 1. ADDED: Define the interface to include the color prop
interface LoveLanguagesProps {
  data?: any;
  color?: string; // This fixes the TypeScript error in the Profile Client
}

export default function LoveLanguagesChart({ data, color }: LoveLanguagesProps) {
  
  /* ERROR_BOUNDARY: EMPTY_STATE */
  if (!data || Object.keys(data).length === 0) {
    return (
      <div 
        className="hud-label-tactical text-center py-8 italic-none uppercase tracking-widest opacity-50"
        style={{ color: color }} // Uses theme color even in empty state
      >
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
        <div className="bg-dark-bg/95 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-2xl z-50">
          <p className="hud-label-tactical text-[9px] text-gray-500 mb-0.5 italic-none uppercase">
            {payload[0].name}
          </p>
          <p className="hud-value text-white text-xl leading-none font-bold">
            {payload[0].value} <span className="text-[10px] hud-label-tactical text-gray-700 italic-none">PTS</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[260px] w-full flex flex-col group">
      {/* CONTAINER 1: REFINED_CHART_VIEWPORT */}
      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
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
              innerRadius={50}
              outerRadius={80}
              paddingAngle={6}
              cornerRadius={6}
              dataKey="value"
              stroke="none"
              strokeWidth={0}
              isAnimationActive={true}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#${entry.gradientId})`}
                  className="hover:opacity-80 transition-opacity duration-300 outline-none cursor-crosshair" 
                />
              ))}
            </Pie>
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'transparent' }} 
              wrapperStyle={{ outline: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* CONTAINER 2: COMPACT_LEGEND_GRID */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 transition-transform hover:scale-105">
            <div 
              className="w-3 h-3 rounded-sm border border-white/5 shadow-sm"
              style={{ background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})` }}
            />
            <span className="hud-label-tactical text-gray-500 text-[9px] italic-none uppercase tracking-tighter">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}