"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GET_XP_MULTIPLIER } from "@/constants/gameConfig";

export async function updateValenteXp(valenteId: string, baseAmount: number, customReason?: string) {
  try {
    const multiplier = GET_XP_MULTIPLIER();
    const finalXp = Math.floor(baseAmount * multiplier.factor);

    const currentValente = await prisma.valente.findUnique({
      where: { id: valenteId },
      include: { 
        reliquias: { include: { reliquia: true } },
        holyPower: true 
      }
    });

    if (!currentValente) throw new Error("Valente not found.");

    const newTotalXP = currentValente.totalXP + finalXp;
    const alreadyEarnedIds = new Set(currentValente.reliquias.map(vr => vr.reliquiaId));

    const allReliquias = await prisma.reliquia.findMany();

    const newlyEarned = allReliquias.filter(relic => {
      if (alreadyEarnedIds.has(relic.id)) return false;
      const params = relic.ruleParams as any;

      switch (relic.triggerType) {
        case "XP_MILESTONE":
          return newTotalXP >= params.target;
        case "HABIT_STREAK":
          const habit = currentValente.holyPower.find(h => h.name === params.habit);
          return habit ? habit.streak >= params.days : false;
        default:
          return false;
      }
    });

    const updated = await prisma.valente.update({
      where: { id: valenteId },
      data: {
        totalXP: newTotalXP,
        xpLogs: { create: { amount: finalXp, reason: customReason || "Treino" } },
        reliquias: {
          create: newlyEarned.map(r => ({
            reliquia: { connect: { id: r.id } }
          }))
        }
      },
      include: {
        reliquias: { include: { reliquia: true } },
        xpLogs: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    });

    // CRITICAL FIX: Tell Next.js to refresh the data
    revalidatePath(`/admin/valentes/${valenteId}`);
    revalidatePath("/admin/valentes");

    return { 
      success: true, 
      newTotalXP: updated.totalXP, 
      newMedals: newlyEarned, // Renamed to match Client expectations
      newLogs: updated.xpLogs   // Added for instant log update
    };
  } catch (error) {
    console.error("XP Update Error:", error);
    return { success: false };
  }
}

/**
 * Retrieves the top 5 Valentes based on total XP for the leaderboard.
 */
export async function getGlobalRanking() {
  try {
    return await prisma.valente.findMany({
      orderBy: { totalXP: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        totalXP: true,
        structure: true,
        image: true,
      },
    });
  } catch (error) {
    console.error("Rank retrieval failure:", error);
    return [];
  }
}

/**
 * Determines the rank of a specific individual relative to the total population.
 */
export async function getPersonalRank(currentXp: number) {
  try {
    const higherRankedCount = await prisma.valente.count({
      where: { totalXP: { gt: currentXp } },
    });

    const totalValentes = await prisma.valente.count();

    return { rank: higherRankedCount + 1, total: totalValentes };
  } catch (error) {
    console.error("Personal rank calculation failure:", error);
    return { rank: 0, total: 0 };
  }
}

/**
 * Updates the Valente profile in the database.
 */
export async function updateValenteProfile(valenteId: string, data: any) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.valente.update({
        where: { id: valenteId },
        data: {
          name: data.name,
          structure: data.structure,
          description: data.description,
          attributes: {
            update: {
              forca: data.attributes.forca,
              destreza: data.attributes.destreza,
              constituicao: data.attributes.constituicao,
              inteligencia: data.attributes.inteligencia,
              sabedoria: data.attributes.sabedoria,
              carisma: data.attributes.carisma,
            }
          },
          // Keeping loveLanguages logic as requested
          loveLanguages: {
            update: {
              palavras: data.loveLanguages.palavras,
              servico: data.loveLanguages.servico,
              presentes: data.loveLanguages.presentes,
              tempo: data.loveLanguages.tempo,
              toque: data.loveLanguages.toque,
            }
          }
        }
      });

      if (data.holyPower) {
        for (const power of data.holyPower) {
          const existingPower = await tx.holyPower.findFirst({
            where: { valenteId, name: power.name }
          });

          if (existingPower) {
            await tx.holyPower.update({
              where: { id: existingPower.id },
              data: {
                current: power.current,
                goal: power.goal,
                streak: power.streak
              }
            });
          } else {
            await tx.holyPower.create({
              data: {
                valenteId,
                name: power.name,
                current: power.current,
                goal: power.goal,
                streak: power.streak
              }
            });
          }
        }
      }
    });

    // Solve the "Ghost image" issue by revalidating the layout
    revalidatePath(`/admin/valentes/${valenteId}`, 'layout');
    revalidatePath("/admin/valentes");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false };
  }
}

/**
 * Forges a new Valente profile in the database.
 */
export async function createValente(data: any) {
  try {
    const defaultUser = await prisma.user.findFirst();
    if (!defaultUser) throw new Error("Nenhum Discipulador encontrado no sistema.");

    const newValente = await prisma.$transaction(async (tx) => {
      return await tx.valente.create({
        data: {
          name: data.name,
          structure: data.structure,
          description: data.description,
          userId: defaultUser.id,
          attributes: {
            create: {
              forca: data.attributes.forca,
              destreza: data.attributes.destreza,
              constituicao: data.attributes.constituicao,
              inteligencia: data.attributes.inteligencia,
              sabedoria: data.attributes.sabedoria,
              carisma: data.attributes.carisma,
            }
          },
          loveLanguages: {
            create: {
              palavras: data.loveLanguages.palavras,
              servico: data.loveLanguages.servico,
              presentes: data.loveLanguages.presentes,
              tempo: data.loveLanguages.tempo,
              toque: data.loveLanguages.toque,
            }
          },
          holyPower: {
            create: data.holyPower.map((power: any) => ({
              name: power.name,
              current: power.current,
              goal: power.goal,
              streak: power.streak
            }))
          }
        }
      });
    });

    revalidatePath(`/admin/valentes`);
    return { success: true, id: newValente.id };
  } catch (error) {
    console.error("Failed to recruit Valente:", error);
    return { success: false };
  }
} 

/**
 * Permanently deletes a Valente and all their associated records.
 */
export async function deleteValente(valenteId: string) {
  try {
    await prisma.valente.delete({
      where: { id: valenteId },
    });

    revalidatePath("/admin/valentes");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete profile:", error);
    return { success: false };
  }
}

/**
 * Retrieves the complete catalog of Relíquias available in the Kingdom.
 */
export async function getAllReliquias() {
  try {
    return await prisma.reliquia.findMany({
      orderBy: { createdAt: 'desc' } 
    });
  } catch (error) {
    console.error("Failed to fetch reliquia catalog:", error);
    return [];
  }
}