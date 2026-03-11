// src/app/actions/reliquiaActions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * ⚔️ CATALOG RETRIEVAL
 * Fetches all Relíquias and parses their JSON rules for the UI.
 */
export async function getAllReliquias() {
  try {
    const relics = await prisma.reliquia.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Parse the JSON rules so the frontend can display quick requirements
    return relics.map(relic => {
      // Prisma usually returns JSON as an object/array natively, but we ensure safe extraction
      const rules = typeof relic.ruleParams === 'string' 
        ? JSON.parse(relic.ruleParams) 
        : relic.ruleParams;
      
      // If it's a MULTI_ROUTE, try to find an XP requirement to show on the card
      let requirement = 0;
      if (Array.isArray(rules)) {
        const xpRoute = rules.find((r: any) => r.type === "XP");
        if (xpRoute) requirement = Number(xpRoute.value);
      }

      return {
        ...relic,
        alternatives: Array.isArray(rules) ? rules : [], // Pass full routes to the frontend
        requirement // Used for the quick-view on the card
      };
    });
  } catch (error) {
    console.error("Failed to fetch Relíquias catalog:", error);
    return [];
  }
}

/**
 * ⚔️ THE FORGE: CREATE
 * Takes the form data and the dynamic alternatives array and packs them into the DB.
 */
export async function createReliquia(data: {
  name: string;
  description: string;
  icon: string;
  rarity: string;
  alternatives: Array<{ id?: number, type: string, value: string }>;
}) {
  try {
    await prisma.reliquia.create({
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        rarity: data.rarity,
        // We tag this as a MULTI_ROUTE so the engine knows how to read the JSON
        triggerType: "MULTI_ROUTE", 
        // The magic JSON box absorbs the entire array of conditions!
        ruleParams: data.alternatives, 
      }
    });

    revalidatePath("/admin/reliquias");
    return { success: true };
  } catch (error) {
    console.error("Failed to forge Relíquia:", error);
    return { success: false, error: "Database transaction failed." };
  }
}

/**
 * ⚔️ THE FORGE: UPDATE
 * Modifies an existing artifact without losing player progress (IDs stay the same).
 */
export async function updateReliquia(
  reliquiaId: string, 
  data: {
    name: string;
    description: string;
    icon: string;
    rarity: string;
    alternatives: Array<{ id?: number, type: string, value: string }>;
  }
) {
  try {
    await prisma.reliquia.update({
      where: { id: reliquiaId },
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        rarity: data.rarity,
        triggerType: "MULTI_ROUTE",
        ruleParams: data.alternatives, 
      }
    });

    revalidatePath("/admin/reliquias");
    revalidatePath(`/admin/reliquias/${reliquiaId}/edit`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update Relíquia:", error);
    return { success: false, error: "Database transaction failed." };
  }
}

/**
 * ⚔️ DESTROY ARTIFACT
 * Removes a Relíquia from existence. 
 * Note: Because of `onDelete: Cascade` in your schema, this will also safely remove it from any Valente who owns it.
 */
export async function deleteReliquia(reliquiaId: string) {
  try {
    await prisma.reliquia.delete({
      where: { id: reliquiaId },
    });

    revalidatePath("/admin/reliquias");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete Relíquia:", error);
    return { success: false };
  }
}


export async function getReliquiaById(id: string) {
  try {
    const relic = await prisma.reliquia.findUnique({
      where: { id }
    });
    
    if (!relic) return null;

    // Parse the JSON rules back into an array for the frontend
    const alternatives = typeof relic.ruleParams === 'string' 
      ? JSON.parse(relic.ruleParams) 
      : relic.ruleParams;

    return {
      ...relic,
      alternatives: Array.isArray(alternatives) ? alternatives : []
    };
  } catch (error) {
    console.error("Failed to fetch Relíquia:", error);
    return null;
  }
}