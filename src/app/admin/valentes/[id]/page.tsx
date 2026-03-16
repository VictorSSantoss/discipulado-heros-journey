import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getGlobalRanking, getPersonalRank, getAllReliquias } from "@/app/actions/valenteActions";
import { getCompanheirosDetails } from "@/app/actions/companheiroActions";
import ValenteProfileClient from "./ValenteProfileClient";

export default async function ValenteProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetches the Valente data including the managing user's guildaName, guildaIcon, and name
  let rawValente = await prisma.valente.findUnique({
    where: { id },
    include: {
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

  const [globalRanking, personalRank, companheirosDetails, rawMissions, rawMedalCatalog] = await Promise.all([
    getGlobalRanking(),
    getPersonalRank(rawValente.totalXP),
    getCompanheirosDetails(rawValente.friendIds),
    prisma.mission.findMany({ orderBy: { type: 'asc' } }),
    getAllReliquias() 
  ]);

  // Evaluates if the Valente meets XP requirements for relics they do not currently own
  const earnedIds = new Set(rawValente.reliquias.map(vr => vr.reliquiaId));
  const missingRelics = [];

  for (const relic of rawMedalCatalog) {
    const targetXp = relic.requirement || 999999;

    if (rawValente.totalXP >= targetXp && !earnedIds.has(relic.id) && targetXp > 0) {
      missingRelics.push({ valenteId: id, reliquiaId: relic.id });
    }
  }

  // Inserts missing relics into the database and refetches the profile data to ensure state consistency
  if (missingRelics.length > 0) {
    await prisma.valenteReliquia.createMany({
      data: missingRelics,
      skipDuplicates: true
    });

    rawValente = await prisma.valente.findUnique({
      where: { id },
      include: {
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

  const safeValente = JSON.parse(JSON.stringify(rawValente));
  const safeRanking = JSON.parse(JSON.stringify(globalRanking));
  const safeCompanheiros = JSON.parse(JSON.stringify(companheirosDetails));
  const safeMissions = JSON.parse(JSON.stringify(rawMissions));
  const safeMedalCatalog = JSON.parse(JSON.stringify(rawMedalCatalog));

  // Transforms the database relation array into the specific shape expected by the UI component
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