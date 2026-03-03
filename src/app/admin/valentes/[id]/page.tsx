import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ValenteProfileClient from "./ValenteProfileClient";
import MissionLog from "@/components/MissionLog";

export default async function ValenteProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const rawValente = await prisma.valente.findUnique({
    where: { id },
    include: {
      attributes: true,
      holyPower: true,
      loveLanguages: true,
      xpLogs: {
      orderBy: {
        createdAt: 'desc' // keeps the newest missions at the top
      },
      take: 10 // Limits to the last 10 entries to keep the HUD clean
    }
    }
  });

  

  if (!rawValente) return notFound();

  // This prevents React Hydration Mismatches from destroying your CSS!
  const safeValente = JSON.parse(JSON.stringify(rawValente));

  return <ValenteProfileClient initialValente={safeValente} />;
}