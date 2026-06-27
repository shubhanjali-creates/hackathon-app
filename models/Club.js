const mongoose = require('mongoose')

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  emoji: {
    type: String
  },
  description: {
    type: String
  },
  color: {
    type: String,
    default: '#ffc107'
  },
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Club', clubSchema)