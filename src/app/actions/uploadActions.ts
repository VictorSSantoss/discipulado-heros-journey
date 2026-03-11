"use server";

import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function uploadValenteImage(valenteId: string, formData: FormData) {
  try {
    const imageFile = formData.get("image") as File;
    if (!imageFile) throw new Error("No image file provided.");

    // Added addRandomSuffix to prevent blob collision errors
    const blob = await put(imageFile.name, imageFile, {
      access: "public",
      addRandomSuffix: true, 
    });

    await prisma.valente.update({
      where: { id: valenteId },
      data: { image: blob.url }
    });

    revalidatePath(`/admin/valentes/${valenteId}`, 'layout');
    revalidatePath("/admin/valentes");

    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false };
  }
}

export async function uploadRelicIcon(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const blob = await put(`relics/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Relic upload failed:", error);
    return { success: false, url: "" };
  }
}