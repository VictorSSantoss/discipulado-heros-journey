"use client";

import { useRouter } from "next/navigation";
import { createReliquia } from "@/app/actions/reliquiaActions";
import { uploadRelicIcon } from "@/app/actions/uploadActions";
import RelicForm from "@/components/RelicForm";

interface RelicCreateClientProps {
  missions: any[];
}

export default function RelicCreateClient({ missions }: RelicCreateClientProps) {
  const router = useRouter();

  const handleSave = async (data: any) => {
    try {
      // 1. Create the database record first
      const result = await createReliquia({
        name: data.name,
        description: data.description,
        icon: data.icon || "", 
        rarity: data.rarity,
        alternatives: data.alternatives
      });

      if (!result.success || !result.relic) {
        throw new Error("Erro ao criar a relíquia no banco.");
      }

      // 2. Use the ID from the newly created relic for the upload
      if (data.selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", data.selectedFile);
        
        // Now passing BOTH arguments: ID and FormData
        const uploadResult = await uploadRelicIcon(result.relic.id, uploadData);
        
        if (!uploadResult.success) {
          console.error("Relic created, but image upload failed.");
        }
      }

      router.push("/admin/reliquias");
      router.refresh();
    } catch (error) {
      console.error("Forge error:", error);
      alert("Erro ao salvar.");
    }
  };

  return <RelicForm missions={missions} onSave={handleSave} />;
}