const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  postedBy: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    enum: ['general', 'food', 'cab', 'resell', 'lost'],
    default: 'general'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Post', postSchema)