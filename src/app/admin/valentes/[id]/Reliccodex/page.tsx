import prisma from "@/lib/prisma";
import { getAllReliquias } from "@/app/actions/reliquiaActions";
import ReliquiaClient from "@/app/admin/reliquias/RelicClient";

export default async function PlayerCodexPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const currentValenteId = resolvedParams.id;

  // Retrieves the valente's current data including their XP and existing relics
  const valente = await prisma.valente.findUnique({
    where: { id: currentValenteId },
    include: { reliquias: true }
  });

  if (!valente) {
    return <div className="p-8 text-white font-barlow">Herói não encontrado nas crônicas.</div>;
  }

  const rawCatalog = await getAllReliquias();
  const safeCatalog = JSON.parse(JSON.stringify(rawCatalog));

  // Auto-Sync Logic: Evaluates current XP against the catalog to retroactively award missing relics
  const earnedIds = new Set(valente.reliquias.map(r => r.reliquiaId));
  const missingRelicsToAward = [];

  for (const relic of safeCatalog) {
    if (!earnedIds.has(relic.id)) {
      const rules = relic.ruleParams;
      if (Array.isArray(rules)) {
        const meetsRequirement = rules.some((route: any) => {
          if (route.type === "XP") return valente.totalXP >= Number(route.value);
          return false;
        });

        if (meetsRequirement) {
          missingRelicsToAward.push({ 
            valenteId: valente.id, 
            reliquiaId: relic.id 
          });
          earnedIds.add(relic.id);
        }
      }
    }
  }

  // Commits newly discovered retroactive relics to the database
  if (missingRelicsToAward.length > 0) {
    await prisma.valenteReliquia.createMany({
      data: missingRelicsToAward,
      skipDuplicates: true
    });
  }

  const unlockedIds = Array.from(earnedIds);

  return (
    <main className="min-h-screen bg-dark-bg p-8">
      <header className="mb-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="hud-title-lg text-5xl text-white uppercase tracking-tighter">
            Codex de Relíquias
          </h1>
          <p className="hud-label-tactical text-brand mt-2 tracking-[0.3em]">
            ACERVO DE HONRARIAS DO REINO
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex flex-col items-end">
          <span className="hud-label-tactical text-[10px] text-gray-500 uppercase mb-1">Total Descoberto</span>
          <span className="hud-value text-2xl text-white">
            {unlockedIds.length} <span className="text-gray-600 text-sm">/ {safeCatalog.length}</span>
          </span>
        </div>
      </header>

      <ReliquiaClient 
        initialCatalog={safeCatalog} 
        unlockedIds={unlockedIds}
        permissions={{ 
          canForge: false, 
          canEdit: false   
        }} 
      />
    </main>
  );
}