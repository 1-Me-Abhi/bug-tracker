import { useState } from 'react';
import { HiX, HiOutlineUpload } from 'react-icons/hi';
import api from '../services/api';
import toast from 'react-hot-toast';

const IssueModal = ({ isOpen, onClose, onSave, projectId, members = [], issue = null }) => {
  const [form, setForm] = useState({
    title: issue?.title || '',
    description: issue?.description || '',
    type: issue?.type || 'bug',
    priority: issue?.priority || 'medium',
    assignee: issue?.assignee?._id || '',
    labels: issue?.labels?.join(', ') || '',
    dueDate: issue?.dueDate ? new Date(issue.dueDate).toISOString().split('T')[0] : '',
    status: issue?.status || 'todo',
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('type', form.type);
      formData.append('priority', form.priority);
      formData.append('status', form.status);
      if (form.assignee) formData.append('assignee', form.assignee);
      if (form.labels) formData.append('labels', JSON.stringify(form.labels.split(',').map(l => l.trim()).filter(Boolean)));
      if (form.dueDate) formData.append('dueDate', form.dueDate);
      if (!issue) formData.append('project', projectId);
      files.forEach(file => formData.append('attachments', file));
      let result;
      if (issue) { result = await api.updateIssue(issue._id, formData); }
      else { result = await api.createIssue(formData); }
      toast.success(issue ? 'Issue updated!' : 'Issue created!');
      onSave(result);
      onClose();
    } catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content" style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--dark-200)' }}>{issue ? 'Edit Issue' : 'Create New Issue'}</h2>
          <button onClick={onClose} className="btn-ghost">
            <HiX style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="flex-col" style={{ display: 'flex', gap: '16px' }}>
            <div>
              <label className="label">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Brief summary of the issue" className="input" />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed description..." rows={3} className="input" style={{ resize: 'none' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="label">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input" style={{ cursor: 'pointer' }}>
                  <option value="bug">🐛 Bug</option>
                  <option value="feature">✨ Feature</option>
                  <option value="task">📋 Task</option>
                  <option value="improvement">⚡ Improvement</option>
                </select>
              </div>
              <div>
                <label className="label">Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="input" style={{ cursor: 'pointer' }}>
                  <option value="critical">🔴 Critical</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="label">Assignee</label>
                <select value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} className="input" style={{ cursor: 'pointer' }}>
                  <option value="">Unassigned</option>
                  {members.map(m => <option key={m.user?._id || m._id} value={m.user?._id || m._id}>{m.user?.name || m.name}</option>)}
                </select>
              </div>
              {issue ? (
                <div>
                  <label className="label">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input" style={{ cursor: 'pointer' }}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="label">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="input" />
                </div>
              )}
            </div>

            <div>
              <label className="label">Labels (comma separated)</label>
              <input type="text" value={form.labels} onChange={e => setForm({ ...form, labels: e.target.value })} placeholder="frontend, api, urgent" className="input" />
            </div>

            <div>
              <label className="label">Attachments</label>
              <label
                className="flex items-center justify-center gap-2"
                style={{
                  padding: '14px', borderRadius: '8px', cursor: 'pointer',
                  border: '1px dashed rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.01)',
                }}
              >
                <HiOutlineUpload style={{ width: '16px', height: '16px', color: 'var(--dark-350)' }} />
                <span style={{ fontSize: '12px', color: 'var(--dark-350)' }}>Click to upload screenshots</span>
                <input type="file" multiple accept="image/*,.pdf" onChange={e => setFiles([...e.target.files])} className="hidden" />
              </label>
              {files.length > 0 && (
                <div className="flex flex-wrap" style={{ gap: '4px', marginTop: '8px' }}>
                  {Array.from(files).map((f, i) => (
                    <span key={i} className="tag">{f.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-text">Cancel</button>
            <button type="submit" disabled={loading} className="btn" style={{ opacity: loading ? 0.5 : 1 }}>
              {loading ? 'Saving...' : issue ? 'Update Issue' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueModal;
