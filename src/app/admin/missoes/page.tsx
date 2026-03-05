import prisma from "@/lib/prisma";
import MissoesClient from "./MissionsClient"; // <-- Ensure your client file is named exactly MissoesClient.tsx

export default async function MissoesPage() {
  // Fetch real data from the database
  const dbMissions = await prisma.mission.findMany({ orderBy: { title: 'asc' } });
  
  const valentes = await prisma.valente.findMany({
    select: { id: true, name: true, structure: true },
    orderBy: { name: 'asc' }
  });

  const activeDecrees = await prisma.valenteMission.findMany({
    where: { status: 'ACTIVE' },
    include: {
      valente: { select: { id: true, name: true, image: true } },
      mission: true
    },
    // FIX: Removed 'createdAt'. Now ordering alphabetically by the Mission's title.
    orderBy: { mission: { title: 'asc' } } 
  });

  return (
    <MissoesClient 
      initialMissions={dbMissions} 
      valentes={valentes} 
      activeDecrees={activeDecrees} 
    />
  );
}