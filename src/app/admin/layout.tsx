import Sidebar from '@/components/Sidebar';

/**
 * AdminLayout Component
 * Serves as the primary structural skeleton for the administrative dashboard.
 * Manages the persistent Sidebar and the dynamic content viewport.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-dark-bg">
      {/* COMPONENT: TACTICAL_SIDEBAR_NAVIGATION */}
      <Sidebar />
      
      {/* CONTAINER: DYNAMIC_CONTENT_VIEWPORT 
          - lg:pl-64: Adds padding only on large screens to make room for the fixed sidebar.
          - pt-20 lg:pt-0: Adds top padding on mobile so content doesn't sit under the floating hamburger button.
      */}
      <div className="flex-1 w-full lg:pl-64 pt-20 lg:pt-0 transition-all duration-300">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}