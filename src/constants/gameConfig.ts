// src/constants/gameConfig.ts

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