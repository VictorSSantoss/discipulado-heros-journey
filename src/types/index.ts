// src/types/index.ts

export type LevelName = 'Valente de Nível 3' | 'Valente de Nível 2' | 'Valente de Nível 1' | 'Valente de Nível Especial';

export interface DiscipleSkills {
  // We use the exact names used in the UI sliders
  Liderança: number;
  TrabalhoEmEquipe: number;
  Criatividade: number;
  ResoluçãoDeProblemas: number;
  Comunicação: number;
}

export interface PowerHabit {
  current: number;
  goal: number;
  streak: number;
  unit: string;
}

export interface HolyPower {
  Oração: PowerHabit;
  Leitura: PowerHabit;
  Jejum: PowerHabit;
}

export interface LoveLanguages {
  presentes: number;
  toqueFisico: number;
  tempoQualidade: number;
  palavrasAfirmacao: number;
  atosServico: number;
}

export interface Mission {
  id: string;
  title: string;
  xpReward: number | 'LVL UP DIRETO';
  category: 'Hábitos Espirituais' | 'Evangelismo e Liderança' | 'Conhecimento' | 'Estrutura e Participação' | 'Eventos e Especiais';
  description?: string;
}

// Renamed to Valente to match the project theme
export interface Valente {
  id: string;
  name: string;
  image?: string;
  totalXP: number;
  structure: string;
  description?: string;
  friendIds?: string[];
  skills: DiscipleSkills;
  holyPower: HolyPower;
  loveLanguages?: LoveLanguages; // Optional for now
}