import { HiOutlineSearch, HiX } from 'react-icons/hi';

const FilterBar = ({ filters, setFilters, members = [] }) => {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '', assignee: '', search: '', sort: '', type: '' });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="flex items-center flex-wrap" style={{ gap: '8px' }}>
      {/* Search */}
      <div className="relative" style={{ flex: '1 1 180px', maxWidth: '260px' }}>
        <HiOutlineSearch
          style={{
            position: 'absolute', left: '10px', top: '50%',
            transform: 'translateY(-50%)',
            width: '14px', height: '14px', color: 'var(--dark-500)',
          }}
        />
        <input
          type="text"
          placeholder="Search issues..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="input"
          style={{ paddingLeft: '30px', padding: '7px 10px 7px 30px', fontSize: '12px' }}
        />
      </div>

      <select value={filters.priority || ''} onChange={(e) => handleChange('priority', e.target.value)} className="filter-select">
        <option value="">All Priorities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select value={filters.type || ''} onChange={(e) => handleChange('type', e.target.value)} className="filter-select">
        <option value="">All Types</option>
        <option value="bug">Bug</option>
        <option value="feature">Feature</option>
        <option value="task">Task</option>
        <option value="improvement">Improvement</option>
      </select>

      <select value={filters.assignee || ''} onChange={(e) => handleChange('assignee', e.target.value)} className="filter-select">
        <option value="">All Assignees</option>
        {members.map(m => (
          <option key={m.user?._id || m._id} value={m.user?._id || m._id}>
            {m.user?.name || m.name}
          </option>
        ))}
      </select>

      <select value={filters.sort || ''} onChange={(e) => handleChange('sort', e.target.value)} className="filter-select">
        <option value="">Default Sort</option>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="priority">Priority</option>
        <option value="updated">Recently Updated</option>
      </select>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 transition-colors"
          style={{
            padding: '6px 10px', fontSize: '12px',
            color: 'var(--red)', background: 'none',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <HiX style={{ width: '12px', height: '12px' }} />
          Clear
        </button>
      )}
    </div>
  );
};

export default FilterBar;
