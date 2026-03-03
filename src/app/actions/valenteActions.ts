"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateValenteXp(valenteId: string, xpToAdd: number) {
  try {
    // 1. Update totalXP AND create the log entry in one go
    const updatedValente = await prisma.valente.update({
      where: { 
        id: valenteId 
      },
      data: {
        totalXP: {
          increment: xpToAdd
        },
        // ✨ This is the missing piece:
        xpLogs: {
          create: {
            amount: xpToAdd,
            reason: "Treinamento / Ajuste de Atributos", // Default reason
          }
        }
      },
      // Include the logs in the return so the frontend can see them immediately
      include: {
        xpLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    // 2. Clear the Next.js cache
    revalidatePath(`/admin/valentes/${valenteId}`);
    revalidatePath(`/admin/valentes`);

    return { 
      success: true, 
      newTotalXP: updatedValente.totalXP,
      newLogs: updatedValente.xpLogs // Return the updated list
    };
  } catch (error) {
    console.error("Failed to update XP in database:", error);
    return { success: false, error: "Database error" };
  }
}