import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProjectModal = ({ isOpen, onClose, onSave, project = null }) => {
  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
    key: project?.key || '',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.key.trim()) {
      toast.error('Name and key are required');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (project) {
        result = await api.updateProject(project._id, { name: form.name, description: form.description });
      } else {
        result = await api.createProject(form);
      }
      toast.success(project ? 'Project updated!' : 'Project created!');
      onSave(result);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-dark-800 rounded-2xl border border-dark-600/50 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-dark-600/50">
          <h2 className="text-lg font-semibold text-white">
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Project Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Web Platform"
              className="w-full px-3 py-2.5 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white placeholder-dark-400 focus:border-brand-500/50"
            />
          </div>

          {!project && (
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Project Key *</label>
              <input
                type="text"
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                placeholder="e.g., WEB"
                maxLength={10}
                className="w-full px-3 py-2.5 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white placeholder-dark-400 focus:border-brand-500/50 font-mono uppercase"
              />
              <p className="text-[11px] text-dark-400 mt-1">Used as ticket prefix (e.g., WEB-1, WEB-2)</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief project description..."
              rows={3}
              className="w-full px-3 py-2.5 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white placeholder-dark-400 focus:border-brand-500/50 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-dark-300 hover:text-white rounded-lg hover:bg-dark-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all disabled:opacity-50 shadow-lg shadow-brand-500/25"
            >
              {loading ? 'Saving...' : project ? 'Update' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
