const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user.route');
const postRoutes = require('./routes/post.route');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Body parser middleware for JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static documentation & testing dashboard
app.use(express.static(path.join(__dirname, '../public')));

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Backend Tutorial REST API',
    endpoints: {
      users: '/api/users',
      posts: '/api/posts',
      docs: '/docs'
    }
  });
});

// Dedicated route for testing dashboard
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/test-dashboard.html'));
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// 404 handler for undefined routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
