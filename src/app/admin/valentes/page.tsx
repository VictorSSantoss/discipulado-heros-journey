import prisma from "@/lib/prisma";
import ValentesClientView from "./ValentesClientView";

export default async function ValentesPage() {
  // 1. Fetch live data from your Neon database!
  const valentes = await prisma.valente.findMany({
    include: {
      attributes: true,
      holyPower: true,
      loveLanguages: true,
    },
    orderBy: {
      name: 'asc' // Sorts the squad alphabetically
    }
  });

  // 2. Pass the data to your beautiful Client Component
  return <ValentesClientView initialValentes={valentes} />;
}