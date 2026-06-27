const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["general", "food", "cab", "resell", "lost", "complaint"],
    required: true,
  },

  // Shared fields
  postedBy: {
    type: String,
    required: true,
  },

  details: String,

  // ---------------- FOOD SPLITS ----------------
  title: String,
  location: String,

  // ---------------- CAB SPLITS ----------------
  destination: String,
  leavingAt: String,
  seatsAvailable: Number,

  // ---------------- RESELL ----------------
  itemName: String,
  price: Number,
  condition: String,

  // ---------------- LOST & FOUND ----------------
  type2: String,

  // ---------------- COMPLAINTS ----------------
  complaintCategory: {
    type: String,
    enum: [
      "Academic",
      "Hostel",
      "Mess",
      "Library",
      "Campus Facilities",
      "Safety",
      "Sports",
      "Other",
    ],
  },

  complaintTitle: String,

  anonymous: {
    type: Boolean,
    default: false,
  },

  pinned: {
    type: Boolean,
    default: false,
  },
  pinnedAt: Date,
  pinnedBy: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", roomSchema);