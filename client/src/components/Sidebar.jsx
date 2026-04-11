import { NavLink, useLocation } from 'react-router-dom';
import { HiOutlineViewBoards, HiOutlineFolder, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi';
import { HiBugAnt } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Overview', icon: HiOutlineViewBoards },
  { to: '/projects', label: 'Projects', icon: HiOutlineFolder },
  { to: '/settings', label: 'Settings', icon: HiOutlineCog },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#000000]/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-50
        w-64 bg-[#05183c] border-r border-[#2b4680]/30
        flex flex-col
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-[#2b4680]/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#304b52] flex items-center justify-center">
              <HiBugAnt className="w-5 h-5 text-[#afcbd4]" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-[#dee5ff] tracking-tight">Obsidian</h1>
              <p className="text-[10px] text-[#909fb6] uppercase tracking-widest font-medium">Ledger</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 py-2 text-[10px] font-semibold text-[#4e5c71] uppercase tracking-widest mb-1">Menu</p>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded text-sm font-medium
                transition-all duration-200 group
                ${isActive
                  ? 'bg-[#031d4b] text-[#afcbd4]'
                  : 'text-[#909fb6] hover:bg-[#06122d] hover:text-[#dee5ff]'
                }
              `}
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#afcbd4]' : 'text-[#4e5c71] group-hover:text-[#909fb6]'}`} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-[#2b4680]/20">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded bg-[#031d4b] flex items-center justify-center text-xs font-semibold text-[#afcbd4] border border-[#2b4680]/50">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#dee5ff] truncate">{user?.name}</p>
              <p className="text-xs text-[#909fb6] truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded text-[#4e5c71] hover:text-[#ee7d77] hover:bg-[#06122d] transition-colors"
              title="Logout"
            >
              <HiOutlineLogout className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
