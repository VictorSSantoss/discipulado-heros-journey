"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function saveFileLocally(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${Date.now()}-${safeName}`;
  const uploadDir = join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  const filePath = join(uploadDir, fileName);
  await writeFile(filePath, buffer);
  return `/uploads/${folder}/${fileName}`;
}

// ACTION 1: For AvatarUploader.tsx
export async function uploadValenteAvatar(valenteId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    if (!file) return { success: false, message: "Arquivo não enviado." };
    const fileUrl = await saveFileLocally(file, "avatars");
    await prisma.valente.update({
      where: { id: valenteId },
      data: { image: fileUrl },
    });
    revalidatePath(`/admin/valentes/${valenteId}`);
    return { success: true, url: fileUrl };
  } catch (error) {
    return { success: false, message: "Erro no upload." };
  }
}

// ACTION 2: For ValenteForm.tsx (Direct export to satisfy static analysis)
export async function uploadValenteImage(valenteId: string, formData: FormData) {
  return uploadValenteAvatar(valenteId, formData);
}

// ACTION 3: For Ranks
export async function uploadRankIcon(patenteId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    if (!file) return { success: false };
    const fileUrl = await saveFileLocally(file, "ranks");
    await prisma.patente.update({
      where: { id: patenteId },
      data: { iconUrl: fileUrl },
    });
    revalidatePath("/admin/sistema/patentes");
    return { success: true, url: fileUrl };
  } catch (error) {
    return { success: false };
  }
}

// ACTION 4: For Relics
export async function uploadRelicIcon(relicId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    if (!file) return { success: false };
    const fileUrl = await saveFileLocally(file, "relics");
    await prisma.reliquia.update({
      where: { id: relicId },
      data: { icon: fileUrl }
    });
    revalidatePath("/admin/reliquias");
    return { success: true, url: fileUrl };
  } catch (error) {
    return { success: false };
  }
}