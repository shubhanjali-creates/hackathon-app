const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // stored as "HH:MM", e.g. "14:30"
  },
  endTime: {
    type: String,
  },
  location: {
    type: String,
    trim: true,
  },
  club: {
    type: String, // organizing club name, optional free text
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);