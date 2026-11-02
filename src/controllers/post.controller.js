const mongoose = require('mongoose');
const Post = require('../models/post.model');

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private (Authenticated users only)
 */
const createPost = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    // Validate request body
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and description for the post.'
      });
    }

    // Create post associated with logged-in user
    const post = await Post.create({
      title,
      description,
      author: req.user._id
    });

    // Populate author details (excluding sensitive info)
    await post.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  Public
 */
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid post ID format: ${id}`
      });
    }

    const post = await Post.findById(id).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post not found with ID: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a post by ID
 * @route   PUT /api/posts/:id
 * @access  Private (Owner only)
 */
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid post ID format: ${id}`
      });
    }

    // Validate that at least one field is provided for update
    if (!title && !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a title or description to update.'
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post not found with ID: ${id}`
      });
    }

    // Check ownership: ensure logged-in user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to update this post. Only the author can update their post.'
      });
    }

    // Apply updates
    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;

    const updatedPost = await post.save();
    await updatedPost.populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a post by ID
 * @route   DELETE /api/posts/:id
 * @access  Private (Owner only)
 */
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid post ID format: ${id}`
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post not found with ID: ${id}`
      });
    }

    // Check ownership: ensure logged-in user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to delete this post. Only the author can delete their post.'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: {
        id: post._id
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};

