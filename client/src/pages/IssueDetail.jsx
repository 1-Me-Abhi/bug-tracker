import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { HiOutlineArrowLeft, HiOutlinePencil, HiOutlineTrash, HiOutlineCalendar } from 'react-icons/hi';
import CommentSection from '../components/CommentSection';
import IssueModal from '../components/IssueModal';
import api from '../services/api';
import toast from 'react-hot-toast';

const statusLabels = {
  todo: { label: 'To Do' }, in_progress: { label: 'In Progress' },
  in_review: { label: 'In Review' }, done: { label: 'Done' },
};
const priorityColors = {
  critical: { bg: 'rgba(224,82,82,0.12)', text: '#e05252' },
  high: { bg: 'rgba(232,124,90,0.12)', text: '#e87c5a' },
  medium: { bg: 'rgba(122,139,165,0.12)', text: '#7a8ba5' },
  low: { bg: 'rgba(61,107,94,0.12)', text: '#3d6b5e' },
};
const typeLabels = { bug: '🐛 Bug', feature: '✨ Feature', task: '📋 Task', improvement: '⚡ Improvement' };

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => { loadIssue(); }, [id]);

  const loadIssue = async () => {
    try {
      const data = await api.getIssue(id);
      setIssue(data);
      if (data.project?._id) {
        const projectData = await api.getProject(data.project._id);
        setProject(projectData);
      }
    } catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this issue permanently?')) return;
    try { await api.deleteIssue(id); toast.success('Issue deleted'); navigate(-1); }
    catch (error) { toast.error(error.message); }
  };

  const handleStatusChange = async (status) => {
    try { const updated = await api.updateIssueStatus(id, { status }); setIssue(updated); toast.success('Status updated'); }
    catch (error) { toast.error(error.message); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }
  if (!issue) return <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--dark-400)' }}>Issue not found</div>;

  const prio = priorityColors[issue.priority] || priorityColors.medium;
  const cardStyle = { background: 'var(--dark-750)', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px' };
  const detailRow = (label, content) => (
    <div className="flex items-center justify-between" style={{ padding: '6px 0' }}>
      <span style={{ fontSize: '12px', color: 'var(--dark-400)' }}>{label}</span>
      {content}
    </div>
  );

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost flex items-center gap-2"
        style={{ fontSize: '13px', marginBottom: '20px' }}
      >
        <HiOutlineArrowLeft style={{ width: '14px', height: '14px' }} /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
        {/* Main */}
        <div className="flex-col" style={{ display: 'flex', gap: '20px' }}>
          <div style={cardStyle}>
            <div className="flex items-start justify-between" style={{ marginBottom: '16px' }}>
              <div className="flex items-center gap-2">
                <span className="mono-tag">
                  {issue.project?.key}-{issue.ticketNumber}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--dark-400)' }}>{typeLabels[issue.type]}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setShowEdit(true)} className="btn-ghost">
                  <HiOutlinePencil style={{ width: '16px', height: '16px' }} />
                </button>
                <button onClick={handleDelete} className="btn-ghost">
                  <HiOutlineTrash style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--dark-200)', marginBottom: '12px' }}>{issue.title}</h1>
            {issue.description && <p style={{ fontSize: '13px', color: 'var(--dark-300)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{issue.description}</p>}
            {issue.attachments?.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--dark-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Attachments</h4>
                <div className="flex flex-wrap" style={{ gap: '8px' }}>
                  {issue.attachments.map((att, i) => (
                    <a key={i} href={att.path} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '80px', height: '80px', borderRadius: '8px', background: 'var(--dark-800)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
                      {att.mimetype?.startsWith('image/') ? <img src={att.path} alt={att.originalname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div className="flex items-center justify-center" style={{ width: '100%', height: '100%', fontSize: '10px', color: 'var(--dark-500)', padding: '6px', textAlign: 'center' }}>{att.originalname}</div>}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={cardStyle}><CommentSection issueId={id} /></div>
        </div>

        {/* Sidebar */}
        <div className="flex-col" style={{ display: 'flex', gap: '16px' }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--dark-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Status</h3>
            <select
              value={issue.status}
              onChange={e => handleStatusChange(e.target.value)}
              className="input"
              style={{ cursor: 'pointer' }}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--dark-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Details</h3>
            {detailRow('Priority', <span className="badge" style={{ background: prio.bg, color: prio.text }}>{(priorityColors[issue.priority] ? issue.priority : 'medium')}</span>)}
            {detailRow('Assignee', issue.assignee
              ? <div className="flex items-center gap-1-5"><div className="avatar" style={{ width: '18px', height: '18px', fontSize: '9px' }}>{issue.assignee.name?.charAt(0)?.toUpperCase() ?? '?'}</div><span style={{ fontSize: '12px', color: 'var(--dark-200)' }}>{issue.assignee.name}</span></div>
              : <span style={{ fontSize: '12px', color: 'var(--dark-350)' }}>Unassigned</span>
            )}
            {detailRow('Reporter', <div className="flex items-center gap-1-5"><div className="avatar" style={{ width: '18px', height: '18px', fontSize: '9px', background: '#1a2a3a' }}>{issue.reporter?.name?.charAt(0)?.toUpperCase() ?? '?'}</div><span style={{ fontSize: '12px', color: 'var(--dark-200)' }}>{issue.reporter?.name}</span></div>)}
            {issue.dueDate && detailRow('Due Date', <span className="flex items-center gap-1" style={{ fontSize: '12px', color: 'var(--dark-200)' }}><HiOutlineCalendar style={{ width: '12px', height: '12px' }} />{format(new Date(issue.dueDate), 'MMM d, yyyy')}</span>)}
            {detailRow('Created', <span style={{ fontSize: '12px', color: 'var(--dark-400)' }}>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>)}
            {issue.labels?.length > 0 && (
              <div style={{ paddingTop: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--dark-400)', display: 'block', marginBottom: '6px' }}>Labels</span>
                <div className="flex flex-wrap" style={{ gap: '4px' }}>
                  {issue.labels.map((label, i) => <span key={i} className="tag">{label}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEdit && <IssueModal isOpen={showEdit} onClose={() => setShowEdit(false)} onSave={updated => { setIssue(updated); setShowEdit(false); }} projectId={issue.project?._id} members={project?.members || []} issue={issue} />}
    </div>
  );
};

export default IssueDetail;
