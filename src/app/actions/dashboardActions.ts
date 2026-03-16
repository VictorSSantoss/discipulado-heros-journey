"use server";

import prisma from "@/lib/prisma";
import { startOfDay, startOfMonth, subDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Fetches kingdom-wide metrics and historical XP data for the dashboard.
 */
export async function getKingdomOverview() {
  try {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const sevenDaysAgo = startOfDay(subDays(now, 6)); // Inclusive of today

    // 1. Fetch Basic Metrics (Total Valentes)
    // FIX: Querying the 'Valente' model instead of the 'User' model
    const totalValentes = await prisma.valente.count();

    // 2. Fetch New Recruits (Created this month)
    // FIX: Querying the 'Valente' model
    const newRecruitsThisMonth = await prisma.valente.count({
      where: { 
        createdAt: { gte: startOfCurrentMonth }
      }
    });

    // 3. Fetch Mission Metrics
    // FIX: The model in schema is 'Mission'. We count all available missions.
    const totalAvailableMissions = await prisma.mission.count();

    // Count missions completed (approved logs) in the last 7 days
    const weeklyCompletedMissions = await prisma.xpLog.count({
      where: {
        reason: { contains: "Missão" }, // Assuming logs say "Missão concluída", etc.
        createdAt: { gte: sevenDaysAgo }
      }
    });

    // 4. Fetch Recent Logs for the Combat Log
    const recentLogs = await prisma.xpLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        valente: {
          select: { name: true, image: true }
        }
      }
    });

    // 5. Fetch XP History for the Momentum Chart
    const weeklyLogs = await prisma.xpLog.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      select: {
        amount: true,
        createdAt: true
      }
    });

    // 6. Process XP History into Daily Totals
    const dailyDataMap: Record<string, number> = {};
    
    // Initialize the last 7 days with 0 to ensure continuous chart data
    for (let i = 0; i < 7; i++) {
      const date = subDays(now, i);
      const dayLabel = format(date, "EEE", { locale: ptBR }).replace('.', '');
      dailyDataMap[dayLabel] = 0;
    }

    // Sum up the XP amounts per day
    weeklyLogs.forEach(log => {
      const dayLabel = format(log.createdAt, "EEE", { locale: ptBR }).replace('.', '');
      if (dailyDataMap[dayLabel] !== undefined) {
        dailyDataMap[dayLabel] += log.amount;
      }
    });

    // Convert map to array and reverse so it goes from past to present (Left to Right)
    const xpHistory = Object.entries(dailyDataMap)
      .map(([day, xp]) => ({ day: day.toUpperCase(), xp }))
      .reverse();

    // 7. Calculate Averages
    const weeklyXp = weeklyLogs.reduce((sum, log) => sum + log.amount, 0);
    // Because totalValentes is now correct, this average will calculate perfectly
    const avgXp = totalValentes > 0 ? Math.floor(weeklyXp / totalValentes) : 0;

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
        xpHistory
      }
    };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return { success: false, data: null };
  }
}