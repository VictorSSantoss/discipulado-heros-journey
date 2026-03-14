"use server";

import prisma from "@/lib/prisma";

export async function getKingdomOverview() {
  try {
    const now = new Date();
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7); // Last 7 rolling days
    startOfWeek.setHours(0, 0, 0, 0);

    // 1. Core Counts
    const totalValentes = await prisma.valente.count();
    const newRecruitsThisMonth = await prisma.valente.count({
      where: { createdAt: { gte: startOfMonth } },
    });

    // 2. XP Aggregation
    const weeklyXpAggregate = await prisma.xpLog.aggregate({
      where: { createdAt: { gte: startOfWeek } },
      _sum: { amount: true },
    });
    const weeklyXp = weeklyXpAggregate._sum.amount || 0;
    const avgXp = totalValentes > 0 ? Math.round(weeklyXp / totalValentes) : 0;

    // 3. Mission Metrics (Updated for Open Bounty Model)
    // Counts how many missions are on the board
    const totalAvailableMissions = await prisma.mission.count();

    // Counts how many times "Missão Concluída" or "Missão:" appeared in logs this week
    const weeklyCompletedMissions = await prisma.xpLog.count({
      where: { 
        createdAt: { gte: startOfWeek },
        reason: { contains: "Missão" } // Filters logs that came from missions
      },
    });

    // 4. Combat Log
    const recentLogs = await prisma.xpLog.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        valente: { 
          select: { 
            name: true, 
            image: true,
            managedBy: {
              select: {
                guildaName: true,
                guildaIcon: true
              }
            }
          } 
        },
      },
    });

    return {
      success: true,
      data: {
        totalValentes,
        newRecruitsThisMonth,
        weeklyXp,
        avgXp,
        weeklyCompletedMissions,
        totalAvailableMissions,
        recentLogs,
      },
    };
  } catch (error) {
    console.error("Failed to fetch kingdom overview:", error);
    return { success: false, data: null };
  }
}