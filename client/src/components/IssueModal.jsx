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
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('type', form.type);
      formData.append('priority', form.priority);
      formData.append('status', form.status);
      if (form.assignee) formData.append('assignee', form.assignee);
      if (form.labels) {
        formData.append('labels', JSON.stringify(form.labels.split(',').map(l => l.trim()).filter(Boolean)));
      }
      if (form.dueDate) formData.append('dueDate', form.dueDate);
      if (!issue) formData.append('project', projectId);

      files.forEach(file => formData.append('attachments', file));

      let result;
      if (issue) {
        result = await api.updateIssue(issue._id, formData);
      } else {
        result = await api.createIssue(formData);
      }

      toast.success(issue ? 'Issue updated!' : 'Issue created!');
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
      <div className="relative w-full max-w-lg bg-dark-800 rounded-2xl border border-dark-600/50 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-600/50">
          <h2 className="text-lg font-semibold text-white">
            {issue ? 'Edit Issue' : 'Create New Issue'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Brief summary of the issue"
              className="w-full px-3 py-2.5 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white placeholder-dark-400 focus:border-brand-500/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detailed description, steps to reproduce..."
              rows={4}
              className="w-full px-3 py-2.5 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white placeholder-dark-400 focus:border-brand-500/50 resize-none"
            />
          </div>

          {/* Type & Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2.5 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white cursor-pointer"
              >
                <option value="bug">🐛 Bug</option>
                <option value="feature">✨ Feature</option>
                <option value="task">📋 Task</option>
                <option value="improvement">⚡ Improvement</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2.5 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white cursor-pointer"
              >
                <option value="critical">🔴 Critical</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>

          {/* Assignee & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Assignee</label>
              <select
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                className="w-full px-3 py-2.5 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white cursor-pointer"
              >
                <option value="">Unassigned</option>
                {members.map(m => (
                  <option key={m.user?._id || m._id} value={m.user?._id || m._id}>
                    {m.user?.name || m.name}
                  </option>
                ))}
              </select>
            </div>
            {issue && (
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2.5 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white cursor-pointer"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            )}
          </div>

          {/* Labels & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Labels (comma separated)</label>
              <input
                type="text"
                value={form.labels}
                onChange={(e) => setForm({ ...form, labels: e.target.value })}
                placeholder="frontend, api, urgent"
                className="w-full px-3 py-2.5 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white placeholder-dark-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2.5 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white"
              />
            </div>
          </div>

          {/* File upload */}
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Attachments</label>
            <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-dark-600/50 rounded-xl cursor-pointer hover:border-brand-500/40 transition-colors">
              <HiOutlineUpload className="w-4 h-4 text-dark-400" />
              <span className="text-sm text-dark-400">Click to upload screenshots</span>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => setFiles([...e.target.files])}
                className="hidden"
              />
            </label>
            {files.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {Array.from(files).map((f, i) => (
                  <span key={i} className="text-[11px] px-2 py-1 rounded bg-dark-700 text-dark-200">{f.name}</span>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
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
              {loading ? 'Saving...' : issue ? 'Update Issue' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueModal;
