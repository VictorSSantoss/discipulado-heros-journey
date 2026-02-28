// src/constants/gameConfig.ts

export const ICONS = {
  home: '/images/nav-home.svg',
  valentes: '/images/nav-shield.svg',
  missoes: '/images/missions.svg',
  patentes: '/images/patente.svg',
  taverna: '/images/taverna-icon.svg',
  overview: '/images/chart.svg',
  xp: '/images/xp-icon.svg',
} as const;

export const SIDEBAR_MENU = [
  { name: 'Início', path: '/admin', iconPath: ICONS.home },
  { name: 'Valentes', path: '/admin/valentes', iconPath: ICONS.valentes },
  { name: 'Missões', path: '/admin/missoes', iconPath: ICONS.missoes },
  { name: 'Patentes', path: '/admin/patentes', iconPath: ICONS.patentes },
] as const;

export const LEVEL_SYSTEM = [
  { name: 'Nível 0', minXP: 0, icon: '/images/level-0.svg' },
  { name: 'Nível 1', minXP: 1000, icon: '/images/level-1.svg' },
  { name: 'Nível 2', minXP: 2000, icon: '/images/level-2.svg' },
  { name: 'Nível 3', minXP: 3500, icon: '/images/level-3.svg' },
  { name: 'Especial', minXP: 5000, icon: '/images/level-special.svg' },
  { name: 'Herói', minXP: 8000, icon: '/images/level-hero.svg' }
] as const;

export const ESTRUTURAS = {
  GAD: { 
    label: "GAD", 
    fullName: "Geração de Adoradores", 
    color: "#ea580c", 
    secondary: "#fb923c" 
  },
  MIDIA: { 
    label: "IMS", 
    fullName: "Mídia e Comunicação", 
    color: "#0ea5e9", 
    secondary: "#38bdf8" 
  },
  LOUVOR: { 
    label: "Louvor", 
    fullName: "Louvor e adoração", 
    color: "#8b5cf6", 
    secondary: "#a78bfa" 
  },
  NEWBREED: { 
    label: "New Breed", 
    fullName: "New Breed", 
    color: "#10b981", 
    secondary: "#34d399" 
  },
  INTERCESSAO: { 
    label: "Intercessão", 
    fullName: "Intercessão", 
    color: "#10b981", 
    secondary: "#34d399" 
  },
  GOE: { 
    label: "GOE", 
    fullName: "GOE", 
    color: "#10b981", 
    secondary: "#34d399" 
  }
} as const;

export const MISSION_CATEGORIES = [
  "Hábitos Espirituais",
  "Evangelismo e Liderança",
  "Conhecimento",
  "Estrutura e Participação",
  "Eventos e Especiais",
] as const;

export const BASE_ATTRIBUTES = [
  "Liderança",
  "Trabalho em Equipe",
  "Criatividade",
  "Resolução de Problemas",
  "Comunicação"
] as const;

export const LOVE_LANGUAGES = [
  { id: 'presentes', label: 'Presentes', colors: ['#fbbf24', '#d97706'] },
  { id: 'toqueFisico', label: 'Toque Físico', colors: ['#fb7185', '#e11d48'] },
  { id: 'tempoQualidade', label: 'Tempo de Qualidade', colors: ['#c084fc', '#6d28d9'] },
  { id: 'palavrasAfirmacao', label: 'Palavras de Afirmação', colors: ['#22d3ee', '#0284c7'] },
  { id: 'atosServico', label: 'Atos de Serviço', colors: ['#34d399', '#059669'] },
];