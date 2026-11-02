const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a post title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a post description'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters long']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author reference is required']
    }
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
