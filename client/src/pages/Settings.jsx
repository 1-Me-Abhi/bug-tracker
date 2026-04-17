import { useAuth } from '../context/AuthContext';
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck } from 'react-icons/hi';

const Settings = () => {
  const { user } = useAuth();

  const infoRow = (icon, label, value) => (
    <div
      className="flex items-center gap-3"
      style={{
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '8px',
        border: '1px solid var(--border-light)',
      }}
    >
      <div style={{ color: 'var(--dark-500)' }}>{icon}</div>
      <div>
        <p style={{ fontSize: '11px', color: 'var(--dark-400)', marginBottom: '2px' }}>{label}</p>
        <p style={{ fontSize: '14px', color: 'var(--dark-200)', fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto' }}>
      <div className="card">
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--dark-300)', marginBottom: '20px' }}>Profile</h2>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4" style={{ marginBottom: '24px' }}>
          <div className="avatar avatar-lg">
            {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--dark-200)' }}>{user?.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--dark-400)', marginTop: '2px' }}>{user?.email}</p>
          </div>
        </div>

        {/* Info rows */}
        <div className="flex-col" style={{ display: 'flex', gap: '8px' }}>
          {infoRow(
            <HiOutlineUser style={{ width: '18px', height: '18px' }} />,
            'Full Name',
            user?.name
          )}
          {infoRow(
            <HiOutlineMail style={{ width: '18px', height: '18px' }} />,
            'Email',
            user?.email
          )}
          {infoRow(
            <HiOutlineShieldCheck style={{ width: '18px', height: '18px' }} />,
            'Role',
            <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
