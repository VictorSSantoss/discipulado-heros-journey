import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getGlobalRanking, getPersonalRank, getAllReliquias } from "@/app/actions/valenteActions";
import { getCompanheirosDetails } from "@/app/actions/companheiroActions";
import ValenteProfileClient from "./ValenteProfileClient";

export default async function ValenteProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Initial Fetch
  let rawValente = await prisma.valente.findUnique({
    where: { id },
    include: {
      attributes: true,
      holyPower: true,
      loveLanguages: true,
      reliquias: { include: { reliquia: true } },
      xpLogs: { orderBy: { createdAt: 'desc' }, take: 10 }
    }
  });

  if (!rawValente) return notFound();

  const [globalRanking, personalRank, companheirosDetails, rawMissions, rawMedalCatalog] = await Promise.all([
    getGlobalRanking(),
    getPersonalRank(rawValente.totalXP),
    getCompanheirosDetails(rawValente.friendIds),
    prisma.mission.findMany({ orderBy: { type: 'asc' } }),
    getAllReliquias() 
  ]);

  // ---------------------------------------------------------------------------
  // ⚔️ THE SELF-HEALING ENGINE (Retroactive Auto-Grant)
  // ---------------------------------------------------------------------------
  const earnedIds = new Set(rawValente.reliquias.map(vr => vr.reliquiaId));
  const missingRelics = [];

  for (const relic of rawMedalCatalog) {
    // We safely use the requirement mapped by getAllReliquias
    const targetXp = relic.requirement || 999999;

    // If Valente has enough XP but DOES NOT have the relic relation in the DB
    if (rawValente.totalXP >= targetXp && !earnedIds.has(relic.id) && targetXp > 0) {
      missingRelics.push({ valenteId: id, reliquiaId: relic.id });
    }
  }

  // If we found missing relics, insert them and REFETCH the Valente!
  if (missingRelics.length > 0) {
    await prisma.valenteReliquia.createMany({
      data: missingRelics,
      skipDuplicates: true
    });

    // Refetch to get the updated, corrected list of relics
    rawValente = await prisma.valente.findUnique({
      where: { id },
      include: {
        attributes: true,
        holyPower: true,
        loveLanguages: true,
        reliquias: { include: { reliquia: true } },
        xpLogs: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    });
  }
  // ---------------------------------------------------------------------------

  const safeValente = JSON.parse(JSON.stringify(rawValente));
  const safeRanking = JSON.parse(JSON.stringify(globalRanking));
  const safeCompanheiros = JSON.parse(JSON.stringify(companheirosDetails));
  const safeMissions = JSON.parse(JSON.stringify(rawMissions));
  const safeMedalCatalog = JSON.parse(JSON.stringify(rawMedalCatalog));

  // Map reliquias to the "medals" format the client component expects
  const valenteWithMappedMedals = {
    ...safeValente,
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