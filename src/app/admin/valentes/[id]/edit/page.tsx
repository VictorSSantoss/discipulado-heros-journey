"use client";

import { use } from "react";
import { mockValentes } from "@/lib/mockData";
import { notFound } from "next/navigation";
import ValenteForm from "@/components/ValenteForm";

/**
 * EditValentePage Component
 * Serves as the administrative bridge for modifying existing hero data.
 * Coordinates data retrieval before handing off to the unified ValenteForm.
 */
export default function EditValentePage({ params }: { params: Promise<{ id: string }> }) {
  /* DATA EXTRACTION */
  /* Unwraps the route parameters to identify the specific hero in the database. */
  const { id } = use(params);
  
  /* DATA RETRIEVAL LOGIC */
  const valenteData = mockValentes.find((v) => v.id === id);

  /* ERROR BOUNDARY */
  /* Redirects to a 404 state if the hero dossier is not found. */
  if (!valenteData) notFound();

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto text-white font-barlow">
      {/* CONTAINER 1: EDIT_VALENTE_MASTER_WRAPPER */}
      {/* Establishes the layout boundaries and base typography for the modification interface. */}

      <ValenteForm mode="edit" initialData={valenteData} />
      {/* COMPONENT: VALENTE_DATA_FORGE */}
      {/* The core interface where hero stats and structure are recalculated. */}
      
    </main>
  );
}