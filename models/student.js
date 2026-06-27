const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name:           { type: String },
  rollNumber:     { type: String, required: true },
  email:          { type: String, required: true },
  graduationYear: { type: Number },
  branch:         { type: String },

  // Role-based access control.
  // 'student' = default, can post/join rooms/raise complaints/view events
  // 'club'    = verified org account, can post official content + create events + embed forms
  // 'admin'   = platform-level control, moderates content/users/complaints, creates events for students
  role: {
    type: String,
    enum: ['student', 'club', 'admin'],
    default: 'student',
    required: true
  },

  // Set when role is 'club' — which club this student leads
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    default: null
  }
});

module.exports = mongoose.model('Student', studentSchema);