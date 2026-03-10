"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ATTRIBUTE_MAP } from "@/constants/gameConfig";

const ATTRIBUTE_MILESTONES = [5, 10, 25, 50, 100];
const MAX_ATTRIBUTE_POINTS = 100;
// ⚔️ The 'Visual Base' ensures the chart has a shape at Level 0 but allows 1-point movements.
const VISUAL_BASE = 5; 

const CustomDot = (props: any) => {
  const { cx, cy, value, stroke } = props;
  
  // Subtract the visual base to get the player's actual points for milestone checking
  const actualValue = value - VISUAL_BASE;
  const reachedMilestone = ATTRIBUTE_MILESTONES.slice().reverse().find(m => actualValue >= m);
  
  // Base vertex dot - Always visible so the player sees the "growth points"
  let radius = 1.5;
  let opacity = 0.4;

  if (reachedMilestone) {
    if (reachedMilestone >= 100) { radius = 8; opacity = 1; }
    else if (reachedMilestone >= 50) { radius = 6; opacity = 0.9; }
    else if (reachedMilestone >= 25) { radius = 5; opacity = 0.8; }
    else if (reachedMilestone >= 10) { radius = 4; opacity = 0.7; }
    else if (reachedMilestone >= 5) { radius = 3; opacity = 0.6; }
  }

  return (
    <g>
      {reachedMilestone && (
        <circle cx={cx} cy={cy} r={radius * 2.5} fill={stroke} opacity={opacity * 0.3} className="animate-pulse" />
      )}
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
        className="hud-label-tactical uppercase tracking-widest"
        style={{ fontSize: '10px' }}
      >
        {words.map((word: string, index: number) => (
          <tspan x={0} dy={index === 0 ? 0 : 12} key={index}>{word}</tspan>
        ))}
      </text>
    </g>
  );
};

export default function AttributesChart({ skills, theme }: { skills?: any, theme?: { hex: string } }) {
  const activeColor = theme?.hex || "#ea580c";

  if (!skills) return (
    <div className="hud-label-tactical text-gray-500 text-center py-10 tracking-widest opacity-40">
      AGUARDANDO DADOS TÁTICOS...
    </div>
  );

  // ⚔️ DYNAMIC DATA MAPPING
  // We add VISUAL_BASE to every value so Level 1-7 is no longer hidden by a floor.
  const data = [
    { subject: ATTRIBUTE_MAP.forca, A: (skills.forca || 0) + VISUAL_BASE },
    { subject: ATTRIBUTE_MAP.destreza, A: (skills.destreza || 0) + VISUAL_BASE },
    { subject: ATTRIBUTE_MAP.constituicao, A: (skills.constituicao || 0) + VISUAL_BASE },
    { subject: ATTRIBUTE_MAP.inteligencia, A: (skills.inteligencia || 0) + VISUAL_BASE },
    { subject: ATTRIBUTE_MAP.sabedoria, A: (skills.sabedoria || 0) + VISUAL_BASE },
    { subject: ATTRIBUTE_MAP.carisma, A: (skills.carisma || 0) + VISUAL_BASE },
  ];

  return (
    <div className="h-[280px] w-full relative group">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="w-48 h-48 border border-white rounded-full animate-pulse" />
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#374151" strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
          
          {/* ⚔️ Domain is adjusted to account for the Visual Base offset */}
          <PolarRadiusAxis 
            domain={[0, MAX_ATTRIBUTE_POINTS + VISUAL_BASE]} 
            tick={false} 
            axisLine={false} 
          />
          
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
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                // Display the REAL value to the user, not the offset value
                const realValue = (payload[0].value as number) - VISUAL_BASE;
                return (
                  <div className="bg-black/90 border border-white/10 p-2 rounded shadow-xl backdrop-blur-md">
                    <p className="hud-label-tactical text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                      {payload[0].payload.subject}
                    </p>
                    <p className="hud-value text-xl" style={{ color: activeColor }}>
                      {realValue}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}