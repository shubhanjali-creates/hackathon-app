const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name:           { type: String },
  rollNumber:     { type: String, required: true },
  email:          { type: String, required: true },
  graduationYear: { type: Number },
  branch:         { type: String }
});

module.exports = mongoose.model('Student', studentSchema);