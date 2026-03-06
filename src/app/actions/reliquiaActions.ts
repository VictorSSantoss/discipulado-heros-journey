// src/app/actions/reliquiaActions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Retrieves the complete catalog of Relíquias from the Forge.
 */
export async function getAllReliquias() {
  try {
    return await prisma.reliquia.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch Relíquias catalog:", error);
    return [];
  }
}

/**
 * Forges a new Relíquia with dynamic JSON rules.
 */
export async function createReliquia(data: {
  name: string;
  description: string;
  icon: string;
  rarity: string;
  triggerType: string;
  ruleParams: any; // This is the magic JSON box!
}) {
  try {
    await prisma.reliquia.create({
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        rarity: data.rarity,
        triggerType: data.triggerType,
        ruleParams: data.ruleParams, 
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
 * Destroys a Relíquia from existence.
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