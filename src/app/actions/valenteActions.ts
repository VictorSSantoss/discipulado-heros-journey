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
    // 1. Calculation of the temporal multiplier
    const multiplier = GET_XP_MULTIPLIER();
    const finalXp = Math.floor(baseAmount * multiplier.factor);

    // 2. Retrieval of current data and existing reliquias
    const currentValente = await prisma.valente.findUnique({
      where: { id: valenteId },
      include: { 
        reliquias: {
          include: { reliquia: true }
        }
      }
    });

    if (!currentValente) {
      throw new Error("Target Valente not found in database.");
    }

    const newTotalXP = currentValente.totalXP + finalXp;

    // 3. Identification of new reliquias based on milestones
    const alreadyEarnedReliquiaIds = currentValente.reliquias.map(vr => vr.reliquiaId);
    
    // Fetch all XP milestone reliquias not yet earned
    const allMilestones = await prisma.reliquia.findMany({
      where: {
        triggerType: "XP_MILESTONE",
        id: { notIn: alreadyEarnedReliquiaIds }
      }
    });

    // Filter by the target value stored in ruleParams JSON
    const eligibleReliquias = allMilestones
      .filter((r: any) => {
        const params = r.ruleParams as any;
        return params && params.target <= newTotalXP;
      })
      .sort((a: any, b: any) => (b.ruleParams as any).target - (a.ruleParams as any).target);

    // 4. Determine Log Reason
    const finalReason = customReason || (multiplier.factor > 1 
      ? `Treino Finalizado (${multiplier.label})` 
      : "Treino Finalizado / Atividade");

    // 5. Execution of the atomic update
    const updatedValente = await prisma.valente.update({
      where: { id: valenteId },
      data: {
        totalXP: newTotalXP,
        xpLogs: {
          create: {
            amount: finalXp,
            reason: finalReason
          }
        },
        reliquias: {
          create: eligibleReliquias.map(r => ({
            reliquia: { connect: { id: r.id } }
          }))
        }
      },
      include: {
        xpLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        reliquias: {
          include: { reliquia: true }
        }
      }
    });

    // 6. Revalidation of affected cache paths for immediate UI updates
    revalidatePath(`/admin/valentes/${valenteId}`);
    revalidatePath(`/admin/valentes`);
    revalidatePath(`/admin`);

    return { 
      success: true, 
      newTotalXP: updatedValente.totalXP,
      newLogs: updatedValente.xpLogs,
      newMedals: eligibleReliquias 
    };
  } catch (error) {
    console.error("Critical error during XP update process:", error);
    return { success: false, error: "Database transaction failed." };
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