//import required packages
const express = require('express');
const cors = require('cors');
const pool = require('./db/connection');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/auth');

//create express app
const app = express();

//middleware
app.use(cors()); // lets frontend make requests
app.use(express.json()); // allows json parsing in requests

// morgan middleware (for server logging and incoming connections! yay!
app.use(morgan('dev'));

// routes
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, description, tech_stack, links, tags, created_at FROM projects ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// route for single project 
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, title, description, tech_stack, links, tags, created_at FROM projects WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// route for GET /api/blog (all blog posts)
app.get('/api/blog', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, content, excerpt, tags, published_at, updated_at FROM blog_posts ORDER BY published_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// route for GET /api/blog/:id (single blog post)

app.get('/api/blog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, title, content, excerpt, tags, published_at, updated_at FROM blog_posts WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching blog post:', err);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// POST login endpoint 
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // find user in database
    const result = await pool.query(
      'SELECT id, username, password_hash FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // compare password with bcrypt
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // return token
    res.json({ token, username: user.username });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// admin routes (protected with JWT)

// POST /admin/projects - create new project
app.post('/admin/projects', authenticateToken, async (req, res) => {
  try {
    const { title, description, tech_stack, links, tags } = req.body;

    const result = await pool.query('INSERT INTO projects (title, description, tech_stack, links, tags) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [title, description, tech_stack, links, tags]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /admin/projects/:id - update existing project
app.put('/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tech_stack, links, tags } = req.body;

    const result = await pool.query('UPDATE projects SET title = $1, description = $2, tech_stack = $3, links = $4, tags = $5 WHERE id = $6 RETURNING *', [title, description, tech_stack, links, tags, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /admin/projects/:id - delete project
app.delete('/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 RETURNING id, title', [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted succesfully', project: result.rows[0] });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});


// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


