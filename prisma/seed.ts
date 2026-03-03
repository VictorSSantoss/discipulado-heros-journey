import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting database seed...')

  // 1. Cleanup - Crucial to avoid primary key conflicts
  await prisma.xpLog.deleteMany()
  await prisma.holyPower.deleteMany()
  await prisma.attributes.deleteMany()
  await prisma.loveLanguages.deleteMany()
  await prisma.valente.deleteMany()
  await prisma.user.deleteMany()
  
  // 2. Create Victor as the Discipulador
  const victor = await prisma.user.create({
    data: {
      name: 'Victor',
      email: 'victor@reino.com',
      password: 'temporary_password_123',
      role: 'DISCIPULADOR',
    }
  })

  // 3. Populate Valentes
  
  // NATHAN
  await prisma.valente.create({
    data: {
      name: 'Nathan',
      image: '/images/man-silhouette.svg', 
      totalXP: 2500,
      structure: 'Louvor',
      description: 'A focused warrior.',
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

  // CADU
  await prisma.valente.create({
    data: {
      name: 'Cadu',
      image: '/images/man-silhouette.svg', 
      totalXP: 8000,
      structure: 'GAD',
      description: 'Specialist in close combat.',
      userId: victor.id,
      attributes: { create: { forca: 1, destreza: 1, constituicao: 1, inteligencia: 10, sabedoria: 1, carisma: 1 } },
      loveLanguages: { create: { palavras: 40, tempo: 90, presentes: 20, servico: 60, toque: 85 } },
      holyPower: {
        create: [
          { name: 'Oração', current: 28, goal: 30, streak: 15 },
          { name: 'Leitura', current: 15, goal: 30, streak: 5 },
          { name: 'Jejum', current: 4, goal: 4, streak: 2 }
        ]
      },
      xpLogs: {
        create: [
          { amount: 1000, reason: "Bônus: Veterano do Reino" },
          { amount: 200, reason: "Missão: Discipulado Nível 1" },
          { amount: -50, reason: "Penalidade: Atraso em Reunião" }
        ]
      }
    }
  })

  // SICLANO
  await prisma.valente.create({
    data: {
      name: 'Siclano',
      image: '/images/man-silhouette.svg', 
      totalXP: 550,
      structure: 'IMS',
      description: 'Specialist in stealth and intel.',
      userId: victor.id,
      attributes: { create: { forca: 9, destreza: 8, constituicao: 4, inteligencia: 10, sabedoria: 6, carisma: 1 } },
      loveLanguages: { create: { palavras: 100, tempo: 40, presentes: 10, servico: 50, toque: 20 } },
      holyPower: {
        create: [
          { name: 'Oração', current: 5, goal: 30, streak: 1 },
          { name: 'Leitura', current: 8, goal: 30, streak: 2 },
          { name: 'Jejum', current: 0, goal: 4, streak: 0 }
        ]
      },
      xpLogs: {
        create: [
          { amount: 300, reason: "Relatório Mensal Entregue" },
          { amount: 50, reason: "Oração em Célula" }
        ]
      }
    }
  })

  // BELTRANO (New Player)
  await prisma.valente.create({
    data: {
      name: 'Beltrano',
      image: '/images/man-silhouette.svg', 
      totalXP: 1200,
      structure: 'Mídia',
      description: 'The eyes and ears of the structure.',
      userId: victor.id,
      attributes: { create: { forca: 5, destreza: 10, constituicao: 7, inteligencia: 12, sabedoria: 8, carisma: 10 } },
      loveLanguages: { create: { palavras: 60, tempo: 60, presentes: 60, servico: 60, toque: 60 } },
      holyPower: {
        create: [
          { name: 'Oração', current: 15, goal: 30, streak: 7 },
          { name: 'Leitura', current: 10, goal: 30, streak: 3 },
          { name: 'Jejum', current: 2, goal: 4, streak: 1 }
        ]
      },
      xpLogs: {
        create: [
          { amount: 600, reason: "Boas-vindas ao Reino" },
          { amount: 100, reason: "Edição de Vídeo: Evento" }
        ]
      }
    }
  })

  console.log('Seed completed successfully.')
}

main()
  .then(async () => { await prisma.$disconnect(); process.exit(0); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); })