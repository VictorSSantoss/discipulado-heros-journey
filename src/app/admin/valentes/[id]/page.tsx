import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getGlobalRanking, getPersonalRank } from "@/app/actions/valenteActions";
import { getCompanheirosDetails } from "@/app/actions/companheiroActions"; // Added import
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
      medals: {
        include: { medal: true }
      },
      xpLogs: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });

  if (!rawValente) return notFound();

  // 2. Fetch all secondary tactical data in parallel
  const [globalRanking, personalRank, companheirosDetails] = await Promise.all([
    getGlobalRanking(),
    getPersonalRank(rawValente.totalXP),
    getCompanheirosDetails(rawValente.friendIds)
  ]);

  // 3. Serialize everything once for the Client Component
  const safeValente = JSON.parse(JSON.stringify(rawValente));
  const safeRanking = JSON.parse(JSON.stringify(globalRanking));
  const safeCompanheiros = JSON.parse(JSON.stringify(companheirosDetails));

  // 4. Return ONE component with all props
  return (
    <ValenteProfileClient 
      initialValente={safeValente} 
      ranking={safeRanking}
      personalRank={personalRank}
      initialCompanheiros={safeCompanheiros}
    />
  );
}