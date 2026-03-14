"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { completeMission } from "./missionActions";

/**
 * Searches for Valentes by name to recruit as companions.
 * Excludes the current Valente from results.
 * Retrieves both guildaName and guildaIcon for the UI display.
 */
export async function searchValentes(query: string, excludeId: string) {
  if (!query || query.length < 2) return [];

  try {
    return await prisma.valente.findMany({
      where: {
        name: { 
          contains: query, 
          mode: "insensitive" 
        },
        id: { 
          not: excludeId 
        }
      },
      select: {
        id: true,
        name: true,
        image: true,
        structure: true,
        managedBy: {
          select: {
            guildaName: true,
            guildaIcon: true
          }
        }
      },
      take: 5
    });
  } catch (error) {
    console.error("Erro na busca de Valentes:", error);
    return [];
  }
}

/**
 * Retrieves full tactical data for companions based on an array of IDs.
 * Retrieves both guildaName and guildaIcon for the UI display.
 */
export async function getCompanheirosDetails(friendIds: string[]) {
  try {
    if (!friendIds || friendIds.length === 0) return [];

    return await prisma.valente.findMany({
      where: {
        id: { in: friendIds },
      },
      select: {
        id: true,
        name: true,
        image: true,
        structure: true,
        totalXP: true,
        managedBy: {
          select: {
            guildaName: true,
            guildaIcon: true
          }
        }
      },
    });
  } catch (error) {
    console.error("Erro ao buscar detalhes dos companheiros:", error);
    return [];
  }
}

/**
 * Evaluates friend-count requirements and completes eligible missions.
 * Returns an array of missions that were successfully processed.
 */
async function checkAutomatedSocialMissions(valenteId: string) {
  try {
    const valente = await prisma.valente.findUnique({
      where: { id: valenteId },
      select: { friendIds: true }
    });

    if (!valente) return [];

    const friendCount = valente.friendIds.length;

    const qualifiedMissions = await prisma.mission.findMany({
      where: {
        triggerType: "FRIEND_COUNT",
        targetValue: { lte: friendCount }
      }
    });

    const completedMissions = await prisma.valenteMission.findMany({
      where: {
        valenteId,
        status: "COMPLETED",
        missionId: { in: qualifiedMissions.map(m => m.id) }
      },
      select: { missionId: true }
    });

    const completedIds = new Set(completedMissions.map(cm => cm.missionId));
    const newlyCompleted = [];

    for (const mission of qualifiedMissions) {
      if (!completedIds.has(mission.id)) {
        const result = await completeMission(valenteId, mission.id);
        if (result.success) {
          newlyCompleted.push({
            id: mission.id,
            title: mission.title,
            xpReward: mission.xpReward,
            newRelics: result.newRelics
          });
        }
      }
    }
    return newlyCompleted;
  } catch (error) {
    console.error("Erro ao verificar missões sociais automatizadas:", error);
    return [];
  }
}

/**
 * Establishes a mutual bond and returns any automated mission results.
 */
export async function addCompanheiro(valenteId: string, newFriendId: string) {
  try {
    const [valente, newFriend] = await Promise.all([
      prisma.valente.findUnique({ where: { id: valenteId }, select: { name: true } }),
      prisma.valente.findUnique({ where: { id: newFriendId }, select: { name: true } }),
    ]);

    if (!valente || !newFriend) throw new Error("Valente não encontrado.");

    await prisma.$transaction([
      prisma.valente.update({
        where: { id: valenteId },
        data: { friendIds: { push: newFriendId } },
      }),
      prisma.valente.update({
        where: { id: newFriendId },
        data: { friendIds: { push: valenteId } },
      }),
      prisma.xpLog.create({
        data: {
          valenteId: valenteId,
          amount: 0,
          reason: `Vínculo de amizade forjado com ${newFriend.name}`
        }
      }),
      prisma.xpLog.create({
        data: {
          valenteId: newFriendId,
          amount: 0,
          reason: `Vínculo de amizade forjado com ${valente.name}`
        }
      })
    ]);

    const triggeredMissions = await checkAutomatedSocialMissions(valenteId);
    
    await checkAutomatedSocialMissions(newFriendId);

    revalidatePath(`/admin/valentes/${valenteId}`);
    revalidatePath(`/admin/valentes/${newFriendId}`);

    return { 
      success: true, 
      automatedMissions: triggeredMissions 
    };
  } catch (error) {
    console.error("Erro ao forjar vínculo:", error);
    return { success: false, error: "Falha ao estabelecer conexão." };
  }
}

/**
 * Severs the bond between two Valentes.
 */
export async function removeCompanheiro(valenteId: string, exFriendId: string) {
  try {
    const [valente, exFriend] = await Promise.all([
      prisma.valente.findUnique({ where: { id: valenteId }, select: { friendIds: true } }),
      prisma.valente.findUnique({ where: { id: exFriendId }, select: { friendIds: true } }),
    ]);

    if (!valente || !exFriend) throw new Error("Valente não encontrado.");

    const newValenteFriends = valente.friendIds.filter(id => id !== exFriendId);
    const newExFriendFriends = exFriend.friendIds.filter(id => id !== valenteId);

    await prisma.$transaction([
      prisma.valente.update({
        where: { id: valenteId },
        data: { friendIds: { set: newValenteFriends } },
      }),
      prisma.valente.update({
        where: { id: exFriendId },
        data: { friendIds: { set: newExFriendFriends } },
      }),
    ]);

    revalidatePath(`/admin/valentes/${valenteId}`);
    revalidatePath(`/admin/valentes/${exFriendId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover vínculo:", error);
    return { success: false };
  }
}