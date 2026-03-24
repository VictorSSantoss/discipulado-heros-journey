"use client";

import { useRouter } from "next/navigation";
import { updateReliquia, deleteReliquia, createReliquia } from "@/app/actions/reliquiaActions";
import { uploadRelicIcon } from "@/app/actions/uploadActions";
import RelicForm from "@/components/RelicForm";

interface RelicEditClientProps {
  initialData: any;
  missions: any[];
}

export default function RelicEditClient({ initialData, missions }: RelicEditClientProps) {
  const router = useRouter();

  const handleSave = async (data: any) => {
    try {
      // Create the record first to get the ID
      const result = await createReliquia({
        name: data.name,
        description: data.description,
        icon: data.icon || "", 
        rarity: data.rarity,
        alternatives: data.alternatives
      });

      if (!result.success || !result.relic) {
        throw new Error("Erro ao criar a relíquia.");
      }

      // Now perform the upload using the new ID
      if (data.selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", data.selectedFile);
        
        // PASSING BOTH ARGUMENTS HERE
        const uploadResult = await uploadRelicIcon(initialData.id, uploadData);
        
        if (!uploadResult.success) {
          console.error("Upload failed, but relic was created.");
        }
      }

      router.push("/admin/reliquias");
      router.refresh();
    } catch (error) {
      console.error("Forge error:", error);
      alert("Erro ao salvar.");
    }
  };

  // ⚔️ Added the Delete Logic
  const handleDelete = async () => {
    if (confirm(`Tem certeza que deseja destruir "${initialData.name}"?`)) {
      const result = await deleteReliquia(initialData.id);
      if (result.success) {
        router.push("/admin/reliquias");
        router.refresh();
      }
    }
  };

  return (
    <RelicForm 
      isEdit={true}
      initialData={initialData} 
      missions={missions} 
      onSave={handleSave} 
      onDelete={handleDelete}
    />
  );
}