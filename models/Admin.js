const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  clubName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Leader', 'Admin'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Admin', adminSchema)