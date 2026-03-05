import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('--- ⚔️ INICIANDO SEMEADURA COMPLETA DO REINO ---')

  // 1. LIMPEZA (Ordem inversa de dependência)
  await prisma.mission.deleteMany() // Limpa as missões para não duplicar no seed
  await prisma.valenteMedal.deleteMany()
  await prisma.medal.deleteMany()
  await prisma.xpLog.deleteMany()
  await prisma.holyPower.deleteMany()
  await prisma.attributes.deleteMany()
  await prisma.loveLanguages.deleteMany()
  await prisma.valente.deleteMany()
  await prisma.user.deleteMany()
  
  console.log('✅ Banco de dados limpo.')

  // 2. CRIAR DISCIPULADOR
  const victor = await prisma.user.create({
    data: {
      name: 'Victor',
      email: 'victor@reino.com',
      password: 'temporary_password_123',
      role: 'DISCIPULADOR',
    }
  })
  console.log('👤 Usuário Victor criado.')

  // 3. CRIAR MISSÕES (As 15 que você tinha no mock)
  const missionsData = [
    { title: 'LER 1 CAPÍTULO DA BÍBLIA', xpReward: 50, type: 'Hábitos Espirituais' },
    { title: 'LER 5 CAPÍTULOS DA BÍBLIA', xpReward: 300, type: 'Hábitos Espirituais' },
    { title: 'ORAR POR 15 MINUTOS', xpReward: 50, type: 'Hábitos Espirituais' },
    { title: 'JEJUM DE 1 REFEIÇÃO', xpReward: 150, type: 'Hábitos Espirituais' },
    { title: 'DEVOCIONAL MATINAL (1 SEMANA)', xpReward: 500, type: 'Hábitos Espirituais' },
    { title: 'CONVIDAR UM AMIGO PARA A CÉLULA', xpReward: 100, type: 'Evangelismo e Liderança' },
    { title: 'COMPARTILHAR TESTEMUNHO', xpReward: 200, type: 'Evangelismo e Liderança' },
    { title: 'LIDERAR UMA DINÂMICA', xpReward: 300, type: 'Evangelismo e Liderança' },
    { title: 'MEMORIZAR VERSÍCULO CHAVE', xpReward: 50, type: 'Conhecimento' },
    { title: 'RESUMO DO SERMÃO', xpReward: 100, type: 'Conhecimento' },
    { title: 'LER LIVRO RECOMENDADO', xpReward: 500, type: 'Conhecimento' },
    { title: 'CHEGAR NO HORÁRIO (1 MÊS)', xpReward: 200, type: 'Estrutura e Participação' },
    { title: 'AJUDAR NA LIMPEZA', xpReward: 100, type: 'Estrutura e Participação' },
    { title: 'PARTICIPAR DO ACAMPAMENTO', xpReward: 9999, type: 'Eventos e Especiais' },
    { title: 'TRAZER OS PAIS NO CULTO', xpReward: 500, type: 'Eventos e Especiais' }
  ];

  for (const m of missionsData) {
    await prisma.mission.create({
      data: {
        title: m.title,
        description: "Desafio oficial do reino para fortalecimento do Valente.",
        xpReward: m.xpReward,
        type: m.type
      }
    })
  }
  console.log('📜 Missões forjadas.')

  // 4. MEDALHAS
  const medalsData = [
    { name: "Iniciante do Reino", description: "1.000 XP alcançados.", icon: "/images/bronze-achievement.svg", rarity: "COMMON", type: "XP_MILESTONE", requirement: 1000 },
    { name: "Guerreiro de Elite", description: "5.000 XP registrados.", icon: "/images/silver-achievement.svg", rarity: "RARE", type: "XP_MILESTONE", requirement: 5000 },
    { name: "Lenda do Reino", description: "10.000 XP registrados.", icon: "/images/gold-achievement.svg", rarity: "LEGENDARY", type: "XP_MILESTONE", requirement: 10000 },
  ]
  for (const m of medalsData) { await prisma.medal.create({ data: m }) }
  console.log('🏅 Medalhas criadas.')

  // 5. VALENTES
  const valentes = [
    { name: 'Nathan', totalXP: 2500, structure: 'Louvor', description: 'Guerreiro da harmonia.' },
    { name: 'Cadu', totalXP: 4800, structure: 'GAD', description: 'Estrategista de grupo.' },
    { name: 'Siclano', totalXP: 550, structure: 'IMS', description: 'Operações furtivas.' },
    { name: 'Beltrano', totalXP: 1200, structure: 'Mídia', description: 'Comunicação do reino.' }
  ]

  for (const v of valentes) {
    await prisma.valente.create({
      data: {
        name: v.name,
        image: '/images/man-silhouette.svg',
        totalXP: v.totalXP,
        structure: v.structure,
        description: v.description,
        userId: victor.id,
        attributes: { create: { forca: 10, destreza: 10, constituicao: 10, inteligencia: 10, sabedoria: 10, carisma: 10 } },
        loveLanguages: { create: { palavras: 50, tempo: 50, presentes: 50, servico: 50, toque: 50 } }
      }
    })
  }

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