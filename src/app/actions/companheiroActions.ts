"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Searches for Valentes by name to recruit as companions.
 * Excludes the current Valente from results.
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
        structure: true
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
      },
    });
  } catch (error) {
    console.error("Erro ao buscar detalhes dos companheiros:", error);
    return [];
  }
}

/**
 * Establishes a mutual bond and records the event in the Mission Log.
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

    revalidatePath(`/admin/valentes/${valenteId}`);
    revalidatePath(`/admin/valentes/${newFriendId}`);

    return { success: true };
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