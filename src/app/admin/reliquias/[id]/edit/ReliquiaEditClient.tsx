"use client";

import { useRouter } from "next/navigation";
import { updateReliquia, deleteReliquia } from "@/app/actions/reliquiaActions";
import { uploadRelicIcon } from "@/app/actions/uploadActions";
import RelicForm from "@/components/RelicForm"; // ⚔️ Ensure this import matches your path

export default function ReliquiaEditClient({ initialData, missions }: any) {
  const router = useRouter();

  const handleSave = async (data: any) => {
    try {
      let finalIconUrl = data.icon;

      // 1. Only upload if a NEW file was picked during editing
      if (data.selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", data.selectedFile);
        const uploadResult = await uploadRelicIcon(uploadData);
        if (uploadResult.success) finalIconUrl = uploadResult.url;
      }

      // 2. Update the existing record
      const result = await updateReliquia(initialData.id, {
        name: data.name,
        description: data.description,
        icon: finalIconUrl,
        rarity: data.rarity,
        alternatives: data.alternatives
      });

      if (result.success) {
        alert("Relíquia recalibrada!");
        router.push("/admin/reliquias");
        router.refresh();
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Erro ao atualizar.");
    }
  };

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
      isEdit 
      initialData={initialData} 
      missions={missions} 
      onSave={handleSave} 
      onDelete={handleDelete} 
    />
  );
}