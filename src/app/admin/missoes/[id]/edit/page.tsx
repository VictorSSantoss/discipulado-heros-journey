import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditMissionClient from "./EditMissionClient";

export default async function EditMissionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const mission = await prisma.mission.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!mission) {
    notFound();
  }

  return <EditMissionClient mission={mission} />;
}