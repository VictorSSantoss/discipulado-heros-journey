import prisma from "@/lib/prisma";
import ValentesClientView from "./ValentesClientView";

export default async function ValentesPage() {
  // 1. Fetch live data and all available patentes in parallel
  const [valentesRaw, allPatentes] = await Promise.all([
    prisma.valente.findMany({
      include: {
        patente: true, // Now Prisma recognizes this!
        attributes: true,
        holyPower: true,
        loveLanguages: true,
        managedBy: {
          select: {
            guildaName: true,
            guildaIcon: true
          }
        }
      },
      orderBy: {
        name: 'asc' 
      }
    }),
    prisma.patente.findMany({
      orderBy: { level: 'asc' }
    })
  ]);

  // 2. Map the data to inject "nextLevelXP" and "nextLevelTitle"
  const valentesWithProgression = valentesRaw.map(valente => {
    // We look for the current level. If the Valente has no rank, we start at 0.
    const currentLevel = valente.patente?.level || 0;
    
    // Find the next rank in the hierarchy
    const nextPatente = allPatentes.find(p => p.level > currentLevel);

    return {
      ...valente,
      nextLevelXP: nextPatente ? nextPatente.xpRequired : null,
      nextLevelTitle: nextPatente ? nextPatente.title : 'NÍVEL MÁXIMO'
    };
  });

  return <ValentesClientView initialValentes={valentesWithProgression} />;
}