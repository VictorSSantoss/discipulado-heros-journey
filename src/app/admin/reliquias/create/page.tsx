import { getAllMissions } from "@/app/actions/missionActions";
import RelicCreateView from "../RelicCreateView";

export default async function CreateReliquiaPage() {
  const missions = await getAllMissions();
  
  return <RelicCreateView missions={missions} />;
}