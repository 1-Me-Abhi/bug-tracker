import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineTicket, HiOutlineExclamation, HiOutlineClock, HiOutlineCheckCircle, HiOutlineFolder } from 'react-icons/hi';
import StatsCard from '../components/StatsCard';
import api from '../services/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, done: 0 });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const projectsData = await api.getProjects();
      setProjects(projectsData);

      let allIssues = [];
      for (const p of projectsData.slice(0, 10)) {
        try {
          const issues = await api.getIssues(p._id);
          allIssues = [...allIssues, ...issues.map(i => ({ ...i, projectName: p.name, projectKey: p.key }))];
        } catch (e) { /* skip */ }
      }

      setStats({
        total: allIssues.length,
        open: allIssues.filter(i => i.status === 'todo').length,
        inProgress: allIssues.filter(i => i.status === 'in_progress' || i.status === 'in_review').length,
        done: allIssues.filter(i => i.status === 'done').length,
      });

      setRecentIssues(allIssues.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 8));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const priorityDot = {
    critical: 'bg-[#ee7d77]',
    high: 'bg-[#ff9993]',
    medium: 'bg-[#909fb6]',
    low: 'bg-[#48636b]',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-2 border-[#afcbd4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={HiOutlineTicket} label="Total Issues" value={stats.total} />
        <StatsCard icon={HiOutlineExclamation} label="Open" value={stats.open} />
        <StatsCard icon={HiOutlineClock} label="In Progress" value={stats.inProgress} />
        <StatsCard icon={HiOutlineCheckCircle} label="Completed" value={stats.done} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent issues */}
        <div className="lg:col-span-2 bg-[#06122d] rounded-lg border border-[#2b4680]/30 p-6">
          <h3 className="text-sm font-medium text-[#dee5ff] mb-6 tracking-wide">Recent Activity</h3>
          <div className="space-y-1">
            {recentIssues.length === 0 && (
              <p className="text-sm text-[#4e5c71] text-center py-8">No issues yet. Create a project and start tracking.</p>
            )}
            {recentIssues.map(issue => (
              <div
                key={issue._id}
                onClick={() => navigate(`/issue/${issue._id}`)}
                className="flex items-center gap-4 px-4 py-3 rounded hover:bg-[#031d4b] cursor-pointer transition-colors group"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${priorityDot[issue.priority]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#dee5ff] truncate">
                    {issue.title}
                  </p>
                  <p className="text-xs text-[#909fb6] mt-1">
                    {issue.projectKey}-{issue.ticketNumber} &middot; {issue.status.replace('_', ' ')}
                  </p>
                </div>
                {issue.assignee && (
                  <div className="w-6 h-6 rounded bg-[#29434a] flex items-center justify-center text-[10px] font-semibold text-[#dee5ff] shrink-0 border border-[#456067]">
                    {issue.assignee.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Projects quick access */}
        <div className="bg-[#06122d] rounded-lg border border-[#2b4680]/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-[#dee5ff] tracking-wide">Projects</h3>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs text-[#afcbd4] hover:text-[#cbe7f0] transition-colors"
            >
              View all
            </button>
          </div>
          <div className="space-y-1">
            {projects.length === 0 && (
              <p className="text-sm text-[#4e5c71] text-center py-8">No projects yet</p>
            )}
            {projects.slice(0, 6).map(project => (
              <div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#031d4b] cursor-pointer transition-colors group"
              >
                <div className="w-8 h-8 rounded bg-[#304b52] flex items-center justify-center text-xs font-semibold text-[#afcbd4] shrink-0">
                  {project.key?.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#dee5ff] truncate">{project.name}</p>
                  <p className="text-xs text-[#909fb6] mt-0.5">{project.members?.length || 0} members</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

