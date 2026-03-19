"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GET_XP_MULTIPLIER } from "@/constants/gameConfig"; 

// Processes mission completion, calculates XP with multipliers, applies attribute bonuses, and checks for relic unlocks
export async function completeMission(valenteId: string, missionId: string) {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId }
    });

    if (!mission) throw new Error("Missão não encontrada.");

    const multiplier = GET_XP_MULTIPLIER();
    const finalXp = Math.floor(mission.xpReward * multiplier.factor);

    const attributeUpdate: any = {};
    
    if (mission.rewardAttribute && mission.rewardAttrValue > 0) {
      attributeUpdate[mission.rewardAttribute] = { increment: mission.rewardAttrValue };
    }
    
    if (mission.rewardAttribute2 && mission.rewardAttrValue > 0) {
      attributeUpdate[mission.rewardAttribute2] = { increment: mission.rewardAttrValue };
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.valenteMission.upsert({
        where: { valenteId_missionId: { valenteId, missionId } },
        create: { valenteId, missionId, status: "COMPLETED", completedAt: new Date() },
        update: { status: "COMPLETED", completedAt: new Date() }
      });

      const valente = await tx.valente.update({
        where: { id: valenteId },
        data: { 
          totalXP: { increment: finalXp },
          ...(Object.keys(attributeUpdate).length > 0 && {
            attributes: { update: attributeUpdate }
          })
        }
      });

      await tx.xpLog.create({
        data: {
          valenteId,
          amount: finalXp,
          reason: `Missão: ${mission.title}`
        }
      });

      const earnedRelics = await tx.valenteReliquia.findMany({ where: { valenteId } });
      const earnedIds = new Set(earnedRelics.map(e => e.reliquiaId));
      
      const allXpRelics = await tx.reliquia.findMany({
        where: { triggerType: "XP_MILESTONE" }
      });

      const newlyUnlockedRelics = []; 

      for (const relic of allXpRelics) {
        if (!earnedIds.has(relic.id)) {
          const rule = typeof relic.ruleParams === 'string' ? JSON.parse(relic.ruleParams) : relic.ruleParams as any;
          const targetXp = rule?.target || 999999; 

          if (valente.totalXP >= targetXp) {
            newlyUnlockedRelics.push(relic); 
            await tx.valenteReliquia.create({ data: { valenteId, reliquiaId: relic.id } });
          }
        }
      }

      return { valente, newlyUnlockedRelics }; 
    });

    revalidatePath("/admin/missoes");
    revalidatePath("/admin");
    revalidatePath(`/admin/valentes/${valenteId}`);
    
    return { 
      success: true, 
      newTotalXp: result.valente.totalXP,
      newRelics: result.newlyUnlockedRelics 
    };

  } catch (error) {
    console.error("Erro ao conceder XP da missão:", error);
    return { success: false };
  }
}

// Removes a mission template from the database and refreshes the cache
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

// Inserts a new mission record into the database mapping all parameters including the trigger logic
export async function createMission(data: {
  title: string;
  description: string;
  xpReward: number;
  type: string;
  triggerType: string;
  targetValue: number;
  rewardAttribute?: string | null;
  rewardAttribute2?: string | null; 
  rewardAttrValue?: number;
  periodicity?: string; // ⏳ Added Time-Gate parameter
  expiresAt?: string | null; // ⏳ Added Expiration Date parameter
}) {
  try {
    const mission = await prisma.mission.create({
      data: {
        title: data.title,
        description: data.description,
        xpReward: data.xpReward,
        type: data.type,
        triggerType: data.triggerType,
        targetValue: data.targetValue,
        rewardAttribute: data.rewardAttribute,
        rewardAttribute2: data.rewardAttribute2,
        rewardAttrValue: data.rewardAttrValue || 0,
        periodicity: data.periodicity || "NONE", // ⏳ Save to DB
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null, // ⏳ Parse and Save to DB
      },
    });

    revalidatePath("/admin/missoes");
    return { success: true, id: mission.id };
  } catch (error) {
    console.error("Failed to create mission:", error);
    return { success: false };
  }
}

// Updates an existing mission record mapped to the provided mission ID
export async function updateMission(id: string, data: { 
  title: string; 
  description: string; 
  xpReward: number; 
  type: string;
  triggerType: string;
  targetValue: number;
  rewardAttribute?: string | null;
  rewardAttribute2?: string | null; 
  rewardAttrValue?: number;
  periodicity?: string; // ⏳ Added Time-Gate parameter
  expiresAt?: string | null; // ⏳ Added Expiration Date parameter
}) {
  try {
    await prisma.mission.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        xpReward: data.xpReward,
        type: data.type,
        triggerType: data.triggerType,
        targetValue: data.targetValue,
        rewardAttribute: data.rewardAttribute,
        rewardAttribute2: data.rewardAttribute2,
        rewardAttrValue: data.rewardAttrValue || 0,
        periodicity: data.periodicity || "NONE", // ⏳ Save to DB
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null, // ⏳ Parse and Save to DB
      },
    });
    revalidatePath("/admin/missoes");
    return { success: true };
  } catch (error) {
    console.error("Failed to update mission:", error);
    return { success: false };
  }
}

// Retrieves all missions and exposes the trigger configuration to populate the edit form and lists
export async function getAllMissions() {
  try {
    const missions = await prisma.mission.findMany({
      select: { 
        id: true, 
        title: true, 
        description: true, 
        xpReward: true, 
        type: true,
        triggerType: true,
        targetValue: true,
        periodicity: true, // ⏳ Ensure the frontend gets this data
        expiresAt: true,   // ⏳ Ensure the frontend gets this data
      },
      orderBy: { title: 'asc' }
    });
    return missions;
  } catch (error) {
    console.error("Failed to fetch missions:", error);
    return [];
  }
}