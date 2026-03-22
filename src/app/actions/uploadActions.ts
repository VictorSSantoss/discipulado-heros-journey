"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Core utility to save files locally in the Next.js public folder.
 */
async function saveFileLocally(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Sanitize file name and add a timestamp to prevent cache collisions
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${Date.now()}-${safeName}`;
  
  const uploadDir = join(process.cwd(), "public", "uploads", folder);

  // Ensure the directory exists
  await mkdir(uploadDir, { recursive: true });

  const filePath = join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  // Return the public URL path
  return `/uploads/${folder}/${fileName}`;
}

/**
 * Uploads and sets a new icon for a Patente (Rank).
 */
export async function uploadRankIcon(patenteId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    if (!file) return { success: false, message: "Nenhum arquivo enviado." };

    const fileUrl = await saveFileLocally(file, "ranks");

    const updatedPatente = await prisma.patente.update({
      where: { id: patenteId },
      data: { iconUrl: fileUrl },
    });

    revalidatePath("/admin/valentes");
    revalidatePath("/admin/sistema/patentes"); // Assuming you have a rank config page

    return { success: true, url: updatedPatente.iconUrl };
  } catch (error) {
    console.error("Erro ao fazer upload do ícone de patente:", error);
    return { success: false, message: "Erro interno ao salvar arquivo." };
  }
}

/**
 * Uploads and sets a new avatar for a Valente.
 */
export async function uploadValenteAvatar(valenteId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    if (!file) return { success: false, message: "Nenhum arquivo enviado." };

    const fileUrl = await saveFileLocally(file, "avatars");

    const updatedValente = await prisma.valente.update({
      where: { id: valenteId },
      data: { image: fileUrl },
    });

    revalidatePath(`/admin/valentes/${valenteId}`);
    revalidatePath("/admin/valentes");

    return { success: true, url: updatedValente.image };
  } catch (error) {
    console.error("Erro ao fazer upload do avatar do valente:", error);
    return { success: false, message: "Erro interno ao salvar arquivo." };
  }
}