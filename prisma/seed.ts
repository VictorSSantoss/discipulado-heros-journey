import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

// Load environment variables for the connection string
dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('--- INICIANDO SEMEADURA COMPLETA DO REINO ---')

  // 1. CLEANUP: Delete in reverse order of dependency
  await prisma.valenteMedal.deleteMany()
  await prisma.medal.deleteMany()
  await prisma.xpLog.deleteMany()
  await prisma.holyPower.deleteMany()
  await prisma.attributes.deleteMany()
  await prisma.loveLanguages.deleteMany()
  await prisma.valente.deleteMany()
  await prisma.user.deleteMany()
  
  console.log('Banco de dados limpo com sucesso.')

  // 2. CREATE DISCIPULADOR
  const victor = await prisma.user.create({
    data: {
      name: 'Victor',
      email: 'victor@reino.com',
      password: 'temporary_password_123',
      role: 'DISCIPULADOR',
    }
  })
  console.log('Usuário Victor (Discipulador) criado.')

  // 3. POPULATE GLOBAL MEDALS (XP Milestones)
  // RARE and LEGENDARY rarities will trigger the AchievementToast in the UI
  const medalsData = [
    {
      name: "Iniciante do Reino",
      description: "Você deu os primeiros passos na jornada. 1.000 XP alcançados.",
      icon: "/images/bronze-achievement.svg",
      rarity: "COMMON",
      type: "XP_MILESTONE",
      requirement: 1000,
    },
    {
      name: "Guerreiro de Elite",
      description: "Sua constância é notável. 5.000 XP registrados nas crônicas.",
      icon: "/images/silver-achievement.svg",
      rarity: "RARE", 
      type: "XP_MILESTONE",
      requirement: 5000,
    },
    {
      name: "Lenda do Reino",
      description: "O ápice do poder. Seu nome agora é eterno nas estrelas.",
      icon: "/images/gold-achievement.svg",
      rarity: "LEGENDARY",
      type: "XP_MILESTONE",
      requirement: 10000,
    },
  ]

  for (const m of medalsData) {
    await prisma.medal.create({ data: m })
  }
  console.log('Medalhas de marco de XP criadas.')

  // 4. POPULATE VALENTES
  await prisma.valente.create({
    data: {
      name: 'Nathan',
      image: '/images/man-silhouette.svg', 
      totalXP: 2500,
      structure: 'Louvor',
      description: 'Um guerreiro focado na harmonia e na ministração.',
      userId: victor.id,
      attributes: { create: { forca: 10, destreza: 15, constituicao: 9, inteligencia: 1, sabedoria: 1, carisma: 1 } },
      loveLanguages: { create: { palavras: 40, tempo: 90, presentes: 20, servico: 60, toque: 85 } },
      holyPower: {
        create: [
          { name: 'Oração', current: 12, goal: 30, streak: 4 },
          { name: 'Leitura', current: 30, goal: 30, streak: 12 },
          { name: 'Jejum', current: 1, goal: 4, streak: 0 }
        ]
      },
      xpLogs: {
        create: [
          { amount: 500, reason: "Início da Jornada" },
          { amount: 150, reason: "Ministração: Culto de Domingo" }
        ]
      }
    }
  })

  await prisma.valente.create({
    data: {
      name: 'Cadu',
      image: '/images/man-silhouette.svg', 
      totalXP: 4800, // Proximity to 5000 makes him perfect for testing the Rare toast!
      structure: 'GAD',
      description: 'Especialista em combate próximo e estratégia de grupo.',
      userId: victor.id,
      attributes: { create: { forca: 1, destreza: 1, constituicao: 1, inteligencia: 10, sabedoria: 1, carisma: 1 } },
      loveLanguages: { create: { palavras: 40, tempo: 90, presentes: 20, servico: 60, toque: 85 } },
      holyPower: {
        create: [
          { name: 'Oração', current: 28, goal: 30, streak: 15 },
          { name: 'Leitura', current: 15, goal: 30, streak: 5 },
          { name: 'Jejum', current: 4, goal: 4, streak: 2 }
        ]
      }
    }
  })

  await prisma.valente.create({
    data: {
      name: 'Siclano',
      image: '/images/man-silhouette.svg', 
      totalXP: 550,
      structure: 'IMS',
      description: 'Especialista em inteligência e operações furtivas.',
      userId: victor.id,
      attributes: { create: { forca: 9, destreza: 8, constituicao: 4, inteligencia: 10, sabedoria: 6, carisma: 1 } },
      loveLanguages: { create: { palavras: 100, tempo: 40, presentes: 10, servico: 50, toque: 20 } },
      holyPower: {
        create: [
          { name: 'Oração', current: 5, goal: 30, streak: 1 },
          { name: 'Leitura', current: 8, goal: 30, streak: 2 }
        ]
      }
    }
  })

  await prisma.valente.create({
    data: {
      name: 'Beltrano',
      image: '/images/man-silhouette.svg', 
      totalXP: 1200,
      structure: 'Mídia',
      description: 'Os olhos e ouvidos da estrutura, mestre da comunicação.',
      userId: victor.id,
      attributes: { create: { forca: 5, destreza: 10, constituicao: 7, inteligencia: 12, sabedoria: 8, carisma: 10 } },
      loveLanguages: { create: { palavras: 60, tempo: 60, presentes: 60, servico: 60, toque: 60 } }
    }
  })

  console.log('--- ✅ SEMEADURA CONCLUÍDA COM SUCESSO ---')
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