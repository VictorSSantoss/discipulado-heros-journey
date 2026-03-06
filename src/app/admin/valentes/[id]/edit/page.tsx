import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ValenteForm from "@/components/ValenteForm";

export default async function EditValentePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const valente = await prisma.valente.findUnique({
    where: { id },
    include: { 
      attributes: true,
      loveLanguages: true,
      holyPower: true
    }
  });

  if (!valente) return notFound();

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto text-white font-barlow">
      <ValenteForm mode="edit" initialData={JSON.parse(JSON.stringify(valente))} />
    </main>
  );
}