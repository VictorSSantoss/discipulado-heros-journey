import prisma from "@/lib/prisma";
import { getAllReliquias } from "@/app/actions/valenteActions";
import ReliquiaClient from "@/app/admin/reliquias/RelicClient";

export default async function PlayerCodexPage() {
  // Retrieves the complete catalog of relics from the database
  const rawCatalog = await getAllReliquias();
  
  // Sanitizes the database objects for use in a Client Component
  const safeCatalog = JSON.parse(JSON.stringify(rawCatalog));

  // Retrieves the ID of the currently authenticated Valente
  // Replace "REPLACE_WITH_ACTUAL_VALENTE_ID" with your authentication session variable
  const currentValenteId = "REPLACE_WITH_ACTUAL_VALENTE_ID";

  // Counts the amount of relics the specific Valente has unlocked in the join table
  const unlockedCount = await prisma.valenteReliquia.count({
    where: {
      valenteId: currentValenteId
    }
  });

  return (
    <main className="min-h-screen bg-dark-bg p-8">
      
      {/* Container holding the original title and the new progression indicator */}
      <header className="mb-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="hud-title-lg text-5xl text-white uppercase tracking-tighter">
            Codex de Relíquias
          </h1>
          <p className="hud-label-tactical text-brand mt-2 tracking-[0.3em]">
            ACERVO DE HONRARIAS DO REINO
          </p>
        </div>

        {/* Displays the ratio of unlocked relics versus the total catalog size */}
        <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex flex-col items-end">
          <span className="hud-label-tactical text-[10px] text-gray-500 uppercase mb-1">Total Descoberto</span>
          <span className="hud-value text-2xl text-white">
            {unlockedCount} <span className="text-gray-600 text-sm">/ {safeCatalog.length}</span>
          </span>
        </div>
      </header>

      {/* Renders the catalog grid with administrative actions disabled */}
      <ReliquiaClient 
        initialCatalog={safeCatalog} 
        permissions={{ 
          canForge: false, 
          canEdit: false   
        }} 
      />
    </main>
  );
}