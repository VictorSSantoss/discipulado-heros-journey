"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GET_XP_MULTIPLIER } from "@/constants/gameConfig";
import { PrismaClient } from '@prisma/client';

/**
 * Updates total XP, grants medals based on milestones, and logs the transaction.
 * Handles the many-to-many relationship for medals and clears the server cache.
 */
export async function updateValenteXp(valenteId: string, baseAmount: number) {
  try {
    // 1. Calculation of the temporal multiplier
    const multiplier = GET_XP_MULTIPLIER();
    const finalXp = Math.floor(baseAmount * multiplier.factor);

    // 2. Retrieval of current data and existing medals
    const currentValente = await prisma.valente.findUnique({
      where: { id: valenteId },
      include: { 
        medals: {
          include: { medal: true }
        }
      }
    });

    if (!currentValente) {
      throw new Error("Target Valente not found in database.");
    }

    const newTotalXP = currentValente.totalXP + finalXp;

    // 3. Identification of new medals based on milestones defined in the Medal table
    // This assumes Medal records with type XP_MILESTONE are already seeded.
    const alreadyEarnedMedalIds = currentValente.medals.map(vm => vm.medalId);
    
    const eligibleMedals = await prisma.medal.findMany({
      where: {
        type: "XP_MILESTONE",
        requirement: { lte: newTotalXP },
        id: { notIn: alreadyEarnedMedalIds }
      }
    });

    // 4. Execution of the atomic update
    const updatedValente = await prisma.valente.update({
      where: { id: valenteId },
      data: {
        totalXP: newTotalXP,
        xpLogs: {
          create: {
            amount: finalXp,
            reason: multiplier.factor > 1 
              ? `Treino Finalizado (${multiplier.label})` 
              : "Treino Finalizado / Ajuste de Atributos"
          }
        },
        // Creation of entries in the ValenteMedal join table
        medals: {
          create: eligibleMedals.map(m => ({
            medal: { connect: { id: m.id } }
          }))
        }
      },
      include: {
        xpLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        medals: {
          include: { medal: true }
        }
      }
    });

    // 5. Revalidation of affected cache paths for immediate UI updates
    revalidatePath(`/admin/valentes/${valenteId}`);
    revalidatePath(`/admin/valentes`);

    return { 
      success: true, 
      newTotalXP: updatedValente.totalXP,
      newLogs: updatedValente.xpLogs,
      newMedals: eligibleMedals // Provides data for frontend notifications
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
 * Maps Ministry UI labels (Liderança, etc.) to Prisma Schema fields (forca, etc.)
 */
export async function updateValenteProfile(valenteId: string, data: any) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Update core info, love languages, and map attributes
      await tx.valente.update({
        where: { id: valenteId },
        data: {
          name: data.name,
          structure: data.structure,
          description: data.description,
          // MAPPING: Form (Ministry Keys) -> DB Schema (RPG Keys)
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

      // 2. Update Holy Power (Upsert logic since they might not exist yet)
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
 * Establishes initial relations for Attributes, Love Languages, and Holy Power.
 */
export async function createValente(data: any) {
  try {
    // TEMPORARY: Fetching a default user to satisfy the 'managedBy' relation. 
    // Replace this with session.user.id once Auth is implemented.
    const defaultUser = await prisma.user.findFirst();
    if (!defaultUser) throw new Error("Nenhum Discipulador encontrado no sistema.");

    const newValente = await prisma.$transaction(async (tx) => {
      return await tx.valente.create({
        data: {
          name: data.name,
          structure: data.structure,
          description: data.description,
          userId: defaultUser.id,
          // MAPPING: Form (Ministry Keys) -> DB Schema (RPG Keys)
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
 * Permanently deletes a Valente and all their associated records from the database.
 */
export async function deleteValente(valenteId: string) {
  try {
    // Note: If your Prisma schema does not have onDelete: Cascade set for relations
    // like Attributes or HolyPower, you might need to delete them first inside a transaction.
    // Assuming standard cascading is in place:
    await prisma.valente.delete({
      where: { id: valenteId },
    });

    revalidatePath("/admin/valentes");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete profile:", error);
    return { success: false };
  }
}