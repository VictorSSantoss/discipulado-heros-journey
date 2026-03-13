import prisma from "@/lib/prisma";
import RelicCreateClient from "./RelicCreateClient";

export default async function CreateReliquiaPage() {
  // 1. Fetch missions directly from the DB on the server
  const missions = await prisma.mission.findMany({
    orderBy: { title: 'asc' }
  });

  // 2. Sanitize data for the client
  const safeMissions = JSON.parse(JSON.stringify(missions));

  return (
    <main className="min-h-screen p-8 bg-[#050505]">
      <div className="max-w-4xl mx-auto">
        {/* The data is passed to the client component here */}
        <RelicCreateClient missions={safeMissions} />
      </div>
    </main>
  );
}