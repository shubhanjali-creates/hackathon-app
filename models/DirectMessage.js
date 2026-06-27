const mongoose = require("mongoose");

const directMessageSchema = new mongoose.Schema({
  fromAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  fromAdminName: { type: String, required: true },
  toStudentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  toStudentName: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  relatedComplaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint",
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DirectMessage", directMessageSchema);
