"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GET_XP_MULTIPLIER } from "@/constants/gameConfig"; // Added for Sunday Bonus!

/**
 * THE UNIFIED ENGINE: Completes a mission, gives XP (with multiplier), boosts Dual Attributes,
 * AND auto-grants XP-based Reliquias if thresholds are met.
 */
export async function completeMission(valenteId: string, missionId: string) {
  try {
    // 1. Fetch the mission directly from the DB to prevent client spoofing
    const mission = await prisma.mission.findUnique({
      where: { id: missionId }
    });

    if (!mission) throw new Error("Missão não encontrada.");

    // 2. Calculate final XP with Sunday/Event Multiplier
    const multiplier = GET_XP_MULTIPLIER();
    const finalXp = Math.floor(mission.xpReward * multiplier.factor);

    // 3. Build the dynamic Attribute Update object
    const attributeUpdate: any = {};
    
    // Add Primary Attribute if it exists
    if (mission.rewardAttribute && mission.rewardAttrValue > 0) {
      attributeUpdate[mission.rewardAttribute] = { increment: mission.rewardAttrValue };
    }
    
    // Add Secondary Attribute if it exists (DUAL ATTRIBUTE LOGIC!)
    if (mission.rewardAttribute2 && mission.rewardAttrValue > 0) {
      attributeUpdate[mission.rewardAttribute2] = { increment: mission.rewardAttrValue };
    }

    // 4. Execute everything safely inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Mark mission as completed
      await tx.valenteMission.upsert({
        where: { valenteId_missionId: { valenteId, missionId } },
        create: { valenteId, missionId, status: "COMPLETED", completedAt: new Date() },
        update: { status: "COMPLETED", completedAt: new Date() }
      });

      // Grant XP and Attributes
      const valente = await tx.valente.update({
        where: { id: valenteId },
        data: { 
          totalXP: { increment: finalXp },
          // Only update attributes if the mission actually gives them
          ...(Object.keys(attributeUpdate).length > 0 && {
            attributes: { update: attributeUpdate }
          })
        }
      });

      // Log the history
      await tx.xpLog.create({
        data: {
          valenteId,
          amount: finalXp,
          reason: `Missão: ${mission.title}`
        }
      });

      // -----------------------------------------------------------------------
      // AUTO-GRANT RELICS LOGIC
      // -----------------------------------------------------------------------
      const earnedRelics = await tx.valenteReliquia.findMany({ where: { valenteId } });
      const earnedIds = new Set(earnedRelics.map(e => e.reliquiaId));
      
      // ⚔️ FETCH MISSING RELICS (Restored this line!)
      const allXpRelics = await tx.reliquia.findMany({
        where: { triggerType: "XP_MILESTONE" }
      });

      // ⚔️ NEW LOGIC: Return the FULL relic object
      const newlyUnlockedRelics = []; 

      for (const relic of allXpRelics) {
        if (!earnedIds.has(relic.id)) {
          const rule = typeof relic.ruleParams === 'string' ? JSON.parse(relic.ruleParams) : relic.ruleParams as any;
          const targetXp = rule?.target || 999999; 

          if (valente.totalXP >= targetXp) {
            newlyUnlockedRelics.push(relic); // <-- Save the FULL OBJECT
            await tx.valenteReliquia.create({ data: { valenteId, reliquiaId: relic.id } });
          }
        }
      }

      return { valente, newlyUnlockedRelics }; // Return the new array
    });

    // Refresh UI
    revalidatePath("/admin/missoes");
    revalidatePath("/admin");
    revalidatePath(`/admin/valentes/${valenteId}`);
    
    return { 
      success: true, 
      newTotalXp: result.valente.totalXP,
      newRelics: result.newlyUnlockedRelics // ⚔️ Now the frontend gets the full icon, name, etc!
    };

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

export async function createMission(data: {
  title: string;
  description: string;
  xpReward: number;
  type: string;
  rewardAttribute?: string | null;
  rewardAttribute2?: string | null; 
  rewardAttrValue?: number;
}) {
  try {
    const mission = await prisma.mission.create({
      data: {
        title: data.title,
        description: data.description,
        xpReward: data.xpReward,
        type: data.type,
        rewardAttribute: data.rewardAttribute,
        rewardAttribute2: data.rewardAttribute2,
        rewardAttrValue: data.rewardAttrValue || 0,
      },
    });

    revalidatePath("/admin/missoes");
    return { success: true, id: mission.id };
  } catch (error) {
    console.error("Failed to create mission:", error);
    return { success: false };
  }
}

export async function updateMission(id: string, data: { 
  title: string; 
  description: string; 
  xpReward: number; 
  type: string;
  rewardAttribute?: string | null;
  rewardAttribute2?: string | null; 
  rewardAttrValue?: number;
}) {
  try {
    await prisma.mission.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        xpReward: data.xpReward,
        type: data.type,
        rewardAttribute: data.rewardAttribute,
        rewardAttribute2: data.rewardAttribute2,
        rewardAttrValue: data.rewardAttrValue || 0,
      },
    });
    revalidatePath("/admin/missoes");
    return { success: true };
  } catch (error) {
    console.error("Failed to update mission:", error);
    return { success: false };
  }
}