import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HiOutlineMenuAlt2, HiOutlineBell } from 'react-icons/hi';
import Sidebar from './Sidebar';

const pageTitles = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/settings': 'Settings',
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.startsWith('/project/')) return 'Project Overview';
    if (location.pathname.startsWith('/issue/')) return 'Issue Details';
    return pageTitles[location.pathname] || 'Bug Tracker';
  };

  return (
    <div className="min-h-screen bg-[#060e20] text-[#dee5ff] font-sans selection:bg-[#304b52]">
      {/* Sidebar is always fixed, lg:translate-x-0 */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area leaves margin for sidebar on lg screens */}
      <div className="flex flex-col min-h-screen transition-all lg:ml-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-[#06122d]/90 backdrop-blur-md border-b border-[#2b4680] flex items-center px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-[#909fb6] hover:text-[#afcbd4] hover:bg-[#031d4b] transition-colors lg:hidden"
          >
            <HiOutlineMenuAlt2 className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-medium text-[#dee5ff] tracking-tight">{getTitle()}</h2>

          <div className="flex-1" />

          <button className="relative p-2 rounded-md text-[#909fb6] hover:text-[#afcbd4] hover:bg-[#031d4b] transition-colors">
            <HiOutlineBell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#ee7d77] rounded-full" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
