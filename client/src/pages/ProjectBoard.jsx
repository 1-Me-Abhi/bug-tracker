import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import { HiOutlinePlus, HiOutlineUserAdd, HiOutlineArrowLeft } from 'react-icons/hi';
import KanbanColumn from '../components/KanbanColumn';
import FilterBar from '../components/FilterBar';
import IssueModal from '../components/IssueModal';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const STATUSES = ['todo', 'in_progress', 'in_review', 'done'];

const ProjectBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket, joinProject, leaveProject } = useSocket();

  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [editIssue, setEditIssue] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [filters, setFilters] = useState({
    status: '', priority: '', assignee: '', search: '', sort: '', type: ''
  });

  const loadData = useCallback(async () => {
    try {
      const [projectData, issuesData] = await Promise.all([
        api.getProject(id),
        api.getIssues(id, Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)))
      ]);
      setProject(projectData);
      setIssues(issuesData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [id, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (id) joinProject(id);
    return () => { if (id) leaveProject(id); };
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    const handleIssueCreated = (issue) => {
      setIssues(prev => prev.find(i => i._id === issue._id) ? prev : [...prev, issue]);
    };
    const handleIssueUpdated = (issue) => {
      setIssues(prev => prev.map(i => i._id === issue._id ? issue : i));
    };
    const handleIssueDeleted = ({ id }) => {
      setIssues(prev => prev.filter(i => i._id !== id));
    };
    socket.on('issue-created', handleIssueCreated);
    socket.on('issue-updated', handleIssueUpdated);
    socket.on('issue-deleted', handleIssueDeleted);
    return () => {
      socket.off('issue-created', handleIssueCreated);
      socket.off('issue-updated', handleIssueUpdated);
      socket.off('issue-deleted', handleIssueDeleted);
    };
  }, [socket]);

  const getColumnIssues = (status) =>
    issues.filter(i => i.status === status).sort((a, b) => a.order - b.order);

  const handleDragEnd = async (result) => {
    const { draggableId, source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const newStatus = destination.droppableId;
    setIssues(prev => prev.map(i =>
      i._id === draggableId ? { ...i, status: newStatus, order: destination.index } : i
    ));
    try {
      await api.updateIssueStatus(draggableId, { status: newStatus, order: destination.index });
    } catch (error) {
      toast.error('Failed to update issue');
      loadData();
    }
  };

  const handleIssueSave = (issue) => {
    if (editIssue) {
      setIssues(prev => prev.map(i => i._id === issue._id ? issue : i));
    } else {
      setIssues(prev => prev.find(i => i._id === issue._id) ? prev : [...prev, issue]);
    }
    setEditIssue(null);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.addMember(id, { email: memberEmail });
      setProject(updated);
      setMemberEmail('');
      setShowAddMember(false);
      toast.success('Member added!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--dark-400)' }}>
        Project not found
      </div>
    );
  }

  return (
    <div className="flex-col" style={{ display: 'flex', height: 'calc(100vh - 128px)' }}>
      {/* Project header */}
      <div className="shrink-0" style={{ marginBottom: '16px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/projects')} className="btn-ghost">
              <HiOutlineArrowLeft style={{ width: '16px', height: '16px' }} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--dark-200)' }}>{project.name}</h1>
                <span className="mono-tag">{project.key}</span>
              </div>
              {project.description && (
                <p style={{ fontSize: '12px', color: 'var(--dark-500)', marginTop: '2px' }}>{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex" style={{ marginRight: '4px' }}>
              {project.members?.slice(0, 5).map((m, i) => (
                <div
                  key={i}
                  className="avatar-md avatar"
                  style={{
                    border: '2px solid var(--dark-850)',
                    marginLeft: i > 0 ? '-6px' : '0',
                  }}
                  title={m.user?.name}
                >
                  {m.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="btn-ghost"
              title="Add member"
            >
              <HiOutlineUserAdd style={{ width: '16px', height: '16px' }} />
            </button>

            <button
              onClick={() => { setDefaultStatus('todo'); setEditIssue(null); setShowIssueModal(true); }}
              className="btn"
              style={{ padding: '8px 14px' }}
            >
              <HiOutlinePlus style={{ width: '14px', height: '14px' }} />
              Issue
            </button>
          </div>
        </div>

        {/* Add member form */}
        {showAddMember && (
          <form onSubmit={handleAddMember} className="flex gap-2 anim-slide-up" style={{ marginBottom: '12px' }}>
            <input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="Enter member email..."
              className="input"
              style={{ flex: 1, maxWidth: '320px' }}
            />
            <button type="submit" className="btn" style={{ padding: '8px 14px' }}>
              Add
            </button>
          </form>
        )}

        {/* Filters */}
        <FilterBar filters={filters} setFilters={setFilters} members={project.members || []} />
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto" style={{ paddingBottom: '8px' }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex h-full" style={{ gap: '12px', minWidth: 'max-content' }}>
            {STATUSES.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                issues={getColumnIssues(status)}
                projectKey={project.key}
                onIssueClick={(issue) => navigate(`/issue/${issue._id}`)}
                onAddIssue={(s) => { setDefaultStatus(s); setEditIssue(null); setShowIssueModal(true); }}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      <IssueModal
        isOpen={showIssueModal}
        onClose={() => { setShowIssueModal(false); setEditIssue(null); }}
        onSave={handleIssueSave}
        projectId={id}
        members={project.members || []}
        issue={editIssue}
      />
    </div>
  );
};

export default ProjectBoard;
