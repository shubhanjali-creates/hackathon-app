const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// 'User' becomes the collection name 'users' in MongoDB automatically
module.exports = mongoose.model('User', userSchema)