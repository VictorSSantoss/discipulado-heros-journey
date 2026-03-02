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
    <div className="flex min-h-screen">
      {/* CONTAINER 1: ADMIN_VIEWPORT_SHELL */}
      {/* Establishes a full-height flex container for the dashboard. */}
      
      {/* COMPONENT: TACTICAL_SIDEBAR_NAVIGATION */}
      {/* Persistent vertical navigation bar for administrative access. */}
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* CONTAINER 2: DYNAMIC_CONTENT_VIEWPORT */}
        {/* The primary area for rendering administrative pages. 
            A fixed left margin prevents content from being 
            occluded by the fixed sidebar. */}
        {children}
      </div>
    </div>
  );
}