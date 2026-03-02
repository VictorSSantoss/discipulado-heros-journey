"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

/* GLOBAL CONFIGURATION IMPORTS */
/* Synchronizes the chart axes with the core attribute definitions. */
import { BASE_ATTRIBUTES } from '@/constants/gameConfig';

type Skills = Record<string, number>;

/**
 * CustomTick Component
 * Handles multi-line label rendering for long attribute names.
 * Font size increased to 11px for enhanced legibility on higher-density displays.
 */
const CustomTick = ({ payload, x, y, textAnchor }: any) => {
  const words = payload.value.split(' ');

  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        textAnchor={textAnchor} 
        fill="#9ca3af" 
        className="hud-label-tactical italic-none"
        style={{ fontSize: '11px' }} /* Increased from 8px for better visibility */
      >
        {words.map((word: string, index: number) => (
          <tspan 
            x={0} 
            dy={index === 0 ? 0 : 12} /* Increased dy to 12 to match larger font size */
            key={index}
          >
            {word}
          </tspan>
        ))}
      </text>
    </g>
  );
};

/**
 * AttributesChart Component
 * Renders a radar visualization of a Valente's tactical capabilities.
 */
export default function AttributesChart({ skills }: { skills?: Skills }) {
  /* ERROR_BOUNDARY: EMPTY_STATE */
  if (!skills) return (
    <div className="hud-label-tactical text-gray-500 text-center py-10 italic-none">
      Sem atributos registrados...
    </div>
  );

  /* DATA_MAPPING_LOGIC */
  const data = BASE_ATTRIBUTES.map((attr) => {
    const matchingKey = Object.keys(skills).find(
      (k) => k.replace(/\s/g, '').toLowerCase() === attr.replace(/\s/g, '').toLowerCase()
    );

    return {
      subject: attr.toUpperCase(), 
      A: matchingKey ? skills[matchingKey] : 0,
      fullMark: 10 
    };
  });

  return (
    <div className="h-[250px] w-full">
      {/* CHART_VIEWPORT_CONTAINER */}
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
          <PolarGrid stroke="#374151" />
          
          <PolarAngleAxis 
            dataKey="subject" 
            tick={<CustomTick />} 
          />
          
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          
          <Radar 
            name="Atributos" 
            dataKey="A" 
            stroke="#ea580c" 
            fill="#ea580c" 
            fillOpacity={0.5} 
          />
          
          <Tooltip<number, string>
            contentStyle={{ 
              backgroundColor: '#1a1c19', 
              borderColor: '#374151', 
              borderRadius: '8px', 
              borderWidth: '1px'
            }}
            itemStyle={{ 
              color: '#ea580c', 
              fontWeight: 'bold', 
              fontFamily: 'var(--font-barlow)',
              fontSize: '11px',
              textTransform: 'uppercase'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}