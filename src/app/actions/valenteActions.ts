"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GET_XP_MULTIPLIER, STRUCTURE_BONUS } from "@/constants/gameConfig";

const PLACEHOLDERS = [
  "/images/man-silhouette.svg",
  "/images/man-silhouette-2.svg" 
];

// -----------------------------------------------------------------------------
// STREAK ENGINE & HOLY POWER LOGIC
// -----------------------------------------------------------------------------

/**
 * Handles the increment of habit progress.
 * Manages daily streak locks and checks for the "Spiritual Trifecta" bonus.
 */
export async function logHolyPower(valenteId: string, habitName: string, amount: number) {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const updatedData = await prisma.$transaction(async (tx) => {
      // 1. Fetch the specific habit
      const habit = await tx.holyPower.findFirst({
        where: { valenteId, name: habitName }
      });

      if (!habit) throw new Error("Hábito não encontrado.");

      const lastUpdateStr = habit.lastStreakUpdate 
        ? new Date(habit.lastStreakUpdate).toISOString().split('T')[0] 
        : null;

      const newCurrent = habit.current + amount;
      let newStreak = habit.streak;
      let newLastStreakUpdate = habit.lastStreakUpdate;

      // 2. Increment streak only if goal is reached and no update happened today
      if (newCurrent >= habit.goal && lastUpdateStr !== todayStr) {
        newStreak += 1;
        newLastStreakUpdate = now;
      }

      // 3. Update the specific habit
      const updatedHabit = await tx.holyPower.update({
        where: { id: habit.id },
        data: { 
          current: newCurrent, 
          streak: newStreak, 
          lastStreakUpdate: newLastStreakUpdate 
        }
      });

      // 4. Check for automated Streak Missions
      if (newStreak > habit.streak) {
        await checkStreakMissions(valenteId, habitName, newStreak, tx);
      }

      // 5. Check for "Spiritual Trifecta" (All active habits completed)
      let trifectaTriggered = false;
      
      // Only check if we just hit the goal (prevent spamming the bonus on overcharges)
      if (newCurrent >= habit.goal && habit.current < habit.goal) {
        const allHabits = await tx.holyPower.findMany({ where: { valenteId } });
        const allCompleted = allHabits.every(h => 
          (h.id === updatedHabit.id ? updatedHabit.current : h.current) >= h.goal
        );

        if (allHabits.length > 0 && allCompleted) {
          trifectaTriggered = true;
          const trifectaBonus = 100; // Flat XP bonus for completing the daily trifecta
          
          await tx.valente.update({
            where: { id: valenteId },
            data: {
              totalXP: { increment: trifectaBonus },
              xpLogs: { create: { amount: trifectaBonus, reason: "Sinergia Divina: Disciplina Completa" } }
            }
          });
        }
      }

      return { updatedHabit, trifectaTriggered };
    });

    revalidatePath(`/admin/valentes/${valenteId}`);
    return { 
      success: true, 
      current: updatedData.updatedHabit.current, 
      streak: updatedData.updatedHabit.streak,
      trifectaTriggered: updatedData.trifectaTriggered 
    };
  } catch (error) {
    console.error("Holy Power Log Error:", error);
    return { success: false };
  }
}

/**
 * Internal logic to evaluate missions triggered by specific habit streaks.
 */
async function checkStreakMissions(valenteId: string, habitName: string, currentStreak: number, tx: any) {
  const missions = await tx.mission.findMany({
    where: { 
      triggerType: "HABIT_STREAK", 
      targetHabit: habitName,
      targetValue: { lte: currentStreak }
    }
  });

  for (const mission of missions) {
    const completion = await tx.valenteMission.findUnique({
      where: { valenteId_missionId: { valenteId, missionId: mission.id } }
    });

    if (!completion || completion.status !== "COMPLETED") {
      const multiplier = GET_XP_MULTIPLIER();
      const finalXp = Math.floor(mission.xpReward * multiplier.factor);
      
      await tx.valenteMission.upsert({
        where: { valenteId_missionId: { valenteId, missionId: mission.id } },
        update: { status: "COMPLETED", completedAt: new Date() },
        create: { valenteId, missionId: mission.id, status: "COMPLETED", completedAt: new Date() }
      });

      await tx.valente.update({
        where: { id: valenteId },
        data: {
          totalXP: { increment: finalXp },
          xpLogs: { create: { amount: finalXp, reason: `Conquista de Sequência: ${mission.title}` } }
        }
      });
    }
  }
}

/**
 * Resets daily progress based on the `isResetDaily` flag.
 * Evaluates streak breaks and applies the Guardian Angel relic if needed.
 */
export async function validateStreakContinuity(valenteId: string) {
  try {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    await prisma.$transaction(async (tx) => {
      const valente = await tx.valente.findUnique({
        where: { id: valenteId },
        include: { holyPower: true, reliquias: { include: { reliquia: true } } }
      });

      if (!valente) return;

      for (const habit of valente.holyPower) {
        const lastUpdateStr = habit.lastStreakUpdate 
          ? new Date(habit.lastStreakUpdate).toISOString().split('T')[0] 
          : null;

        // Reset logic now respects the isResetDaily flag
        if (habit.isResetDaily) {
          await tx.holyPower.update({
            where: { id: habit.id },
            data: { current: 0 }
          });
        }

        // Streak evaluation remains the same: if you didn't check in yesterday, you lose the streak.
        if (lastUpdateStr !== yesterdayStr && habit.streak > 0) {
          const protectionRelic = valente.reliquias.find(r => r.reliquiaId === "reliquia-anjo-guarda");

          if (protectionRelic) {
            // Preservation via Guardian Angel
            await tx.valenteReliquia.delete({ 
              where: { 
                valenteId_reliquiaId: { 
                  valenteId: valente.id, 
                  reliquiaId: "reliquia-anjo-guarda" 
                } 
              } 
            });
            await tx.xpLog.create({
              data: { valenteId, amount: 0, reason: `Anjo da Guarda protegeu a sequência de ${habit.name}` }
            });
          } else {
            // Streak reset
            await tx.holyPower.update({
              where: { id: habit.id },
              data: { streak: 0 }
            });
          }
        }
      }
    });

    revalidatePath(`/admin/valentes/${valenteId}`);
    return { success: true };
  } catch (error) {
    console.error("Streak Validation Error:", error);
    return { success: false };
  }
}

// -----------------------------------------------------------------------------
// CORE VALENTE OPERATIONS
// -----------------------------------------------------------------------------

// Handles mission completion, XP distribution, attribute increments, and evaluates MULTI_ROUTE relic unlocks
export async function completeMission(valenteId: string, missionId: string) {
  try {
    const mission = await prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) throw new Error("Missão não encontrada.");

    const currentValente = await prisma.valente.findUnique({
      where: { id: valenteId },
      include: { reliquias: true }
    });

    if (!currentValente) throw new Error("Valente não encontrado.");

    const multiplier = GET_XP_MULTIPLIER();
    const finalXp = Math.floor(mission.xpReward * multiplier.factor);
    const newTotalXP = currentValente.totalXP + finalXp;

    const earnedRelicIds = new Set(currentValente.reliquias.map(r => r.reliquiaId));
    const allRelics = await prisma.reliquia.findMany();

    const newlyEarned = allRelics.filter(relic => {
      if (earnedRelicIds.has(relic.id)) return false;

      const rules = typeof relic.ruleParams === 'string' 
        ? JSON.parse(relic.ruleParams) 
        : relic.ruleParams;

      let meetsRequirement = false;

      // Robust check: handles both the NEW Array format and the OLD Object format
      if (Array.isArray(rules)) {
        meetsRequirement = rules.some((route: any) => {
          if (route.type === "XP") return newTotalXP >= Number(route.value);
          if (route.type === "MISSION") return route.value === missionId;
          return false;
        });
      } else if (rules && typeof rules === 'object') {
        if (relic.triggerType === "XP_MILESTONE" && rules.target) {
          meetsRequirement = newTotalXP >= Number(rules.target);
        }
      }

      return meetsRequirement;
    });

    const updatedValente = await prisma.$transaction(async (tx) => {
      await tx.valenteMission.upsert({
        where: { valenteId_missionId: { valenteId, missionId } },
        update: { status: "COMPLETED", completedAt: new Date() },
        create: { valenteId, missionId, status: "COMPLETED", completedAt: new Date() }
      });

      const attributeUpdate = mission.rewardAttribute 
        ? { [mission.rewardAttribute]: { increment: mission.rewardAttrValue } }
        : {};

      return await tx.valente.update({
        where: { id: valenteId },
        data: {
          totalXP: { increment: finalXp },
          xpLogs: { create: { amount: finalXp, reason: `Missão: ${mission.title}` } },
          attributes: { update: attributeUpdate },
          reliquias: {
            create: newlyEarned.map(r => ({
              reliquia: { connect: { id: r.id } }
            }))
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
      newTotalXp: updatedValente.totalXP,
      newRelics: newlyEarned
    };
  } catch (error) {
    console.error("Critical Failure in Mission Completion:", error);
    return { success: false, message: "Erro ao processar recompensas." };
  }
}

// Processes direct XP additions and evaluates MULTI_ROUTE relic unlocks
export async function updateValenteXp(valenteId: string, baseAmount: number, customReason?: string) {
  try {
    const multiplier = GET_XP_MULTIPLIER();
    const finalXp = Math.floor(baseAmount * multiplier.factor);

    const currentValente = await prisma.valente.findUnique({
      where: { id: valenteId },
      include: { reliquias: { include: { reliquia: true } }, holyPower: true }
    });

    if (!currentValente) throw new Error("Valente not found.");

    const newTotalXP = currentValente.totalXP + finalXp;
    const alreadyEarnedIds = new Set(currentValente.reliquias.map(vr => vr.reliquiaId));
    const allReliquias = await prisma.reliquia.findMany();

    const newlyEarned = allReliquias.filter(relic => {
      if (alreadyEarnedIds.has(relic.id)) return false;
      
      const rules = typeof relic.ruleParams === 'string' ? JSON.parse(relic.ruleParams) : relic.ruleParams;
      let meetsRequirement = false;

      if (Array.isArray(rules)) {
        meetsRequirement = rules.some((route: any) => {
          if (route.type === "XP") return newTotalXP >= Number(route.value);
          return false;
        });
      } else if (rules && typeof rules === 'object') {
        if (relic.triggerType === "XP_MILESTONE" && rules.target) {
          meetsRequirement = newTotalXP >= Number(rules.target);
        }
      }

      return meetsRequirement;
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

// Retrieves the top 5 players globally and includes the managing user's Guilda Name and Icon
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
        managedBy: {
          select: {
            guildaName: true,
            guildaIcon: true
          }
        }
      },
    });
  } catch (error) {
    console.error("Rank retrieval failure:", error);
    return [];
  }
}

// Calculates the precise leaderboard position of a specific player based on their total XP
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

// Commits changes made to a Valente's attributes, languages, and habits from the profile edit form
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
              // Uses ?? to prevent overwriting existing properties with undefined if not passed
              data: { 
                current: power.current ?? existingPower.current, 
                goal: power.goal ?? existingPower.goal, 
                streak: power.streak ?? existingPower.streak,
                isResetDaily: power.isResetDaily ?? existingPower.isResetDaily
              }
            });
          } else {
            await tx.holyPower.create({
              data: { 
                valenteId, 
                name: power.name, 
                current: power.current || 0, 
                goal: power.goal || 30, 
                streak: power.streak || 0,
                isResetDaily: power.isResetDaily ?? true
              }
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

// Registers a new Valente in the database, applying structure bonuses and assigning a default avatar if none is provided
export async function createValente(data: any) {
  try {
    const defaultUser = await prisma.user.findFirst();
    if (!defaultUser) throw new Error("Nenhum Discipulador encontrado.");

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
              current: power.current || 0,
              goal: power.goal || 30,
              streak: power.streak || 0,
              isResetDaily: power.isResetDaily ?? true,
              lastStreakUpdate: null // Ensure fresh start for new valentes
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

// Removes a specific Valente from the database permanently
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

// Fetches the entire relic catalog and maps the requirement parameter for easy access
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

// Creates a direct relationship between a Valente and a Relic bypassing automated triggers
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

// Toggles a mission ID in the Valente's trackedMissionIds array (Limit 3)
export async function toggleTrackedMission(valenteId: string, missionId: string) {
  try {
    const valente = await prisma.valente.findUnique({
      where: { id: valenteId },
      select: { trackedMissionIds: true }
    });

    if (!valente) return { success: false };

    let newIds = [...valente.trackedMissionIds];
    
    if (newIds.includes(missionId)) {
      // Unpin
      newIds = newIds.filter(id => id !== missionId);
    } else {
      // Pin (Limit 3)
      if (newIds.length >= 3) return { success: false, message: "Limite de 3 decretos fixados atingido." };
      newIds.push(missionId);
    }

    await prisma.valente.update({
      where: { id: valenteId },
      data: { trackedMissionIds: newIds }
    });

    revalidatePath(`/admin/valentes/${valenteId}`);
    return { success: true, trackedIds: newIds };
  } catch (error) {
    console.error("Failed to toggle track:", error);
    return { success: false };
  }
}