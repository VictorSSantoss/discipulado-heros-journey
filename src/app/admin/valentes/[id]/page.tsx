import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getGlobalRanking, getPersonalRank, getAllReliquias } from "@/app/actions/valenteActions";
import { getCompanheirosDetails } from "@/app/actions/companheiroActions";
import ValenteProfileClient from "./ValenteProfileClient";

export default async function ValenteProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. ADDED 'patente: true' TO THE INITIAL FETCH
  let rawValente = await prisma.valente.findUnique({
    where: { id },
    include: {
      patente: true,
      attributes: true,
      holyPower: true,
      loveLanguages: true,
      reliquias: { include: { reliquia: true } },
      xpLogs: { orderBy: { createdAt: 'desc' }, take: 10 },
      managedBy: { 
        select: { 
          guildaName: true, 
          guildaIcon: true,
          name: true 
        } 
      }
    }
  });

  if (!rawValente) return notFound();

  // Fetch all ranks to determine next level XP for the profile progress bar
  const [globalRanking, personalRank, companheirosDetails, rawMissions, rawMedalCatalog, allPatentes] = await Promise.all([
    getGlobalRanking(),
    getPersonalRank(rawValente.totalXP),
    getCompanheirosDetails(rawValente.friendIds),
    prisma.mission.findMany({ orderBy: { type: 'asc' } }),
    getAllReliquias(),
    prisma.patente.findMany({ orderBy: { level: 'asc' } }) // Fetch ranks
  ]);

  // Logic for missing relics...
  const earnedIds = new Set(rawValente.reliquias.map(vr => vr.reliquiaId));
  const missingRelics = [];
  for (const relic of rawMedalCatalog) {
    const targetXp = relic.requirement || 999999;
    if (rawValente.totalXP >= targetXp && !earnedIds.has(relic.id) && targetXp > 0) {
      missingRelics.push({ valenteId: id, reliquiaId: relic.id });
    }
  }

  if (missingRelics.length > 0) {
    await prisma.valenteReliquia.createMany({
      data: missingRelics,
      skipDuplicates: true
    });

    // 2. ADDED 'patente: true' TO THE REFETCH
    rawValente = await prisma.valente.findUnique({
      where: { id },
      include: {
        patente: true, // <--- CRITICAL FIX
        attributes: true,
        holyPower: true,
        loveLanguages: true,
        reliquias: { include: { reliquia: true } },
        xpLogs: { orderBy: { createdAt: 'desc' }, take: 10 },
        managedBy: { 
          select: { 
            guildaName: true, 
            guildaIcon: true,
            name: true 
          } 
        }
      }
    });
  }

  // Calculate the next level XP to pass to the Client Component
  const currentLevel = rawValente?.patente?.level ?? 0;
  const nextPatente = allPatentes.find(p => p.level > currentLevel);

  const safeValente = JSON.parse(JSON.stringify(rawValente));
  const safeRanking = JSON.parse(JSON.stringify(globalRanking));
  const safeCompanheiros = JSON.parse(JSON.stringify(companheirosDetails));
  const safeMissions = JSON.parse(JSON.stringify(rawMissions));
  const safeMedalCatalog = JSON.parse(JSON.stringify(rawMedalCatalog));

  const valenteWithMappedMedals = {
    ...safeValente,
    // Add the progression data here
    nextLevelXP: nextPatente ? nextPatente.xpRequired : null,
    medals: safeValente.reliquias.map((vr: any) => ({
      medal: vr.reliquia,
      awardedAt: vr.awardedAt
    }))
  };

  return (
    <ValenteProfileClient 
      initialValente={valenteWithMappedMedals} 
      ranking={safeRanking}
      personalRank={personalRank}
      initialCompanheiros={safeCompanheiros}
      availableMissions={safeMissions}
      medalCatalog={safeMedalCatalog} 
    />
  );
}