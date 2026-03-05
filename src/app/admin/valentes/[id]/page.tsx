import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getGlobalRanking, getPersonalRank } from "@/app/actions/valenteActions";
import { getCompanheirosDetails } from "@/app/actions/companheiroActions";
import ValenteProfileClient from "./ValenteProfileClient";

export default async function ValenteProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch the core Valente data
  const rawValente = await prisma.valente.findUnique({
    where: { id },
    include: {
      attributes: true,
      holyPower: true,
      loveLanguages: true,
      medals: { include: { medal: true } },
      xpLogs: { orderBy: { createdAt: 'desc' }, take: 10 }
    }
  });

  if (!rawValente) return notFound();

  // 2. Fetch all strategic data + MISSIONS for the board
  const [globalRanking, personalRank, companheirosDetails, rawMissions] = await Promise.all([
    getGlobalRanking(),
    getPersonalRank(rawValente.totalXP),
    getCompanheirosDetails(rawValente.friendIds),
    prisma.mission.findMany({ orderBy: { type: 'asc' } }) // Get real missions
  ]);

  // 3. Serialize
  const safeValente = JSON.parse(JSON.stringify(rawValente));
  const safeRanking = JSON.parse(JSON.stringify(globalRanking));
  const safeCompanheiros = JSON.parse(JSON.stringify(companheirosDetails));
  const safeMissions = JSON.parse(JSON.stringify(rawMissions));

  return (
    <ValenteProfileClient 
      initialValente={safeValente} 
      ranking={safeRanking}
      personalRank={personalRank}
      initialCompanheiros={safeCompanheiros}
      availableMissions={safeMissions} // Pass missions here
    />
  );
}