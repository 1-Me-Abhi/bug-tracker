import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineTicket, HiOutlineExclamation, HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi';
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
      const seenIds = new Set();
      for (const p of projectsData.slice(0, 10)) {
        try {
          const issues = await api.getIssues(p._id);
          for (const i of issues) {
            if (!seenIds.has(i._id)) {
              seenIds.add(i._id);
              allIssues.push({ ...i, projectName: p.name, projectKey: p.key });
            }
          }
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

  const priorityColors = {
    critical: '#e05252',
    high: '#e87c5a',
    medium: '#7a8ba5',
    low: '#3d6b5e',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <StatsCard icon={HiOutlineTicket} label="Total Issues" value={stats.total} />
        <StatsCard icon={HiOutlineExclamation} label="Open" value={stats.open} />
        <StatsCard icon={HiOutlineClock} label="In Progress" value={stats.inProgress} />
        <StatsCard icon={HiOutlineCheckCircle} label="Completed" value={stats.done} />
      </div>

      {/* Bottom section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
        }}
      >
        {/* Recent Activity */}
        <div className="card">
          <h3 style={{
            fontSize: '14px', fontWeight: 600, color: 'var(--dark-200)',
            marginBottom: '20px', letterSpacing: '-0.01em',
          }}>
            Recent Activity
          </h3>
          <div className="flex-col" style={{ display: 'flex', gap: '2px' }}>
            {recentIssues.length === 0 && (
              <p style={{ fontSize: '13px', color: 'var(--dark-350)', textAlign: 'center', padding: '40px 0' }}>
                No issues yet. Create a project and start tracking.
              </p>
            )}
            {recentIssues.map(issue => (
              <div
                key={issue._id}
                onClick={() => navigate(`/issue/${issue._id}`)}
                className="flex items-center hover-row"
                style={{
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '8px', height: '8px',
                    borderRadius: '50%',
                    background: priorityColors[issue.priority] || '#7a8ba5',
                    flexShrink: 0,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: '13px', color: 'var(--dark-200)', fontWeight: 500 }}>
                    {issue.title}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--dark-500)', marginTop: '3px' }}>
                    {issue.projectKey}-{issue.ticketNumber} · {issue.status.replace('_', ' ')}
                  </p>
                </div>
                {issue.assignee && (
                  <div
                    className="avatar-md avatar shrink-0"
                    style={{ borderRadius: '6px' }}
                  >
                    {issue.assignee.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Projects quick access */}
        <div className="card">
          <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--dark-200)', letterSpacing: '-0.01em' }}>
              Projects
            </h3>
            <button
              onClick={() => navigate('/projects')}
              style={{
                fontSize: '12px', color: 'var(--accent)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontWeight: 500, fontFamily: 'inherit',
              }}
            >
              View all →
            </button>
          </div>
          <div className="flex-col" style={{ display: 'flex', gap: '2px' }}>
            {projects.length === 0 && (
              <p style={{ fontSize: '13px', color: 'var(--dark-350)', textAlign: 'center', padding: '40px 0' }}>
                No projects yet
              </p>
            )}
            {projects.slice(0, 6).map(project => (
              <div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="flex items-center hover-row"
                style={{
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                <div
                  className="avatar shrink-0"
                  style={{
                    width: '34px', height: '34px',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                >
                  {project.key?.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: '13px', color: 'var(--dark-200)', fontWeight: 500 }}>
                    {project.name}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--dark-500)', marginTop: '2px' }}>
                    {project.members?.length || 0} member{(project.members?.length || 0) !== 1 ? 's' : ''}
                  </p>
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
