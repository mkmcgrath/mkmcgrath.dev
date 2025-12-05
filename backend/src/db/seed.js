const pool = require('./connection');

async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Clear existing data
    await pool.query('DELETE FROM blog_posts');
    await pool.query('DELETE FROM projects');
    console.log('Cleared existing data');

    // Insert sample projects
    const projectsQuery = `
      INSERT INTO projects (title, description, tech_stack, links, tags)
      VALUES
        ($1, $2, $3, $4, $5),
        ($6, $7, $8, $9, $10),
        ($11, $12, $13, $14, $15)
      RETURNING *;
    `;

    const projectsResult = await pool.query(projectsQuery, [
      // Project 1
      'Portfolio Website',
      'A full-stack portfolio site with blog functionality, admin dashboard, and project showcase. Built with modern technologies and deployed on cloud infrastructure.',
      ['React', 'Node.js', 'Express', 'PostgreSQL', 'Cloudflare Pages', 'Fly.io'],
      JSON.stringify({ github: 'https://github.com/yourusername/portfolio', live: 'https://mkmcgrath.dev' }),
      ['web', 'full-stack', 'react', 'node'],

      // Project 2
      'Weather App',
      'Real-time weather application with geolocation support. Displays current conditions, hourly forecasts, and weekly predictions with interactive charts.',
      ['React', 'OpenWeather API', 'CSS3', 'Geolocation API'],
      JSON.stringify({ github: 'https://github.com/yourusername/weather-app', live: 'https://weather.mkmcgrath.dev' }),
      ['web', 'api', 'react'],

      // Project 3
      'Task Manager CLI',
      'Command-line task management tool with priority sorting, due dates, and project organization. Stores data locally using SQLite.',
      ['Python', 'SQLite', 'Click', 'Rich'],
      JSON.stringify({ github: 'https://github.com/yourusername/task-cli' }),
      ['cli', 'python', 'productivity']
    ]);

    console.log(`Inserted ${projectsResult.rowCount} projects`);

    // Insert sample blog posts
    const blogQuery = `
      INSERT INTO blog_posts (title, content, excerpt, tags, published_at)
      VALUES
        ($1, $2, $3, $4, NOW()),
        ($5, $6, $7, $8, NOW() - INTERVAL '7 days'),
        ($9, $10, $11, $12, NOW() - INTERVAL '14 days')
      RETURNING *;
    `;

    const blogResult = await pool.query(blogQuery, [
      // Blog Post 1
      'Building a Full-Stack Portfolio with React and Node.js',
      `# Building a Full-Stack Portfolio with React and Node.js

## Introduction
Creating a portfolio website is a great way to showcase your projects and skills. In this post, I'll walk through the architecture and tech stack I chose for my personal site.

## Tech Stack
- **Frontend**: React 19 with React Router for navigation
- **Backend**: Node.js with Express for the REST API
- **Database**: PostgreSQL for storing projects and blog posts
- **Deployment**: Cloudflare Pages (frontend) and Fly.io (backend)

## Architecture Decisions
I went with a monorepo structure to keep both frontend and backend in sync...

## Challenges and Solutions
One interesting challenge was implementing authentication...

## Conclusion
Building this portfolio taught me a lot about modern web development practices.`,
      'Learn how I built my portfolio website using React, Node.js, and PostgreSQL. A deep dive into architecture decisions and deployment strategies.',
      ['web-development', 'react', 'node.js', 'tutorial'],

      // Blog Post 2
      'Getting Started with PostgreSQL in Node.js',
      `# Getting Started with PostgreSQL in Node.js

## Why PostgreSQL?
PostgreSQL is a powerful, open-source relational database that works great with Node.js applications.

## Setting Up
First, install the \`pg\` package:
\`\`\`bash
npm install pg
\`\`\`

## Creating a Connection Pool
\`\`\`javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
\`\`\`

## Running Queries
Here's how to execute queries safely with parameterized statements...`,
      'A beginner-friendly guide to integrating PostgreSQL with your Node.js applications using connection pools and parameterized queries.',
      ['postgresql', 'node.js', 'database', 'tutorial'],

      // Blog Post 3
      'Dark Mode Design: Tips and Tricks',
      `# Dark Mode Design: Tips and Tricks

## The Rise of Dark Mode
Dark mode has become increasingly popular in recent years, and for good reason.

## Color Theory for Dark Themes
When designing for dark mode, you can't just invert your light theme colors...

## Implementation Strategies
### CSS Variables
The easiest way to implement dark mode is using CSS custom properties:
\`\`\`css
:root {
  --bg-primary: #0a0e27;
  --text-primary: #e0e6f7;
}
\`\`\`

## Accessibility Considerations
Make sure your contrast ratios meet WCAG standards...`,
      'Essential tips for creating beautiful and accessible dark mode interfaces. Learn about color theory, implementation strategies, and accessibility.',
      ['design', 'css', 'ui-ux', 'accessibility']
    ]);

    console.log(`Inserted ${blogResult.rowCount} blog posts`);
    console.log('Database seeded successfully!');

    // Display the data
    const projects = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    const blogs = await pool.query('SELECT id, title, excerpt, tags, published_at FROM blog_posts ORDER BY published_at DESC');

    console.log('\n--- Projects ---');
    projects.rows.forEach(p => console.log(`- ${p.title} (${p.tech_stack.join(', ')})`));

    console.log('\n--- Blog Posts ---');
    blogs.rows.forEach(b => console.log(`- ${b.title} (${b.published_at.toLocaleDateString()})`));

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await pool.end();
  }
}

// Run the seed function
seedDatabase();
