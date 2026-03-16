import prisma from "@/lib/prisma";
import MissionForm from "@/components/admin/MissionForm";
import { notFound } from "next/navigation";

export default async function EditMissionPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // We MUST await params before accessing the id
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const mission = await prisma.mission.findUnique({ 
    where: { id: id } 
  });

  if (!mission) {
    return notFound();
  }

  // Pass the mission data to our unified form
  return <MissionForm mission={mission} isEdit={true} />;
}