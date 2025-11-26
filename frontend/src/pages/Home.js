import './Home.css';
import { useState, useEffect } from 'react';

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div>
      <h1 className="terminal-title">mkmcgrath.dev</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Full-stack developer building modern web applications</p>

      <h2>Featured Projects</h2>
      <div style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        {projects.map((project) => (
          <div key={project.id} style={{
            backgroundColor: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ color: 'var(--accent-primary)' }}>{project.title}</h3>
            <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>{project.description}</p>
            <div>
              <strong>Tech Stack:</strong> {project.techStack.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
