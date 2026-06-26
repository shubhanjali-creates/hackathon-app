const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['food', 'cab', 'resell', 'lost'],
    required: true
  },

  // shared fields
  postedBy:  { type: String, required: true },
  details:   { type: String },

  // food splits
  title:     { type: String },
  location:  { type: String },

  // cab splits
  destination:     { type: String },
  leavingAt:       { type: String },
  seatsAvailable:  { type: Number },

  // resell
  itemName:   { type: String },
  price:      { type: Number },
  condition:  { type: String },

  // lost and found
  itemName:  { type: String },
  type2:     { type: String },

  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Room', roomSchema)