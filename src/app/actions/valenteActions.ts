"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GET_XP_MULTIPLIER, STRUCTURE_BONUS } from "@/constants/gameConfig";

// ⚔️ ARQUIVO DE SILHUETAS: Adicione os caminhos das suas imagens aleatórias aqui
const PLACEHOLDERS = [
  "/images/man-silhouette.svg",
  "/images/man-silhouette-2.svg" 
];

/**
 * ⚔️ MISSION COMPLETION ENGINE
 */
export async function completeMission(valenteId: string, missionId: string) {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId }
    });

    if (!mission) throw new Error("Missão não encontrada.");

    const multiplier = GET_XP_MULTIPLIER();
    const finalXp = Math.floor(mission.xpReward * multiplier.factor);

    const updatedValente = await prisma.$transaction(async (tx) => {
      await tx.valenteMission.upsert({
        where: {
          valenteId_missionId: { valenteId, missionId }
        },
        update: {
          status: "COMPLETED",
          completedAt: new Date()
        },
        create: {
          valenteId,
          missionId,
          status: "COMPLETED",
          completedAt: new Date()
        }
      });

      const attributeUpdate = mission.rewardAttribute 
        ? { [mission.rewardAttribute]: { increment: mission.rewardAttrValue } }
        : {};

      return await tx.valente.update({
        where: { id: valenteId },
        data: {
          totalXP: { increment: finalXp },
          xpLogs: {
            create: {
              amount: finalXp,
              reason: `Missão: ${mission.title}`
            }
          },
          attributes: {
            update: attributeUpdate
          }
        },
        include: { attributes: true }
      });
    });

    revalidatePath(`/admin/valentes/${valenteId}`);
    revalidatePath("/admin/valentes");
    revalidatePath("/admin/missoes");

    return { 
      success: true, 
      xpGained: finalXp,
      attributeBoosted: mission.rewardAttribute,
      newTotalXp: updatedValente.totalXP
    };
  } catch (error) {
    console.error("Critical Failure in Mission Completion:", error);
    return { success: false, message: "Erro ao processar recompensas." };
  }
}

/**
 * ⚔️ XP UPDATE & RELIC TRIGGERING
 */
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

    revalidatePath(`/admin/valentes/${valenteId}`);
    revalidatePath("/admin/valentes");

    return { 
      success: true, 
      newTotalXP: updated.totalXP, 
      newMedals: newlyEarned, 
      newLogs: updated.xpLogs   
    };
  } catch (error) {
    console.error("XP Update Error:", error);
    return { success: false };
  }
}

/**
 * ⚔️ RANKING SYSTEM
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
 * ⚔️ PROFILE MANAGEMENT
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
          ...(data.attributes && {
            attributes: {
              update: {
                forca: data.attributes.forca,
                destreza: data.attributes.destreza,
                constituicao: data.attributes.constituicao,
                inteligencia: data.attributes.inteligencia,
                sabedoria: data.attributes.sabedoria,
                carisma: data.attributes.carisma,
              }
            }
          }),
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
              data: { current: power.current, goal: power.goal, streak: power.streak }
            });
          } else {
            await tx.holyPower.create({
              data: { valenteId, name: power.name, current: power.current, goal: power.goal, streak: power.streak }
            });
          }
        }
      }
    });

    revalidatePath(`/admin/valentes/${valenteId}`, 'layout');
    revalidatePath("/admin/valentes");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false };
  }
}

/**
 * ⚔️ RECRUITMENT ENGINE (MODIFIED)
 */
export async function createValente(data: any) {
  try {
    const defaultUser = await prisma.user.findFirst();
    if (!defaultUser) throw new Error("Nenhum Discipulador encontrado.");

    // Lógica de Silhueta Aleatória:
    let finalImage = data.image;
    if (!finalImage || finalImage.trim() === "") {
      const randomIndex = Math.floor(Math.random() * PLACEHOLDERS.length);
      finalImage = PLACEHOLDERS[randomIndex];
    }

    let startingAttributes: any = {
      forca: 1, destreza: 1, constituicao: 1, 
      inteligencia: 1, sabedoria: 1, carisma: 1
    };

    const bonus = STRUCTURE_BONUS[data.structure?.toUpperCase()];
    if (bonus) {
      startingAttributes[bonus.attribute] = bonus.value;
    }

    const newValente = await prisma.$transaction(async (tx) => {
      return await tx.valente.create({
        data: {
          name: data.name,
          image: finalImage,
          structure: data.structure,
          description: data.description,
          userId: defaultUser.id,
          attributes: { create: startingAttributes },
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
 * ⚔️ DELETION & UTILITIES
 */
export async function deleteValente(valenteId: string) {
  try {
    await prisma.valente.delete({ where: { id: valenteId } });
    revalidatePath("/admin/valentes");
    return { success: true };
  } catch (error) {
    console.error("Deletion failed:", error);
    return { success: false };
  }
}

export async function getAllReliquias() {
  const relics = await prisma.reliquia.findMany({
    orderBy: { createdAt: 'asc' }
  });
  
  return relics.map(relic => {
    const rule = typeof relic.ruleParams === 'string' 
      ? JSON.parse(relic.ruleParams) 
      : relic.ruleParams;
    
    return {
      ...relic,
      requirement: rule?.target || 0
    };
  });
}


export async function grantManualRelic(valenteId: string, relicId: string) {
  try {
    const newLink = await prisma.valenteReliquia.create({
      data: {
        valenteId: valenteId,
        reliquiaId: relicId,
      },
      include: {
        reliquia: true
      }
    });

    return { success: true, relic: newLink.reliquia };
  } catch (error) {
    console.error("Error granting manual relic:", error);
    return { success: false, error: "Database error" };
  }
}