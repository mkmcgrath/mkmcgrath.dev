import { useState, useEffect } from 'react';
import './Projects.css';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <span className="loading-text">Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Projects</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>All Projects</h1>
        <p className="projects-subtitle">
          A collection of my personal and professional work
        </p>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>

            <div className="project-tech">
              <strong>Tech Stack:</strong>
              <div className="tech-tags">
                {project.tech_stack.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="project-tags">
                {project.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}

            {project.links && (
              <div className="project-links">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    <span>→</span> GitHub
                  </a>
                )}
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    <span>→</span> Live Demo
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="no-projects">
          <p>No projects found. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

export default Projects;
