import { NavLink } from 'react-router-dom';
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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: '36px', height: '36px',
                borderRadius: '8px',
                background: 'var(--dark-600)',
              }}
            >
              <HiBugAnt style={{ width: '20px', height: '20px', color: 'var(--accent)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--dark-100)', letterSpacing: '-0.01em' }}>
                BugFlow
              </h1>
              <p style={{ fontSize: '10px', color: 'var(--dark-400)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>
                Issue Tracker
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto" style={{ padding: '16px 12px' }}>
          <p style={{
            fontSize: '10px', fontWeight: 600, color: 'var(--dark-350)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: '8px 12px', marginBottom: '4px',
          }}>
            Navigation
          </p>
          <div className="flex-col gap-1" style={{ display: 'flex' }}>
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className="flex items-center gap-3 transition-colors"
                style={({ isActive }) => ({
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: isActive ? 'var(--accent)' : 'var(--dark-300)',
                  background: isActive ? 'var(--accent-hover)' : 'transparent',
                  textDecoration: 'none',
                })}
              >
                {({ isActive }) => (
                  <>
                    <item.icon style={{
                      width: '18px', height: '18px',
                      color: isActive ? 'var(--accent)' : 'var(--dark-500)',
                    }} />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User section */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3" style={{ padding: '4px' }}>
            <div
              className="avatar shrink-0"
              style={{
                width: '32px', height: '32px',
                borderRadius: '8px',
                fontSize: '12px',
                border: '1px solid var(--border)',
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--dark-200)' }}>
                {user?.name}
              </p>
              <p className="truncate" style={{ fontSize: '11px', color: 'var(--dark-400)' }}>
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="btn-ghost shrink-0"
              title="Logout"
            >
              <HiOutlineLogout style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
