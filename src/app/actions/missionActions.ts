"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function completeMission(valenteId: string, missionId: string, xpReward: number, missionTitle: string) {
  try {
    await prisma.$transaction([
      prisma.valenteMission.upsert({
        where: { valenteId_missionId: { valenteId, missionId } },
        create: { valenteId, missionId, status: "COMPLETED", completedAt: new Date() },
        update: { status: "COMPLETED", completedAt: new Date() }
      }),
      prisma.valente.update({
        where: { id: valenteId },
        data: { totalXP: { increment: xpReward } }
      }),
      prisma.xpLog.create({
        data: {
          valenteId,
          amount: xpReward,
          reason: `Missão: ${missionTitle}`
        }
      })
    ]);

    revalidatePath("/admin/missoes");
    revalidatePath("/admin");
    revalidatePath(`/admin/valentes/${valenteId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao conceder XP da missão:", error);
    return { success: false };
  }
}

export async function deleteMissionTemplate(missionId: string) {
  try {
    await prisma.mission.delete({ where: { id: missionId } });
    revalidatePath("/admin/missoes");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete mission:", error);
    return { success: false };
  }
}

export async function createMission(data: { title: string; description: string; xpReward: number; type: string }) {
  try {
    const mission = await prisma.mission.create({
      data: {
        title: data.title,
        description: data.description,
        xpReward: data.xpReward,
        type: data.type,
      },
    });
    revalidatePath("/admin/missoes");
    return { success: true, id: mission.id };
  } catch (error) {
    console.error("Failed to create mission:", error);
    return { success: false };
  }
}

export async function updateMission(id: string, data: { title: string; description: string; xpReward: number; type: string }) {
  try {
    await prisma.mission.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        xpReward: data.xpReward,
        type: data.type,
      },
    });
    revalidatePath("/admin/missoes");
    return { success: true };
  } catch (error) {
    console.error("Failed to update mission:", error);
    return { success: false };
  }
}