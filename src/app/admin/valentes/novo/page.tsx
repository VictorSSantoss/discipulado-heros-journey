import ValenteForm from "@/components/ValenteForm";

export default function NovoValentePage() {
  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      {/* Reuse the same form component.
         By passing mode="create", the form automatically handles 
         the "Recrutar" titles and empty starting values.
      */}
      <ValenteForm mode="create" />
    </main>
  );
}