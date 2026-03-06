"use server";

import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function uploadValenteImage(valenteId: string, formData: FormData) {
  try {
    const imageFile = formData.get("image") as File;
    if (!imageFile) throw new Error("No image file provided.");

    const blob = await put(imageFile.name, imageFile, {
      access: "public",
    });

    await prisma.valente.update({
      where: { id: valenteId },
      data: { image: blob.url }
    });

    // This 'layout' string is the key to clearing the /edit page cache
    revalidatePath(`/admin/valentes/${valenteId}`, 'layout');
    revalidatePath("/admin/valentes");

    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false };
  }
}