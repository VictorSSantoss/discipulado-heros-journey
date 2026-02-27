"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

// Define exactly what the chart should expect
interface Skills {
  Liderança: number;
  TrabalhoEmEquipe: number;
  Criatividade: number;
  ResoluçãoDeProblemas: number;
  Comunicação: number;
}

export default function AttributesChart({ skills }: { skills?: Skills }) {
  if (!skills) return <div className="text-gray-500 text-center py-10 font-barlow italic">Sem atributos registrados...</div>;

  // Map the new capitalized keys to the chart data
  const data = [
    { subject: 'LIDERANÇA', A: skills.Liderança, fullMark: 10 },
    { subject: 'EQUIPE', A: skills.TrabalhoEmEquipe, fullMark: 10 },
    { subject: 'CRIATIVIDADE', A: skills.Criatividade, fullMark: 10 },
    { subject: 'RESOLUÇÃO', A: skills.ResoluçãoDeProblemas, fullMark: 10 },
    { subject: 'COMUNICAÇÃO', A: skills.Comunicação, fullMark: 10 },
  ];

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'var(--font-barlow)', fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar name="Atributos" dataKey="A" stroke="#ea580c" fill="#ea580c" fillOpacity={0.5} />
          <Tooltip<number, string>
            contentStyle={{ backgroundColor: '#1a1c19', borderColor: '#374151', borderRadius: '4px', fontFamily: 'var(--font-barlow)' }}
            itemStyle={{ color: '#ea580c', fontWeight: 'bold' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}