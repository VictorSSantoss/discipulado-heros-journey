"use client";

import { use } from "react";
import { mockValentes } from "@/lib/mockData";
import { notFound } from "next/navigation";
import ValenteForm from "@/components/ValenteForm";

export default function EditValentePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // Find the specific hero to edit
  const valenteData = mockValentes.find((v) => v.id === id);

  if (!valenteData) notFound();

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      {/* UNIFIED FORM: 
         - Pass the existing data
         - Set mode to "edit" 
      */}
      <ValenteForm mode="edit" initialData={valenteData} />
    </main>
  );
}