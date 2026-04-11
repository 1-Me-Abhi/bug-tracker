import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { HiOutlineArrowLeft, HiOutlinePencil, HiOutlineTrash, HiOutlineCalendar } from 'react-icons/hi';
import { HiBugAnt } from 'react-icons/hi2';
import CommentSection from '../components/CommentSection';
import IssueModal from '../components/IssueModal';
import api from '../services/api';
import toast from 'react-hot-toast';

const statusLabels = {
  todo: { label: 'To Do', bg: 'bg-status-todo/20 text-status-todo' },
  in_progress: { label: 'In Progress', bg: 'bg-status-progress/20 text-status-progress' },
  in_review: { label: 'In Review', bg: 'bg-status-review/20 text-status-review' },
  done: { label: 'Done', bg: 'bg-status-done/20 text-status-done' },
};

const priorityLabels = {
  critical: { label: 'Critical', bg: 'bg-priority-critical/20 text-priority-critical' },
  high: { label: 'High', bg: 'bg-priority-high/20 text-priority-high' },
  medium: { label: 'Medium', bg: 'bg-priority-medium/20 text-priority-medium' },
  low: { label: 'Low', bg: 'bg-priority-low/20 text-priority-low' },
};

const typeLabels = { bug: '🐛 Bug', feature: '✨ Feature', task: '📋 Task', improvement: '⚡ Improvement' };

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    loadIssue();
  }, [id]);

  const loadIssue = async () => {
    try {
      const data = await api.getIssue(id);
      setIssue(data);
      if (data.project?._id) {
        const projectData = await api.getProject(data.project._id);
        setProject(projectData);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this issue permanently?')) return;
    try {
      await api.deleteIssue(id);
      toast.success('Issue deleted');
      navigate(-1);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const updated = await api.updateIssueStatus(id, { status });
      setIssue(updated);
      toast.success('Status updated');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="text-center py-20">
        <p className="text-dark-400">Issue not found</p>
      </div>
    );
  }

  const statusConf = statusLabels[issue.status] || statusLabels.todo;
  const priorityConf = priorityLabels[issue.priority] || priorityLabels.medium;

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-dark-300 hover:text-white mb-4 transition-colors"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-dark-800/60 rounded-2xl border border-dark-600/30 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-dark-400 bg-dark-700 px-2 py-1 rounded">
                  {issue.project?.key}-{issue.ticketNumber}
                </span>
                <span className="text-xs text-dark-400">{typeLabels[issue.type]}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowEdit(true)}
                  className="p-2 rounded-lg text-dark-400 hover:text-brand-400 hover:bg-dark-700 transition-colors"
                >
                  <HiOutlinePencil className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-lg text-dark-400 hover:text-accent-rose hover:bg-dark-700 transition-colors"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h1 className="text-xl font-bold text-white mb-3">{issue.title}</h1>

            {issue.description && (
              <div className="prose prose-invert max-w-none">
                <p className="text-sm text-dark-200 whitespace-pre-wrap leading-relaxed">{issue.description}</p>
              </div>
            )}

            {/* Attachments */}
            {issue.attachments?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-medium text-dark-300 mb-2">Attachments</h4>
                <div className="flex flex-wrap gap-2">
                  {issue.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-24 h-24 rounded-lg bg-dark-700 border border-dark-600/50 overflow-hidden hover:border-brand-500/40 transition-colors"
                    >
                      {att.mimetype?.startsWith('image/') ? (
                        <img src={att.path} alt={att.originalname} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-dark-400 p-2 text-center">
                          {att.originalname}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="bg-dark-800/60 rounded-2xl border border-dark-600/30 p-6">
            <CommentSection issueId={id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-dark-800/60 rounded-2xl border border-dark-600/30 p-5">
            <h3 className="text-xs font-medium text-dark-400 mb-3 uppercase tracking-wider">Status</h3>
            <select
              value={issue.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white cursor-pointer"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Details */}
          <div className="bg-dark-800/60 rounded-2xl border border-dark-600/30 p-5 space-y-4">
            <h3 className="text-xs font-medium text-dark-400 uppercase tracking-wider">Details</h3>

            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-400">Priority</span>
              <span className={`text-xs px-2 py-1 rounded-md font-medium ${priorityConf.bg}`}>{priorityConf.label}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-400">Assignee</span>
              {issue.assignee ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-[9px] font-bold text-dark-900">
                    {issue.assignee.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs text-dark-100">{issue.assignee.name}</span>
                </div>
              ) : (
                <span className="text-xs text-dark-500">Unassigned</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-400">Reporter</span>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-amber to-accent-rose flex items-center justify-center text-[9px] font-bold text-dark-900">
                  {issue.reporter?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-dark-100">{issue.reporter?.name}</span>
              </div>
            </div>

            {issue.dueDate && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-dark-400">Due Date</span>
                <span className="text-xs text-dark-100 flex items-center gap-1">
                  <HiOutlineCalendar className="w-3 h-3" />
                  {format(new Date(issue.dueDate), 'MMM d, yyyy')}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-400">Created</span>
              <span className="text-xs text-dark-300">
                {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
              </span>
            </div>

            {/* Labels */}
            {issue.labels?.length > 0 && (
              <div>
                <span className="text-xs text-dark-400 block mb-2">Labels</span>
                <div className="flex flex-wrap gap-1">
                  {issue.labels.map((label, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-dark-600/80 text-dark-200">{label}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {showEdit && (
        <IssueModal
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          onSave={(updated) => { setIssue(updated); setShowEdit(false); }}
          projectId={issue.project?._id}
          members={project?.members || []}
          issue={issue}
        />
      )}
    </div>
  );
};

export default IssueDetail;
