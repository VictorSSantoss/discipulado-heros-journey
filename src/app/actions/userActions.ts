"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Updates the public identity of the user record, including the name and the visual icon.
 * Triggers a cache revalidation for the dashboard, profile, and taverna routes.
 */
export async function updateGuildaIdentity(userId: string, guildaName: string, guildaIcon: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { 
        guildaName,
        guildaIcon
      }
    });

    revalidatePath("/admin");
    revalidatePath("/admin/valentes");
    revalidatePath("/taverna");
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar a identidade da guilda:", error);
    return { success: false };
  }
}