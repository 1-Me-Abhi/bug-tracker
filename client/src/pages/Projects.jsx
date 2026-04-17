import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import ProjectModal from '../components/ProjectModal';
import api from '../services/api';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (project) => {
    if (editProject) {
      setProjects(prev => prev.map(p => p._id === project._id ? project : p));
    } else {
      setProjects(prev => [project, ...prev]);
    }
    setEditProject(null);
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (!confirm('Delete this project and all its issues?')) return;
    try {
      await api.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p._id !== projectId));
      toast.success('Project deleted');
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

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--dark-200)' }}>Projects</h1>
          <p style={{ fontSize: '13px', color: 'var(--dark-400)', marginTop: '4px' }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { setEditProject(null); setShowModal(true); }}
          className="btn"
        >
          <HiOutlinePlus style={{ width: '16px', height: '16px' }} />
          New Project
        </button>
      </div>

      {/* Project grid */}
      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: '64px', height: '64px',
              margin: '0 auto 16px',
              borderRadius: '12px',
              background: 'var(--dark-750)',
              border: '1px solid var(--border)',
            }}
          >
            <HiOutlinePlus style={{ width: '28px', height: '28px', color: 'var(--dark-350)' }} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--dark-300)', marginBottom: '8px' }}>No projects yet</h3>
          <p style={{ fontSize: '13px', color: 'var(--dark-350)', marginBottom: '20px' }}>Create your first project to get started</p>
          <button onClick={() => setShowModal(true)} className="btn">
            Create Project
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
              className="card group transition-all"
              style={{ padding: '20px', cursor: 'pointer' }}
            >
              <div className="flex items-start justify-between" style={{ marginBottom: '12px' }}>
                <div
                  className="avatar"
                  style={{
                    width: '40px', height: '40px',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                >
                  {project.key?.slice(0, 2)}
                </div>
                <div className="flex gap-1 group-hover-target">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditProject(project); setShowModal(true); }}
                    className="btn-ghost"
                  >
                    <HiOutlinePencil style={{ width: '14px', height: '14px' }} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, project._id)}
                    className="btn-ghost"
                  >
                    <HiOutlineTrash style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--dark-200)', marginBottom: '4px' }}>
                {project.name}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--dark-400)', marginBottom: '16px', lineHeight: 1.5 }}>
                {project.description || 'No description'}
              </p>

              <div className="flex items-center justify-between">
                <span className="mono-tag">
                  {project.key}
                </span>
                <div className="flex" style={{ marginLeft: '-6px' }}>
                  {project.members?.slice(0, 4).map((m, i) => (
                    <div
                      key={i}
                      className="avatar-sm avatar"
                      style={{
                        border: '2px solid var(--dark-750)',
                        marginLeft: i > 0 ? '-6px' : '0',
                      }}
                      title={m.user?.name}
                    >
                      {m.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditProject(null); }}
        onSave={handleSave}
        project={editProject}
      />
    </div>
  );
};

export default Projects;
