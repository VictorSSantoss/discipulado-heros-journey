// src/app/admin/reliquias/page.tsx
import { getAllReliquias } from "@/app/actions/reliquiaActions";
import ReliquiaClient from "./ReliquiaClient";
import { ICONS } from "@/constants/gameConfig";

export const dynamic = 'force-dynamic';

export default async function ReliquiasForgePage() {
  // Fetch all created Relics from the database
  const catalog = await getAllReliquias();

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto flex flex-col pb-40 text-white font-barlow">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="hud-title-lg text-white flex items-center gap-4 m-0 uppercase text-4xl">
            <img src={ICONS.codex} className="w-12 h-12 object-contain filter brightness-200" alt="" /> 
            Forja de Relíquias
          </h1>
          <p className="hud-label-tactical mt-2 uppercase text-gray-400">
            Crie, gerencie e defina as regras para as Honrarias do Reino
          </p>
        </div>
      </header>

      {/* We pass the catalog to the Client Component 
        which will handle the dynamic form and the Battlefield 1 visuals! 
      */}
      <ReliquiaClient initialCatalog={catalog} />
    </div>
  );
}