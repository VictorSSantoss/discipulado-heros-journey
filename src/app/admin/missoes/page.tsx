import prisma from "@/lib/prisma";
import MissoesClient from "./MissionsClient";

export default async function MissoesPage() {
  // 1. Fetch Missions: Newest first within their categories
  const dbMissions = await prisma.mission.findMany({ 
    orderBy: { createdAt: 'desc' } 
  });
  
  // 2. Fetch Valentes for the reward modal
  const valentes = await prisma.valente.findMany({
    select: { id: true, name: true, structure: true },
    orderBy: { name: 'asc' }
  });

  // 3. Fetch Active Decrees: Newest assignments first
  const activeDecrees = await prisma.valenteMission.findMany({
    where: { status: 'ACTIVE' },
    include: {
      valente: { select: { id: true, name: true, image: true } },
      mission: true
    },
    orderBy: { createdAt: 'desc' } 
  });

  return (
    <MissoesClient 
      initialMissions={dbMissions} 
      valentes={valentes} 
      activeDecrees={activeDecrees} 
    />
  );
}