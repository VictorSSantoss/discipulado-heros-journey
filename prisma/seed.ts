import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/* Calculates the appropriate level for a player based on their total XP by checking against the generated ranks */
function calculateLevelFromXP(xp: number, patentes: any[]) {
  let currentLevel = 1;
  for (const patente of patentes) {
    if (xp >= patente.xpRequired) {
      currentLevel = patente.level;
    } else {
      break;
    }
  }
  return currentLevel;
}

async function main() {
  console.log('--- INICIANDO SEMEADURA COMPLETA DO REINO ---')

  /* 1. CLEANUP (Reverse dependency order) */
  await prisma.valenteMission.deleteMany()
  await prisma.mission.deleteMany() 
  await prisma.valenteReliquia.deleteMany() 
  await prisma.reliquia.deleteMany()
  await prisma.xpLog.deleteMany()
  await prisma.holyPower.deleteMany()
  await prisma.attributes.deleteMany()
  await prisma.loveLanguages.deleteMany()
  await prisma.valente.deleteMany()
  await prisma.user.deleteMany()
  await prisma.patente.deleteMany()
  
  console.log('Banco de dados limpo.')

  /* 2. CREATE SYSTEM RANKS (Patentes 1-50) */
  const patentesData = Array.from({ length: 50 }).map((_, index) => {
    const level = index + 1;
    
    let xpRequired = 0;
    if (level > 1) {
      const multiplier = level <= 10 ? 50 : level <= 30 ? 65 : 85;
      xpRequired = Math.floor(Math.pow(level, 2.5) * multiplier);
      xpRequired = Math.ceil(xpRequired / 10) * 10; 
    }

    let title = "Escudeiro";
    let tierColor = "#94a3b8"; 
    
    if (level >= 11 && level <= 20) {
      title = "Soldado";
      tierColor = "#d97706"; 
    } else if (level >= 21 && level <= 30) {
      title = "Cavaleiro";
      tierColor = "#e4e4e7"; 
    } else if (level >= 31 && level <= 40) {
      title = "Sentinela";
      tierColor = "#facc15"; 
    } else if (level >= 41 && level <= 50) {
      title = "Guardião";
      tierColor = "#06b6d4"; 
    }

    return {
      level,
      title,
      xpRequired,
      tierColor,
      iconUrl: `/images/ranks/level-${level}.svg`
    };
  });

  await prisma.patente.createMany({
    data: patentesData
  });
  console.log('50 Patentes criadas e configuradas.')

  /* 3. CREATE DISCIPULADOR */
  const victor = await prisma.user.create({
    data: {
      name: 'Victor',
      email: 'victor@reino.com',
      password: 'temporary_password_123',
      role: 'DISCIPULADOR',
    }
  })
  console.log('Usuário Victor criado.')

  /* 4. CREATE MISSIONS */
  const missionsData = [
    { title: 'LER 1 CAPÍTULO DA BÍBLIA', xpReward: 50, type: 'Hábitos Espirituais', triggerType: 'MANUAL' },
    { title: 'ORAR POR 15 MINUTOS', xpReward: 50, type: 'Hábitos Espirituais', triggerType: 'MANUAL' },
    { title: 'JEJUM DE 1 REFEIÇÃO', xpReward: 150, type: 'Hábitos Espirituais', triggerType: 'MANUAL' },
    { 
      title: 'FOGO CONSTANTE (7 DIAS)', 
      description: 'Mantenha sua sequência de Oração por 7 dias seguidos.',
      xpReward: 500, 
      type: 'Hábitos Espirituais', 
      triggerType: 'HABIT_STREAK', 
      targetHabit: 'Oração', 
      targetValue: 7 
    },
    { 
      title: 'ERUDITO DO REINO (15 DIAS)', 
      description: 'Mantenha sua sequência de Leitura por 15 dias seguidos.',
      xpReward: 1200, 
      type: 'Conhecimento', 
      triggerType: 'HABIT_STREAK', 
      targetHabit: 'Leitura', 
      targetValue: 15 
    },
    { title: 'CONVIDAR UM AMIGO PARA A CÉLULA', xpReward: 100, type: 'Evangelismo e Liderança', triggerType: 'MANUAL' },
    { title: 'COMPARTILHAR TESTEMUNHO', xpReward: 200, type: 'Evangelismo e Liderança', triggerType: 'MANUAL' },
    { title: 'PARTICIPAR DO ACAMPAMENTO', xpReward: 9999, type: 'Eventos e Especiais', triggerType: 'MANUAL' },
  ];

  for (const m of missionsData) {
    await prisma.mission.create({
      data: {
        title: m.title,
        description: m.description || "Desafio oficial do reino para fortalecimento do Valente.",
        xpReward: m.xpReward,
        type: m.type,
        triggerType: m.triggerType,
        targetHabit: m.targetHabit || null,
        targetValue: m.targetValue || 0
      }
    })
  }
  console.log('Missões e Decretos de Sequência forjados.')

  /* 5. CREATE RELICS */
  const reliquiasData = [
    { 
      id: 'reliquia-anjo-guarda', 
      name: "Anjo da Guarda", 
      description: "Protege suas sequências de Poder Santo. Se falhar um dia, esta relíquia é consumida.", 
      icon: "/icons/relics/guardian-angel.svg", 
      rarity: "EPIC", 
      triggerType: "MANUAL", 
      ruleParams: { power: 'streak_protection', charges: 1 }
    },
    { 
      name: "Iniciante do Reino", 
      description: "1.000 XP alcançados.", 
      icon: "/images/bronze-achievement.svg", 
      rarity: "COMMON", 
      triggerType: "XP_MILESTONE", 
      ruleParams: { target: 1000 } 
    },
    { 
      name: "Guerreiro de Elite", 
      description: "5.000 XP registrados.", 
      icon: "/images/silver-achievement.svg", 
      rarity: "RARE", 
      triggerType: "XP_MILESTONE", 
      ruleParams: { target: 5000 } 
    }
  ]
  for (const r of reliquiasData) { await prisma.reliquia.create({ data: r }) }
  console.log('Relíquias (incluindo Anjo da Guarda) criadas.')

  /* 6. CREATE VALENTES */
  const valentes = [
    { name: 'Nathan', totalXP: 2500, structure: 'Louvor' },
    { name: 'Cadu', totalXP: 4800, structure: 'GAD' },
    { name: 'Victor (Líder)', totalXP: 10000, structure: 'MASTER' }
  ]

  for (const v of valentes) {
    const assignedLevel = calculateLevelFromXP(v.totalXP, patentesData);

    await prisma.valente.create({
      data: {
        name: v.name,
        image: '/images/man-silhouette.svg',
        totalXP: v.totalXP,
        level: assignedLevel,
        structure: v.structure,
        description: 'Membro honrado do Reino.',
        userId: victor.id,
        attributes: { create: { forca: 10, destreza: 10, constituicao: 10, inteligencia: 10, sabedoria: 10, carisma: 10 } },
        loveLanguages: { create: { palavras: 50, tempo: 50, presentes: 50, servico: 50, toque: 50 } },
        holyPower: {
          create: [
            { name: 'Oração', current: 0, goal: 30, streak: 0 },
            { name: 'Leitura', current: 0, goal: 30, streak: 0 },
            { name: 'Jejum', current: 0, goal: 1, streak: 0 },
          ]
        }
      }
    })
  }

  console.log('--- SEMEADURA CONCLUÍDA COM SUCESSO ---')
}

main()
  .then(async () => { 
    await prisma.$disconnect()
    await pool.end()
    process.exit(0) 
  })
  .catch(async (e) => { 
    console.error(e) 
    await prisma.$disconnect()
    await pool.end()
    process.exit(1) 
  })