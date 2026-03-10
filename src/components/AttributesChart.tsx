"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ATTRIBUTE_MAP } from "@/constants/gameConfig"; // ⚔️ Dynamic Mapping Import

/**
 * SCALABLE PROGRESSION ENGINE
 * Define the milestones that trigger glowing UI nodes on the chart.
 */
const ATTRIBUTE_MILESTONES = [5, 10, 25, 50, 100];
const MAX_ATTRIBUTE_POINTS = 100;

/**
 * CustomDot Component
 * Renders glowing Orbs at the vertices of the radar chart based on milestones.
 */
const CustomDot = (props: any) => {
  const { cx, cy, value, stroke } = props;
  
  // Find the highest milestone the player has reached for this specific attribute
  const reachedMilestone = ATTRIBUTE_MILESTONES.slice().reverse().find(m => value >= m);
  
  if (!reachedMilestone) return null;

  let radius = 2;
  let opacity = 0.5;

  if (reachedMilestone >= 100) { radius = 8; opacity = 1; }
  else if (reachedMilestone >= 50) { radius = 6; opacity = 0.9; }
  else if (reachedMilestone >= 25) { radius = 5; opacity = 0.8; }
  else if (reachedMilestone >= 10) { radius = 4; opacity = 0.7; }
  else if (reachedMilestone >= 5) { radius = 3; opacity = 0.6; }

  return (
    <g>
      <circle cx={cx} cy={cy} r={radius * 2.5} fill={stroke} opacity={opacity * 0.3} className="animate-pulse" />
      <circle cx={cx} cy={cy} r={radius} fill={stroke} opacity={opacity} />
    </g>
  );
};

const CustomTick = ({ payload, x, y, textAnchor }: any) => {
  const words = payload.value.split(' ');

  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        textAnchor={textAnchor} 
        fill="#9ca3af" 
        className="hud-label-tactical italic-none uppercase tracking-widest"
        style={{ fontSize: '10px' }}
      >
        {words.map((word: string, index: number) => (
          <tspan x={0} dy={index === 0 ? 0 : 12} key={index}>
            {word}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export default function AttributesChart({ skills, theme }: { skills?: any, theme?: { hex: string } }) {
  const activeColor = theme?.hex || "#ea580c";

  if (!skills) return (
    <div className="hud-label-tactical text-gray-500 text-center py-10 italic-none tracking-widest opacity-40">
      AGUARDANDO DADOS TÁTICOS...
    </div>
  );

  /**
   * ⚔️ DYNAMIC DATA MAPPING
   * We now use the ATTRIBUTE_MAP from gameConfig to define the labels (subject).
   * This ensures consistency between the Database and the HUD.
   */
  const data = [
    { subject: ATTRIBUTE_MAP.forca, A: Math.max(skills.forca || 1, 8) },
    { subject: ATTRIBUTE_MAP.destreza, A: Math.max(skills.destreza || 1, 8) },
    { subject: ATTRIBUTE_MAP.constituicao, A: Math.max(skills.constituicao || 1, 8) },
    { subject: ATTRIBUTE_MAP.inteligencia, A: Math.max(skills.inteligencia || 1, 8) },
    { subject: ATTRIBUTE_MAP.sabedoria, A: Math.max(skills.sabedoria || 1, 8) },
    { subject: ATTRIBUTE_MAP.carisma, A: Math.max(skills.carisma || 1, 8) },
  ];

  return (
    <div className="h-[280px] w-full relative group">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="w-48 h-48 border border-white rounded-full animate-pulse" />
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#374151" strokeDasharray="3 3" />
          
          <PolarAngleAxis 
            dataKey="subject" 
            tick={<CustomTick />} 
          />
          
          <PolarRadiusAxis domain={[0, MAX_ATTRIBUTE_POINTS]} tick={false} axisLine={false} />
          
          <Radar 
            name="Atributos" 
            dataKey="A" 
            stroke={activeColor} 
            fill={activeColor} 
            fillOpacity={0.4} 
            strokeWidth={2}
            animationBegin={300}
            animationDuration={1500}
            dot={<CustomDot stroke={activeColor} />}
          />
          
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'rgba(10, 10, 10, 0.9)', 
              borderColor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '4px', 
              borderWidth: '1px',
              backdropFilter: 'blur(8px)'
            }}
            itemStyle={{ 
              color: activeColor, 
              fontWeight: 'bold', 
              fontFamily: 'var(--font-barlow)',
              fontSize: '12px',
              textTransform: 'uppercase'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}