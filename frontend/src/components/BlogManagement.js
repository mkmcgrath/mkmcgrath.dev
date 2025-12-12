import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminManagement.css';

function BlogManagement() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
  });

  // Fetch all blog posts
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blog');
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to load blog posts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
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
      content: '',
      excerpt: '',
      tags: '',
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      tags: post.tags ? post.tags.join(', ') : '',
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
    const postData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
    };

    try {
      const url = editingPost
        ? `http://localhost:5000/admin/blog/${editingPost.id}`
        : 'http://localhost:5000/admin/blog';

      const response = await fetch(url, {
        method: editingPost ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save blog post');
      }

      setSuccess(editingPost ? 'Blog post updated successfully!' : 'Blog post created successfully!');
      resetForm();
      fetchPosts(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/admin/blog/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete blog post');
      }

      setSuccess('Blog post deleted successfully!');
      fetchPosts(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="management-loading">Loading blog posts...</div>;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Blog Post Management</h2>
        {!showForm && (
          <button onClick={handleCreate} className="btn-primary">
            + New Post
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="form-container">
          <div className="form-header">
            <h3>{editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
            <button onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="title">Post Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="My Blog Post Title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="excerpt">Excerpt *</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="A brief summary of the post..."
                rows="3"
                required
              />
              <small>This will be shown in the blog listing page</small>
            </div>

            <div className="form-group">
              <label htmlFor="content">Content * (Markdown supported)</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="# Your blog post content here...&#10;&#10;You can use **markdown** formatting!"
                rows="15"
                required
                className="markdown-editor"
              />
              <small>Write your content using Markdown syntax</small>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="javascript, react, tutorial"
              />
              <small>Separate tags with commas</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingPost ? 'Update Post' : 'Create Post'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="items-list">
        <h3>Existing Posts ({posts.length})</h3>
        {posts.length === 0 ? (
          <p className="empty-state">No blog posts yet. Create your first post!</p>
        ) : (
          <div className="items-grid">
            {posts.map((post) => (
              <div key={post.id} className="item-card">
                <div className="item-content">
                  <h4>{post.title}</h4>
                  <p className="item-date">{formatDate(post.published_at)}</p>
                  <p className="item-description">{post.excerpt}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="tags">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="item-actions">
                  <button onClick={() => handleEdit(post)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="btn-delete">
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

export default BlogManagement;
