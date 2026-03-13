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
      let finalIconUrl = data.icon;

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

      const result = await createReliquia({
        name: data.name,
        description: data.description,
        icon: finalIconUrl,
        rarity: data.rarity,
        alternatives: data.alternatives
      });

      if (result.success) {
        router.push("/admin/reliquias");
        router.refresh();
      }
    } catch (error) {
      console.error("Forge error:", error);
      alert("Erro ao salvar.");
    }
  };

  return <RelicForm missions={missions} onSave={handleSave} />;
}