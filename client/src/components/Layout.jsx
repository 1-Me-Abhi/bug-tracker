import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
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
    if (location.pathname.startsWith('/project/')) return 'Project Board';
    if (location.pathname.startsWith('/issue/')) return 'Issue Details';
    return pageTitles[location.pathname] || 'Bug Tracker';
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--dark-850)' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-col flex-1" style={{ display: 'flex', minWidth: 0, height: '100%' }}>
        {/* Top bar */}
        <header
          className="flex items-center shrink-0"
          style={{
            height: '64px',
            padding: '0 32px',
            gap: '16px',
            background: 'var(--dark-800)',
            borderBottom: '1px solid var(--border)',
            zIndex: 10,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn-ghost mobile-only"
          >
            <HiOutlineMenuAlt2 style={{ width: '20px', height: '20px' }} />
          </button>

          <h2 style={{ color: 'var(--dark-200)', fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em' }}>
            {getTitle()}
          </h2>

          <div className="flex-1" />
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ padding: '32px', background: 'var(--dark-850)' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
