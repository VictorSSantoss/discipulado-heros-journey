import ValenteForm from "@/components/ValenteForm";

/**
 * CreateValentePage Component
 * Provides the entry point for recruiting a new Valente into the system.
 */
export default function CreateValentePage() {
  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto text-white font-barlow">
      {/* Renders the unified form in creation mode with default empty values */}
      <ValenteForm mode="create" />
    </main>
  );
}