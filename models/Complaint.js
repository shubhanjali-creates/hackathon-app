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
  imageUrl: String,
  postedBy: {
    type: String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  resolvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Complaint", complaintSchema);