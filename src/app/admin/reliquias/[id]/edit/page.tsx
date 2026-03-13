import { getReliquiaById } from "@/app/actions/reliquiaActions";
import { getAllMissions } from "@/app/actions/missionActions";
import { notFound } from "next/navigation";
import ReliquiaEditClient from "./RelicEditClient";

export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;

export default async function EditReliquiaPage(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  // Parallel fetch for better performance
  const [relic, missions] = await Promise.all([
    getReliquiaById(id),
    getAllMissions()
  ]);

  if (!relic) {
    notFound();
  }

  return (
    <ReliquiaEditClient 
      initialData={JSON.parse(JSON.stringify(relic))} 
      missions={missions} 
    />
  );
}