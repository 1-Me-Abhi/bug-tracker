const StatsCard = ({ icon: Icon, label, value }) => {
  return (
    <div
      className="card transition-all"
      style={{ padding: '24px' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p style={{
            fontSize: '11px', fontWeight: 600, color: 'var(--dark-400)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {label}
          </p>
          <p style={{
            fontSize: '32px', fontWeight: 300, color: 'var(--dark-100)',
            marginTop: '8px', lineHeight: 1,
          }}>
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className="flex items-center justify-center"
            style={{
              padding: '10px', borderRadius: '10px',
              background: 'var(--accent-hover)', color: 'var(--accent)',
            }}
          >
            <Icon style={{ width: '20px', height: '20px' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
