// API configuration
// In production (Cloudflare Pages), use the production backend URL
// In development, use localhost

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://backend-damp-pine-5759.fly.dev'
  : 'http://localhost:5000';

export default API_URL;
