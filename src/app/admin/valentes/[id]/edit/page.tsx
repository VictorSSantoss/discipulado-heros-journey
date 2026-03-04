import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ValenteForm from "@/components/ValenteForm";

/**
 * EditValentePage Component
 * Serves as the administrative bridge for modifying existing hero data.
 * Coordinates database retrieval before handing off to the ValenteForm.
 */
export default async function EditValentePage({ params }: { params: Promise<{ id: string }> }) {
  /* DATA EXTRACTION */
  /* Unwraps the route parameters to identify the specific hero in the database. */
  const { id } = await params;

  /* DATA RETRIEVAL LOGIC */
  /* Fetches hero data, attributes, love languages, and holy power from the registry. */
  const valente = await prisma.valente.findUnique({
    where: { id },
    include: { 
      attributes: true,
      loveLanguages: true,
      holyPower: true
    }
  });

  /* ERROR BOUNDARY */
  /* Redirects to a 404 state if the hero dossier is not located in the registry. */
  if (!valente) return notFound();

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto text-white font-barlow">
      {/* COMPONENT: VALENTE_DATA_FORGE */}
      {/* Passes the serialized dossier to the client form for attribute recalibration. */}
      <ValenteForm mode="edit" initialData={JSON.parse(JSON.stringify(valente))} />
    </main>
  );
}