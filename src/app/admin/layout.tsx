import Sidebar from '@/components/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#1a1c19]">
      {/* The Sidebar stays fixed on the left */}
      <Sidebar />
      
      {/* The main content area takes up the rest of the space. 
          Add ml-64 (margin-left) so the content doesn't hide under the fixed sidebar */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}