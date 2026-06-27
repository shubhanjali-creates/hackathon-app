const mongoose = require('mongoose')

const clubMessageSchema = new mongoose.Schema({
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  pinned: {
    type: Boolean,
    default: false
  },
  pinnedAt: Date,
  pinnedBy: String
})

module.exports = mongoose.model('ClubMessage', clubMessageSchema)