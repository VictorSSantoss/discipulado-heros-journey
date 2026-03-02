"use client";

import ValenteForm from "@/components/ValenteForm";

/**
 * NovoValentePage Component
 * Entry point for recruiting new heroes into the kingdom's roster.
 * Leverages the unified ValenteForm in "create" mode for standardized data entry.
 */
export default function NovoValentePage() {
  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto text-white font-barlow">
      {/* CONTAINER 1: RECRUITMENT_MASTER_WRAPPER */}
      {/* Centralizes the form layout and provides the necessary viewport constraints. */}

      <ValenteForm mode="create" />
      
      {/* COMPONENT: VALENTE_REGISTRATION_FORGE */}
      {/* In "create" mode, this component initializes with empty tactical fields 
          and specialized recruitment-themed headers. */}
    </main>
  );
}