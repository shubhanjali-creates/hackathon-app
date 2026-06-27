const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["cab", "food", "resell", "lost"],
    required: true
  },

  title: String,
  description: String,

  postedBy: {
    type: String,
    required: true
  },

  // Cab specific
  leavingAt: String,
  seatsAvailable: Number,
  destination: String,

  // Food specific
  location: String,

  // Resell specific
  price: Number,
  condition: String,

  // Lost & Found
  itemName: String,
  itemStatus: { type: String, enum: ["Lost", "Found"] },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", postSchema);