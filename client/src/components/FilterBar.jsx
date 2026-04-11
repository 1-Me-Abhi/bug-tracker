import { HiOutlineSearch, HiOutlineFilter, HiX } from 'react-icons/hi';

const FilterBar = ({ filters, setFilters, members = [] }) => {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '', assignee: '', search: '', sort: '' });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="flex items-center gap-3 flex-wrap animate-fade-in">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
        <input
          type="text"
          placeholder="Search issues..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-dark-700/80 border border-dark-600/50 rounded-lg text-sm text-white placeholder-dark-400 focus:border-brand-500/50 transition-colors"
        />
      </div>

      {/* Priority filter */}
      <select
        value={filters.priority || ''}
        onChange={(e) => handleChange('priority', e.target.value)}
        className="px-3 py-2 bg-dark-700/80 border border-dark-600/50 rounded-lg text-sm text-dark-200 focus:border-brand-500/50 transition-colors cursor-pointer"
      >
        <option value="">All Priorities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Type filter */}
      <select
        value={filters.type || ''}
        onChange={(e) => handleChange('type', e.target.value)}
        className="px-3 py-2 bg-dark-700/80 border border-dark-600/50 rounded-lg text-sm text-dark-200 focus:border-brand-500/50 transition-colors cursor-pointer"
      >
        <option value="">All Types</option>
        <option value="bug">Bug</option>
        <option value="feature">Feature</option>
        <option value="task">Task</option>
        <option value="improvement">Improvement</option>
      </select>

      {/* Assignee filter */}
      <select
        value={filters.assignee || ''}
        onChange={(e) => handleChange('assignee', e.target.value)}
        className="px-3 py-2 bg-dark-700/80 border border-dark-600/50 rounded-lg text-sm text-dark-200 focus:border-brand-500/50 transition-colors cursor-pointer"
      >
        <option value="">All Assignees</option>
        {members.map(m => (
          <option key={m.user?._id || m._id} value={m.user?._id || m._id}>
            {m.user?.name || m.name}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={filters.sort || ''}
        onChange={(e) => handleChange('sort', e.target.value)}
        className="px-3 py-2 bg-dark-700/80 border border-dark-600/50 rounded-lg text-sm text-dark-200 focus:border-brand-500/50 transition-colors cursor-pointer"
      >
        <option value="">Default Sort</option>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="priority">Priority</option>
        <option value="updated">Recently Updated</option>
      </select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-3 py-2 text-sm text-dark-300 hover:text-accent-rose transition-colors"
        >
          <HiX className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  );
};

export default FilterBar;
