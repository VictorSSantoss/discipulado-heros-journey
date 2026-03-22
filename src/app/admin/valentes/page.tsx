import prisma from "@/lib/prisma";
import ValentesClientView from "./ValentesClientView";

// 1. Define local interfaces to stop the 'any' and property errors
interface Patente {
  id: string;
  title: string;
  level: number;
  xpRequired: number;
  iconUrl: string;
  tierColor: string;
}

export default async function ValentesPage() {
  // 2. Fetch data
  // Note: If 'patente' or 'managedBy' shows a red underline here, 
  // it means you MUST run 'npx prisma generate' again.
  const [valentesRaw, allPatentes] = await Promise.all([
    prisma.valente.findMany({
      include: {
        patente: true, 
        attributes: true,
        holyPower: true,
        loveLanguages: true,
        managedBy: {
          select: {
            // Ensure these match your schema.prisma exactly
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
  ]) as [any[], Patente[]]; // Casting helps if the Prisma Client is out of sync

  // 3. Map the data with explicit parameter types
  const valentesWithProgression = valentesRaw.map((valente: any) => {
    const currentLevel = valente.patente?.level ?? 0;
    
    // Explicit type for 'p' fixes the 'implicit any' error
    const nextPatente = allPatentes.find((p: Patente) => p.level > currentLevel);

    const currentXP = valente.totalXP || 0;
    const minXP = valente.patente?.xpRequired || 0;
    const maxXP = nextPatente?.xpRequired || currentXP;
    
    let progressPercent = 0;
    if (nextPatente) {
      const range = maxXP - minXP;
      const earned = currentXP - minXP;
      progressPercent = Math.min(Math.max((earned / range) * 100, 0), 100);
    } else {
      progressPercent = 100;
    }

    return {
      ...valente,
      nextLevelXP: nextPatente ? nextPatente.xpRequired : null,
      nextLevelTitle: nextPatente ? nextPatente.title : 'NÍVEL MÁXIMO',
      xpPercent: progressPercent,
      currentPatente: valente.patente 
    };
  });

  return <ValentesClientView initialValentes={valentesWithProgression} />;
}