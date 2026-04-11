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

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Socket.io real-time
  useEffect(() => {
    if (id) joinProject(id);
    return () => {
      if (id) leaveProject(id);
    };
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    const handleIssueCreated = (issue) => {
      setIssues(prev => {
        if (prev.find(i => i._id === issue._id)) return prev;
        return [...prev, issue];
      });
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

  const getColumnIssues = (status) => {
    return issues
      .filter(i => i.status === status)
      .sort((a, b) => a.order - b.order);
  };

  const handleDragEnd = async (result) => {
    const { draggableId, source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newStatus = destination.droppableId;
    const issueId = draggableId;

    // Optimistic update
    setIssues(prev => {
      const updated = prev.map(i => {
        if (i._id === issueId) {
          return { ...i, status: newStatus, order: destination.index };
        }
        return i;
      });
      return updated;
    });

    try {
      await api.updateIssueStatus(issueId, {
        status: newStatus,
        order: destination.index
      });
    } catch (error) {
      toast.error('Failed to update issue');
      loadData(); // Revert
    }
  };

  const handleIssueSave = (issue) => {
    if (editIssue) {
      setIssues(prev => prev.map(i => i._id === issue._id ? issue : i));
    } else {
      setIssues(prev => [...prev, issue]);
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

  const handleIssueClick = (issue) => {
    navigate(`/issue/${issue._id}`);
  };

  const handleAddIssue = (status) => {
    setDefaultStatus(status);
    setEditIssue(null);
    setShowIssueModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-dark-400">Project not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Project header */}
      <div className="px-6 pt-4 pb-3 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/projects')}
              className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">{project.name}</h1>
                <span className="text-xs font-mono text-dark-400 bg-dark-700/60 px-2 py-0.5 rounded">{project.key}</span>
              </div>
              <p className="text-xs text-dark-400">{project.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Member avatars */}
            <div className="flex -space-x-2 mr-2">
              {project.members?.slice(0, 5).map((m, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-[10px] font-bold text-dark-900 border-2 border-dark-800"
                  title={m.user?.name}
                >
                  {m.user?.name?.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="p-2 rounded-lg text-dark-300 hover:text-brand-400 hover:bg-dark-700 transition-colors"
              title="Add member"
            >
              <HiOutlineUserAdd className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setDefaultStatus('todo'); setEditIssue(null); setShowIssueModal(true); }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-500 transition-colors"
            >
              <HiOutlinePlus className="w-4 h-4" />
              Issue
            </button>
          </div>
        </div>

        {/* Add member form */}
        {showAddMember && (
          <form onSubmit={handleAddMember} className="flex gap-2 animate-slide-up">
            <input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="Enter member email..."
              className="flex-1 max-w-xs px-3 py-2 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white placeholder-dark-400"
            />
            <button type="submit" className="px-3 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-500">
              Add
            </button>
          </form>
        )}

        {/* Filters */}
        <FilterBar filters={filters} setFilters={setFilters} members={project.members || []} />
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto px-6 pb-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 h-full min-w-max lg:min-w-0">
            {STATUSES.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                issues={getColumnIssues(status)}
                projectKey={project.key}
                onIssueClick={handleIssueClick}
                onAddIssue={handleAddIssue}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Issue Modal */}
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
