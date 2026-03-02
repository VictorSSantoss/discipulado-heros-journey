import { Valente, Mission } from '../types';

export const caduProfile: Valente = {
  id: 'cadu-001',
  name: 'CADU',
  image: '/images/cadu-avatar.png',
  totalXP: 8350, 
  structure: 'GAD',
  skills: {
    Liderança: 6,
    TrabalhoEmEquipe: 3,
    Criatividade: 9,
    ResoluçãoDeProblemas: 4,
    Comunicação: 6
  },
  holyPower: {
    Oração: { current: 5, goal: 7, streak: 14, unit: 'dias' },
    Leitura: { current: 3, goal: 5, streak: 3, unit: 'capítulos' },
    Jejum: { current: 0, goal: 1, streak: 0, unit: 'dia' },
  },
  loveLanguages: {
    presentes: 10,
    toqueFisico: 5,
    tempoQualidade: 35,
    palavrasAfirmacao: 30,
    atosServico: 20,
  },
  friendIds: ['nathan-001', 'daniel-002', 'samuel-003', 'benjamin-004'],
  // NEW: Medal rack for the GAD veteran
  medals: [
    { name: "PIONEIRO GAD", icon: "🚀", tier: "gold" },
    { name: "ESTRATEGISTA", icon: "🧠", tier: "silver" },
    { name: "FIDELIDADE", icon: "🛡️", tier: "bronze" }
  ],
  description: "Um veterano da GAD, mestre em estratégia e coordenação de equipe."
};

export const mockValentes: Valente[] = [
  caduProfile,
  {
    id: 'nathan-001',
    name: 'NATHAN',
    image: '/images/nathan.png',
    totalXP: 5200,
    structure: 'IMS',
    skills: {
      Liderança: 8,
      TrabalhoEmEquipe: 7,
      Criatividade: 9,
      ResoluçãoDeProblemas: 6,
      Comunicação: 8
    },
    holyPower: {
      Oração: { current: 7, goal: 7, streak: 42, unit: 'dias' },
      Leitura: { current: 5, goal: 5, streak: 10, unit: 'capítulos' },
      Jejum: { current: 1, goal: 1, streak: 2, unit: 'dia' },
    },
    loveLanguages: {
      presentes: 10,
      toqueFisico: 20,
      tempoQualidade: 40,
      palavrasAfirmacao: 15,
      atosServico: 15,
    },
    friendIds: ['cadu-001', 'daniel-002'],
    // NEW: Honors for the IMS expert
    medals: [
      { name: "VISÃO TÁTICA", icon: "📷", tier: "gold" },
      { name: "SENTINELA", icon: "👁️", tier: "silver" }
    ],
    description: "Especialista em capturar a glória do Reino através das lentes."
  },
  {
    id: 'daniel-002',
    name: 'DANIEL',
    totalXP: 3400,
    structure: 'Louvor',
    skills: {
      Liderança: 5,
      TrabalhoEmEquipe: 9,
      Criatividade: 8,
      ResoluçãoDeProblemas: 5,
      Comunicação: 7
    },
    holyPower: {
      Oração: { current: 7, goal: 7, streak: 42, unit: 'dias' },
      Leitura: { current: 5, goal: 5, streak: 10, unit: 'capítulos' },
      Jejum: { current: 1, goal: 1, streak: 2, unit: 'dia' },
    },
    loveLanguages: {
      presentes: 5,
      toqueFisico: 15,
      tempoQualidade: 25,
      palavrasAfirmacao: 35,
      atosServico: 20,
    },
    friendIds: ['cadu-001', 'samuel-003'],
    medals: [{ name: "SALMISTA", icon: "🎸", tier: "gold" }],
    description: "Adorador dedicado, usa a música como sua principal arma de guerra."
  },
  {
    id: 'samuel-003',
    name: 'SAMUEL',
    totalXP: 1200,
    structure: 'Intercessão',
    skills: {
      Liderança: 4,
      TrabalhoEmEquipe: 6,
      Criatividade: 5,
      ResoluçãoDeProblemas: 7,
      Comunicação: 4
    },
    holyPower: {
      Oração: { current: 7, goal: 7, streak: 42, unit: 'dias' },
      Leitura: { current: 5, goal: 5, streak: 10, unit: 'capítulos' },
      Jejum: { current: 1, goal: 1, streak: 2, unit: 'dia' },
    },
    loveLanguages: {
      presentes: 15,
      toqueFisico: 5,
      tempoQualidade: 45,
      palavrasAfirmacao: 15,
      atosServico: 20,
    },
    friendIds: ['cadu-001', 'daniel-002'],
    medals: [{ name: "INTERCESSOR", icon: "🔥", tier: "silver" }],
    description: "Guerreiro de oração silencioso, porém letal contra as forças das trevas."
  },
  {
    id: 'benjamin-004',
    name: 'BENJAMIN',
    totalXP: 800,
    structure: 'GAD',
    skills: {
      Liderança: 7,
      TrabalhoEmEquipe: 8,
      Criatividade: 7,
      ResoluçãoDeProblemas: 6,
      Comunicação: 9
    },
    holyPower: {
      Oração: { current: 7, goal: 7, streak: 42, unit: 'dias' },
      Leitura: { current: 5, goal: 5, streak: 10, unit: 'capítulos' },
      Jejum: { current: 1, goal: 1, streak: 2, unit: 'dia' },
    },
    loveLanguages: {
      presentes: 25,
      toqueFisico: 25,
      tempoQualidade: 20,
      palavrasAfirmacao: 20,
      atosServico: 10,
    },
    friendIds: ['cadu-001'],
    medals: [], // Fresh recruit, no medals yet
    description: "Recruta ágil e comunicativo, sempre pronto para servir onde for necessário."
  }
];

export const mockMissions: Mission[] = [
  // ... (Missions remain unchanged)
  { id: 'm1', title: 'LER 1 CAPÍTULO DA BÍBLIA', xpReward: 50, category: 'Hábitos Espirituais' },
  { id: 'm2', title: 'LER 5 CAPÍTULOS DA BÍBLIA', xpReward: 300, category: 'Hábitos Espirituais' },
  { id: 'm3', title: 'ORAR POR 15 MINUTOS', xpReward: 50, category: 'Hábitos Espirituais' },
  { id: 'm4', title: 'JEJUM DE 1 REFEIÇÃO', xpReward: 150, category: 'Hábitos Espirituais' },
  { id: 'm5', title: 'DEVOCIONAL MATINAL (1 SEMANA)', xpReward: 500, category: 'Hábitos Espirituais' },
  { id: 'm6', title: 'CONVIDAR UM AMIGO PARA A CÉLULA', xpReward: 100, category: 'Evangelismo e Liderança' },
  { id: 'm7', title: 'COMPARTILHAR TESTEMUNHO', xpReward: 200, category: 'Evangelismo e Liderança' },
  { id: 'm8', title: 'LIDERAR UMA DINÂMICA', xpReward: 300, category: 'Evangelismo e Liderança' },
  { id: 'm9', title: 'MEMORIZAR VERSÍCULO CHAVE', xpReward: 50, category: 'Conhecimento' },
  { id: 'm10', title: 'RESUMO DO SERMÃO', xpReward: 100, category: 'Conhecimento' },
  { id: 'm11', title: 'LER LIVRO RECOMENDADO', xpReward: 500, category: 'Conhecimento' },
  { id: 'm12', title: 'CHEGAR NO HORÁRIO (1 MÊS)', xpReward: 200, category: 'Estrutura e Participação' },
  { id: 'm13', title: 'AJUDAR NA LIMPEZA', xpReward: 100, category: 'Estrutura e Participação' },
  { id: 'm14', title: 'PARTICIPAR DO ACAMPAMENTO', xpReward: 'LVL UP DIRETO', category: 'Eventos e Especiais' },
  { id: 'm15', title: 'TRAZER OS PAIS NO CULTO', xpReward: 500, category: 'Eventos e Especiais' }
];