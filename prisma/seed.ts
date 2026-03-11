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
  await prisma.valenteMission.deleteMany()
  await prisma.mission.deleteMany() 
  // REPLACED: medals with reliquias
  await prisma.valenteReliquia.deleteMany() 
  await prisma.reliquia.deleteMany()
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

  // 3. CRIAR MISSÕES 
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

  // 4. RELÍQUIAS (Atualizado para a nova regra JSON)
  const reliquiasData = [
    { 
      name: "Iniciante do Reino", 
      description: "1.000 XP alcançados.", 
      icon: "/images/bronze-achievement.svg", 
      rarity: "COMMON", 
      triggerType: "XP_MILESTONE", 
      ruleParams: { target: 1000 } // <-- The new dynamic rules format!
    },
    { 
      name: "Guerreiro de Elite", 
      description: "5.000 XP registrados.", 
      icon: "/images/silver-achievement.svg", 
      rarity: "RARE", 
      triggerType: "XP_MILESTONE", 
      ruleParams: { target: 5000 } 
    },
    { 
      name: "Lenda do Reino", 
      description: "10.000 XP registrados.", 
      icon: "/images/gold-achievement.svg", 
      rarity: "LEGENDARY", 
      triggerType: "XP_MILESTONE", 
      ruleParams: { target: 10000 } 
    },
  ]
  for (const r of reliquiasData) { await prisma.reliquia.create({ data: r }) }
  console.log('💎 Relíquias criadas.')

  // 5. VALENTES
  const valentes = [
    { name: 'Nathan', totalXP: 2500, structure: 'Louvor', description: 'Guerreiro da harmonia.' },
    { name: 'Cadu', totalXP: 4800, structure: 'GAD', description: 'Estrategista de grupo.' },
    { name: 'Siclano', totalXP: 550, structure: 'IMS', description: 'Operações furtivas.' },
    { name: 'Beltrano', totalXP: 1200, structure: 'Mídia', description: 'E aí! Meu nome é Beltrano. Eu gosto muito de jogar videogame, jogar bola e assistir vídeos no YouTube. Mas, para mim, a coisa mais importante de todas é a minha fé. Eu amo Deus de todo o meu coração, mesmo sabendo que seguir Jesus não é o caminho mais fácil.' }
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