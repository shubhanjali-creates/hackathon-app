const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["general", "food", "cab", "resell", "lost", "complaint"],
    required: true,
  },

  postedBy: {
    type: String,
    required: true,
  },

  title: String,
  details: String,

  hashtags: {
    type: [String],
    default: [],
  },

  imageUrl: String,

  expiresAt: Date,
  lifespanMinutes: Number,

  // ---------------- FOOD SPLITS ----------------
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
  itemStatus: String,
  type2: String,

  // ---------------- COMPLAINTS (legacy) ----------------
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

roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
roomSchema.index({ hashtags: 1 });

module.exports = mongoose.model("Room", roomSchema);
