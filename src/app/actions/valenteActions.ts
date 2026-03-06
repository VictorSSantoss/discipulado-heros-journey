"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GET_XP_MULTIPLIER } from "@/constants/gameConfig";

/**
 * Updates total XP, grants reliquias based on milestones, and logs the transaction.
 * Accepts an optional 'customReason' to sync with the Manual Reward Modal.
 */
export async function updateValenteXp(valenteId: string, baseAmount: number, customReason?: string) {
  try {
    const multiplier = GET_XP_MULTIPLIER();
    const finalXp = Math.floor(baseAmount * multiplier.factor);

    // 1. Fetch Valente with all their current progress
    const currentValente = await prisma.valente.findUnique({
      where: { id: valenteId },
      include: { 
        reliquias: { include: { reliquia: true } },
        holyPower: true // We need this to check streaks!
      }
    });

    if (!currentValente) throw new Error("Valente not found.");

    const newTotalXP = currentValente.totalXP + finalXp;
    const alreadyEarnedIds = new Set(currentValente.reliquias.map(vr => vr.reliquiaId));

    // 2. Fetch ALL potential Relíquias
    const allReliquias = await prisma.reliquia.findMany();

    // 3. THE RULES ENGINE: Filter reliquias that the user JUST earned
    const newlyEarned = allReliquias.filter(relic => {
      if (alreadyEarnedIds.has(relic.id)) return false;

      const params = relic.ruleParams as any;

      switch (relic.triggerType) {
        case "XP_MILESTONE":
          return newTotalXP >= params.target;

        case "HABIT_STREAK":
          const habit = currentValente.holyPower.find(h => h.name === params.habit);
          return habit ? habit.streak >= params.days : false;

        case "ATTRIBUTE_LEVEL":
          // Logic for checking Attribute levels will go here
          return false;

        default:
          return false;
      }
    });

    // 4. Save the progress and the new Relics
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

    return { 
      success: true, 
      newTotalXP: updated.totalXP, 
      newRelics: newlyEarned // This triggers the BF1 popup on the frontend!
    };
  } catch (error) {
    console.error(error);
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
      where: {
        totalXP: { gt: currentXp },
      },
    });

    const totalValentes = await prisma.valente.count();

    return {
      rank: higherRankedCount + 1,
      total: totalValentes,
    };
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
              forca: data.attributes["Liderança"],
              destreza: data.attributes["Servo"],
              constituicao: data.attributes["Trabalho em Equipe"],
              inteligencia: data.attributes["Mestre"],
              sabedoria: data.attributes["Profeta"],
              carisma: data.attributes["Evangelismo"],
            }
          },
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
    });

    revalidatePath(`/admin/valentes/${valenteId}`);
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
              forca: data.attributes["Liderança"],
              destreza: data.attributes["Servo"],
              constituicao: data.attributes["Trabalho em Equipe"],
              inteligencia: data.attributes["Mestre"],
              sabedoria: data.attributes["Profeta"],
              carisma: data.attributes["Evangelismo"],
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