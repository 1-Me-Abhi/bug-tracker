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
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Projects</h1>
          <p className="text-sm text-dark-300 mt-0.5">{projects.length} projects</p>
        </div>
        <button
          onClick={() => { setEditProject(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg shadow-brand-500/25"
        >
          <HiOutlinePlus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Project grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-700/50 flex items-center justify-center">
            <HiOutlinePlus className="w-8 h-8 text-dark-400" />
          </div>
          <h3 className="text-lg font-medium text-dark-200 mb-1">No projects yet</h3>
          <p className="text-sm text-dark-400 mb-4">Create your first project to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-500 transition-colors"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <div
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
              className="group p-5 rounded-2xl border border-dark-600/30 bg-dark-800/60 cursor-pointer hover:border-brand-500/30 hover:bg-dark-800 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-accent-violet flex items-center justify-center text-sm font-bold text-white shadow-lg">
                  {project.key?.slice(0, 2)}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditProject(project); setShowModal(true); }}
                    className="p-1.5 rounded-lg text-dark-400 hover:text-brand-400 hover:bg-dark-700 transition-colors"
                  >
                    <HiOutlinePencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, project._id)}
                    className="p-1.5 rounded-lg text-dark-400 hover:text-accent-rose hover:bg-dark-700 transition-colors"
                  >
                    <HiOutlineTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-semibold text-white mb-1 group-hover:text-brand-200 transition-colors">{project.name}</h3>
              <p className="text-sm text-dark-300 line-clamp-2 mb-4">{project.description || 'No description'}</p>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-dark-400 bg-dark-700/60 px-2 py-1 rounded">{project.key}</span>
                <div className="flex -space-x-2">
                  {project.members?.slice(0, 4).map((m, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-[9px] font-bold text-dark-900 border-2 border-dark-800"
                      title={m.user?.name}
                    >
                      {m.user?.name?.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {(project.members?.length || 0) > 4 && (
                    <div className="w-6 h-6 rounded-full bg-dark-600 flex items-center justify-center text-[9px] text-dark-300 border-2 border-dark-800">
                      +{project.members.length - 4}
                    </div>
                  )}
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
