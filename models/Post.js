const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["general", "cab", "food", "resell", "lost"],
    required: true
  },

  postedBy: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  // common optional fields
  title: String,
  description: String,

  // cab specific
  destination: String,
  leavingAt: String,
  seatsAvailable: Number,

  // food specific
  location: String,

  // resell specific
  itemName: String,
  price: Number,
  condition: String,

  // lost/found
  itemStatus: String
});

module.exports = mongoose.model("Post", postSchema);