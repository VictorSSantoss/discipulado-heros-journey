"use client";

import { useRouter } from "next/navigation";
import { createReliquia } from "@/app/actions/reliquiaActions";
import { uploadRelicIcon } from "@/app/actions/uploadActions";
import RelicForm from "@/components/RelicForm"; // ⚔️ Ensure this import matches your path

export default function RelicCreateView({ missions }: { missions: any[] }) {
  const router = useRouter();

  const handleSave = async (data: any) => {
    try {
      let finalIconUrl = data.icon;

      // 1. Upload the file to Vercel Blob if a new one was selected
      if (data.selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", data.selectedFile);
        const uploadResult = await uploadRelicIcon(uploadData);
        if (uploadResult.success) {
          finalIconUrl = uploadResult.url;
        } else {
          throw new Error("Upload failed");
        }
      }

      // 2. Call the Server Action to save to Database
      const result = await createReliquia({
        name: data.name,
        description: data.description,
        icon: finalIconUrl,
        rarity: data.rarity,
        alternatives: data.alternatives
      });

      if (result.success) {
        alert("Relíquia forjada com sucesso!");
        router.push("/admin/reliquias");
        router.refresh();
      }
    } catch (error) {
      console.error("Forge error:", error);
      alert("Erro ao forjar relíquia.");
    }
  };

  return <RelicForm missions={missions} onSave={handleSave} />;
}