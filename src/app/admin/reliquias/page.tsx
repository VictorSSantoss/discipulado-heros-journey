// src/app/admin/reliquias/page.tsx
import { getAllReliquias } from "@/app/actions/reliquiaActions";
import ReliquiaClient from "./RelicClient";
import { ICONS } from "@/constants/gameConfig";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ReliquiasArchivePage() { // Renamed for clarity
  const catalog = await getAllReliquias();

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto flex flex-col pb-40 text-white font-barlow">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="hud-title-lg text-white flex items-center gap-4 m-0 uppercase text-4xl">
            <img src={ICONS.codex} className="w-12 h-12 object-contain brightness-200" alt="" /> 
            Códice de Relíquias
          </h1>
          <p className="hud-label-tactical mt-2 uppercase text-brand tracking-widest text-[11px]">
            Arquivo Central de Honrarias e Artefatos do Reino
          </p>
        </div>
      </header>

      <ReliquiaClient 
        initialCatalog={catalog} 
        permissions={{ canForge: true, canEdit: true }} 
      />
    </div>
  );
}