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
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--dark-200)' }}>
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button onClick={onClose} className="btn-ghost">
            <HiX style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="flex-col" style={{ display: 'flex', gap: '16px' }}>
            <div>
              <label className="label">Project Name *</label>
              <input
                type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Web Platform"
                className="input"
              />
            </div>

            {!project && (
              <div>
                <label className="label">Project Key *</label>
                <input
                  type="text" value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                  placeholder="e.g., WEB" maxLength={10}
                  className="input"
                  style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                />
                <p style={{ fontSize: '11px', color: 'var(--dark-350)', marginTop: '4px' }}>
                  Used as ticket prefix (e.g., WEB-1, WEB-2)
                </p>
              </div>
            )}

            <div>
              <label className="label">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief project description..."
                rows={3}
                className="input"
                style={{ resize: 'none' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-text">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn" style={{ opacity: loading ? 0.5 : 1 }}>
              {loading ? 'Saving...' : project ? 'Update' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
