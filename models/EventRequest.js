const mongoose = require("mongoose");

const eventRequestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  date: { type: Date, required: true },
  startTime: String,
  endTime: String,
  location: { type: String, trim: true },
  club: { type: String, trim: true },
  requestedBy: { type: String, required: true },
  requestedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  reviewedBy: String,
  reviewNote: String,
  reviewedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EventRequest", eventRequestSchema);
