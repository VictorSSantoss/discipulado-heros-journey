"use client";

import { useRouter } from "next/navigation";
import { updateReliquia, deleteReliquia } from "@/app/actions/reliquiaActions";
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
      let finalIconUrl = data.icon;

      if (data.selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", data.selectedFile);
        const uploadResult = await uploadRelicIcon(uploadData);
        if (uploadResult.success) finalIconUrl = uploadResult.url;
      }

      const result = await updateReliquia(initialData.id, {
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
      console.error("Update error:", error);
      alert("Erro ao atualizar artefato.");
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
      isEdit={true}               // ⚔️ THIS FIXES THE TITLE AND BUTTONS
      initialData={initialData} 
      missions={missions} 
      onSave={handleSave} 
      onDelete={handleDelete}     // ⚔️ THIS FIXES THE DELETE BUTTON
    />
  );
}