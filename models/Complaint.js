const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  complaintCategory: {
    type: String,
    required: true,
  },
  complaintTitle: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  postedBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Complaint", complaintSchema);