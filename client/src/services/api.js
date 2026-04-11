const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

const api = {
  // Auth
  register: (body) =>
    fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  login: (body) =>
    fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  getMe: () =>
    fetch(`${API_BASE}/auth/me`, { headers: getHeaders() }).then(handleResponse),

  // Projects
  getProjects: () =>
    fetch(`${API_BASE}/projects`, { headers: getHeaders() }).then(handleResponse),

  createProject: (body) =>
    fetch(`${API_BASE}/projects`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  getProject: (id) =>
    fetch(`${API_BASE}/projects/${id}`, { headers: getHeaders() }).then(handleResponse),

  updateProject: (id, body) =>
    fetch(`${API_BASE}/projects/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  deleteProject: (id) =>
    fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),

  addMember: (projectId, body) =>
    fetch(`${API_BASE}/projects/${projectId}/members`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  removeMember: (projectId, userId) =>
    fetch(`${API_BASE}/projects/${projectId}/members/${userId}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),

  // Issues
  getIssues: (projectId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/issues/project/${projectId}?${query}`, { headers: getHeaders() }).then(handleResponse);
  },

  createIssue: (formData) =>
    fetch(`${API_BASE}/issues`, { method: 'POST', headers: getAuthHeader(), body: formData }).then(handleResponse),

  getIssue: (id) =>
    fetch(`${API_BASE}/issues/${id}`, { headers: getHeaders() }).then(handleResponse),

  updateIssue: (id, formData) =>
    fetch(`${API_BASE}/issues/${id}`, { method: 'PUT', headers: getAuthHeader(), body: formData }).then(handleResponse),

  updateIssueStatus: (id, body) =>
    fetch(`${API_BASE}/issues/${id}/status`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  reorderIssues: (issues) =>
    fetch(`${API_BASE}/issues/reorder`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ issues }) }).then(handleResponse),

  deleteIssue: (id) =>
    fetch(`${API_BASE}/issues/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),

  // Comments
  getComments: (issueId) =>
    fetch(`${API_BASE}/comments/issue/${issueId}`, { headers: getHeaders() }).then(handleResponse),

  addComment: (body) =>
    fetch(`${API_BASE}/comments`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  deleteComment: (id) =>
    fetch(`${API_BASE}/comments/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),

  // Users
  getUsers: () =>
    fetch(`${API_BASE}/users`, { headers: getHeaders() }).then(handleResponse),
};

export default api;
