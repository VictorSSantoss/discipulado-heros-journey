import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getGlobalRanking, getPersonalRank, getAllReliquias } from "@/app/actions/valenteActions";
import { getCompanheirosDetails } from "@/app/actions/companheiroActions";
import ValenteProfileClient from "./ValenteProfileClient";

export default async function ValenteProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const rawValente = await prisma.valente.findUnique({
    where: { id },
    include: {
      attributes: true,
      holyPower: true,
      loveLanguages: true,
      reliquias: {include: { reliquia: true}},
      xpLogs: { orderBy: { createdAt: 'desc' }, take: 10 }
    }
  });

  if (!rawValente) return notFound();

  // ADDED rawMedalCatalog to the Promise.all
  const [globalRanking, personalRank, companheirosDetails, rawMissions, rawMedalCatalog] = await Promise.all([
    getGlobalRanking(),
    getPersonalRank(rawValente.totalXP),
    getCompanheirosDetails(rawValente.friendIds),
    prisma.mission.findMany({ orderBy: { type: 'asc' } }),
    getAllReliquias() 
  ]);

  const safeValente = JSON.parse(JSON.stringify(rawValente));
  const safeRanking = JSON.parse(JSON.stringify(globalRanking));
  const safeCompanheiros = JSON.parse(JSON.stringify(companheirosDetails));
  const safeMissions = JSON.parse(JSON.stringify(rawMissions));
  const safeMedalCatalog = JSON.parse(JSON.stringify(rawMedalCatalog)); // Serialize catalog

  return (
    <ValenteProfileClient 
      initialValente={safeValente} 
      ranking={safeRanking}
      personalRank={personalRank}
      initialCompanheiros={safeCompanheiros}
      availableMissions={safeMissions}
      medalCatalog={safeMedalCatalog} // Pass it to the client
    />
  );
}