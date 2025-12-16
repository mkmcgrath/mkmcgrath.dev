-- Clear existing data
DELETE FROM blog_posts;
DELETE FROM projects;

-- Insert sample projects
INSERT INTO projects (title, description, tech_stack, links, tags) VALUES
  (
    'Portfolio Website',
    'A full-stack portfolio site with blog functionality, admin dashboard, and project showcase. Built with modern technologies and deployed on cloud infrastructure.',
    ARRAY['React', 'Node.js', 'Express', 'PostgreSQL', 'Cloudflare Pages', 'Fly.io'],
    '{"github": "https://github.com/yourusername/portfolio", "live": "https://mkmcgrath.dev"}',
    ARRAY['web', 'full-stack', 'react', 'node']
  ),
  (
    'Weather App',
    'Real-time weather application with geolocation support. Displays current conditions, hourly forecasts, and weekly predictions with interactive charts.',
    ARRAY['React', 'OpenWeather API', 'CSS3', 'Geolocation API'],
    '{"github": "https://github.com/yourusername/weather-app", "live": "https://weather.mkmcgrath.dev"}',
    ARRAY['web', 'api', 'react']
  ),
  (
    'Task Manager CLI',
    'Command-line task management tool with priority sorting, due dates, and project organization. Stores data locally using SQLite.',
    ARRAY['Python', 'SQLite', 'Click', 'Rich'],
    '{"github": "https://github.com/yourusername/task-cli"}',
    ARRAY['cli', 'python', 'productivity']
  );

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, tags, published_at) VALUES
  (
    'Building a Full-Stack Portfolio with React and Node.js',
    '# Building a Full-Stack Portfolio with React and Node.js

## Introduction
Creating a portfolio website is a great way to showcase your projects and skills. In this post, I''ll walk through the architecture and tech stack I chose for my personal site.

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
Building this portfolio taught me a lot about modern web development practices.',
    'Learn how I built my portfolio website using React, Node.js, and PostgreSQL. A deep dive into architecture decisions and deployment strategies.',
    ARRAY['web-development', 'react', 'node.js', 'tutorial'],
    NOW()
  ),
  (
    'Getting Started with PostgreSQL in Node.js',
    '# Getting Started with PostgreSQL in Node.js

## Why PostgreSQL?
PostgreSQL is a powerful, open-source relational database that works great with Node.js applications.

## Setting Up
First, install the `pg` package:
```bash
npm install pg
```

## Creating a Connection Pool
```javascript
const { Pool } = require(''pg'');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
```

## Running Queries
Here''s how to execute queries safely with parameterized statements...',
    'A beginner-friendly guide to integrating PostgreSQL with your Node.js applications using connection pools and parameterized queries.',
    ARRAY['postgresql', 'node.js', 'database', 'tutorial'],
    NOW() - INTERVAL '7 days'
  ),
  (
    'Dark Mode Design: Tips and Tricks',
    '# Dark Mode Design: Tips and Tricks

## The Rise of Dark Mode
Dark mode has become increasingly popular in recent years, and for good reason.

## Color Theory for Dark Themes
When designing for dark mode, you can''t just invert your light theme colors...

## Implementation Strategies
### CSS Variables
The easiest way to implement dark mode is using CSS custom properties:
```css
:root {
  --bg-primary: #0a0e27;
  --text-primary: #e0e6f7;
}
```

## Accessibility Considerations
Make sure your contrast ratios meet WCAG standards...',
    'Essential tips for creating beautiful and accessible dark mode interfaces. Learn about color theory, implementation strategies, and accessibility.',
    ARRAY['design', 'css', 'ui-ux', 'accessibility'],
    NOW() - INTERVAL '14 days'
  );
