"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * CustomTick Component
 * Optimized for scannability and HUD aesthetics.
 */
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

/**
 * AttributesChart Component
 * Now accepts a 'theme' prop to sync colors with the Valente's structure.
 */
export default function AttributesChart({ skills, theme }: { skills?: any, theme?: { hex: string } }) {
  // Fallback to orange if no theme is provided
  const activeColor = theme?.hex || "#ea580c";

  if (!skills) return (
    <div className="hud-label-tactical text-gray-500 text-center py-10 italic-none tracking-widest opacity-40">
      AGUARDANDO DADOS TÁTICOS...
    </div>
  );

  const data = [
    { subject: 'FORÇA', A: skills.forca || 0 },
    { subject: 'DESTREZA', A: skills.destreza || 0 },
    { subject: 'CONSTITUIÇÃO', A: skills.constituicao || 0 },
    { subject: 'INTELIGÊNCIA', A: skills.inteligencia || 0 },
    { subject: 'SABEDORIA', A: skills.sabedoria || 0 },
    { subject: 'CARISMA', A: skills.carisma || 0 },
  ];

  return (
    <div className="h-[280px] w-full relative group">
      {/* Background Decorative HUD Ring */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="w-48 h-48 border border-white rounded-full animate-pulse" />
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          {/* Grid lines now match the tech-look */}
          <PolarGrid stroke="#374151" strokeDasharray="3 3" />
          
          <PolarAngleAxis 
            dataKey="subject" 
            tick={<CustomTick />} 
          />
          
          {/* Radius set to 15 to allow room for growth/XP buffs */}
          <PolarRadiusAxis domain={[0, 15]} tick={false} axisLine={false} />
          
          <Radar 
            name="Atributos" 
            dataKey="A" 
            stroke={activeColor} 
            fill={activeColor} 
            fillOpacity={0.4} 
            strokeWidth={2}
            animationBegin={300}
            animationDuration={1500}
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