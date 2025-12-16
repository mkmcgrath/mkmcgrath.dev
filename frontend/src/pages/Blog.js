import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';
import API_URL from '../config';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blog`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <span className="loading-text">Loading blog posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Blog Posts</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Blog</h1>
        <p className="blog-subtitle">
          Thoughts on web development, technology, and more
        </p>
      </div>

      <div className="blog-posts">
        {posts.map((post) => (
          <article key={post.id} className="blog-post-card">
            <div className="post-header">
              <h2 className="post-title">
                <Link to={`/blog/${post.id}`}>{post.title}</Link>
              </h2>
              <time className="post-date">{formatDate(post.published_at)}</time>
            </div>

            <p className="post-excerpt">{post.excerpt}</p>

            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}

            <Link to={`/blog/${post.id}`} className="read-more">
              Read more <span>→</span>
            </Link>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="no-posts">
          <p>No blog posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

export default Blog;
