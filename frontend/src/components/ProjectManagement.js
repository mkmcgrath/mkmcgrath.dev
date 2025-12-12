import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminManagement.css';

function ProjectManagement() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: '',
    github_url: '',
    live_url: '',
    tags: '',
  });

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tech_stack: '',
      github_url: '',
      live_url: '',
      tags: '',
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack.join(', '),
      github_url: project.links.github || '',
      live_url: project.links.live || '',
      tags: project.tags.join(', '),
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Prepare data for API
    const projectData = {
      title: formData.title,
      description: formData.description,
      tech_stack: formData.tech_stack.split(',').map(t => t.trim()).filter(t => t),
      links: {
        github: formData.github_url || null,
        live: formData.live_url || null,
      },
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
    };

    try {
      const url = editingProject
        ? `http://localhost:5000/admin/projects/${editingProject.id}`
        : 'http://localhost:5000/admin/projects';

      const response = await fetch(url, {
        method: editingProject ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save project');
      }

      setSuccess(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
      resetForm();
      fetchProjects(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/admin/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }

      setSuccess('Project deleted successfully!');
      fetchProjects(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="management-loading">Loading projects...</div>;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Project Management</h2>
        {!showForm && (
          <button onClick={handleCreate} className="btn-primary">
            + New Project
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="form-container">
          <div className="form-header">
            <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
            <button onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="My Awesome Project"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="A brief description of the project..."
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tech_stack">Tech Stack * (comma-separated)</label>
              <input
                type="text"
                id="tech_stack"
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleInputChange}
                placeholder="React, Node.js, PostgreSQL"
                required
              />
              <small>Separate technologies with commas</small>
            </div>

            <div className="form-group">
              <label htmlFor="github_url">GitHub URL</label>
              <input
                type="url"
                id="github_url"
                name="github_url"
                value={formData.github_url}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="live_url">Live Demo URL</label>
              <input
                type="url"
                id="live_url"
                name="live_url"
                value={formData.live_url}
                onChange={handleInputChange}
                placeholder="https://project-demo.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="web, fullstack, portfolio"
              />
              <small>Separate tags with commas</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="items-list">
        <h3>Existing Projects ({projects.length})</h3>
        {projects.length === 0 ? (
          <p className="empty-state">No projects yet. Create your first project!</p>
        ) : (
          <div className="items-grid">
            {projects.map((project) => (
              <div key={project.id} className="item-card">
                <div className="item-content">
                  <h4>{project.title}</h4>
                  <p className="item-description">{project.description}</p>
                  <div className="item-meta">
                    <div className="tech-tags">
                      {project.tech_stack.map((tech, idx) => (
                        <span key={idx} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                    {project.tags && project.tags.length > 0 && (
                      <div className="tags">
                        {project.tags.map((tag, idx) => (
                          <span key={idx} className="tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleEdit(project)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectManagement;
