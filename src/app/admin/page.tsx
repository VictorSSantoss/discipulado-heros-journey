export default function AdminDashboard() {
  return (
    <main className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="font-bebas text-5xl tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          Visão Geral
        </h1>
        <p className="font-barlow text-gray-400 mt-2 uppercase tracking-widest">Resumo do Discipulado</p>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Stat Card 1 */}
        <div className="bg-[#2a2c29] border-l-4 border-[#ea580c] p-6 shadow-md rounded-sm">
          <h3 className="font-barlow font-bold text-gray-400 uppercase tracking-wider text-sm">Total de Valentes</h3>
          <p className="font-staatliches text-5xl text-white mt-2">45</p>
        </div>
        
        {/* Stat Card 2 */}
        <div className="bg-[#2a2c29] border-l-4 border-blue-500 p-6 shadow-md rounded-sm">
          <h3 className="font-barlow font-bold text-gray-400 uppercase tracking-wider text-sm">XP Distribuído (Semana)</h3>
          <p className="font-staatliches text-5xl text-blue-400 mt-2">12.500</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-[#2a2c29] border-l-4 border-yellow-500 p-6 shadow-md rounded-sm">
          <h3 className="font-barlow font-bold text-gray-400 uppercase tracking-wider text-sm">Missões Ativas</h3>
          <p className="font-staatliches text-5xl text-yellow-400 mt-2">26</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <section>
        <h2 className="font-staatliches text-3xl tracking-widest text-white uppercase mb-6 border-b border-gray-700 pb-2">
          Atividade Recente
        </h2>
        <div className="bg-[#232622] rounded-sm p-4 space-y-4">
          <div className="flex justify-between items-center p-3 bg-[#2a2c29] rounded-sm border border-gray-700">
            <span className="font-barlow text-gray-300"><strong>Cadu</strong> completou <span className="text-[#ea580c]">Ler Neemias</span></span>
            <span className="font-bebas text-xl text-blue-400">+300 XP</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#2a2c29] rounded-sm border border-gray-700">
            <span className="font-barlow text-gray-300"><strong>Nathan</strong> completou <span className="text-[#ea580c]">Participar da Sala de Oração</span></span>
            <span className="font-bebas text-xl text-blue-400">+200 XP</span>
          </div>
        </div>
      </section>
    </main>
  );
}