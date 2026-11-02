const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Protected routes (Authentication required)
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;

