const fs = require("fs");
const path = require("path");
const Room = require("../models/Room");

async function deleteExpiredPosts() {
  const expired = await Room.find({
    type: { $in: ["food", "cab"] },
    expiresAt: { $lte: new Date() },
  });

  for (const post of expired) {
    if (post.imageUrl) {
      const filePath = path.join(__dirname, "../public", post.imageUrl);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete image:", filePath, err.message);
      }
    }
  }

  const result = await Room.deleteMany({
    type: { $in: ["food", "cab"] },
    expiresAt: { $lte: new Date() },
  });

  if (result.deletedCount > 0) {
    console.log(`Auto-deleted ${result.deletedCount} expired food/cab post(s).`);
  }
}

function startExpiredPostCleanup(intervalMs = 60 * 1000) {
  deleteExpiredPosts().catch((err) => console.error("Expired post cleanup error:", err));
  return setInterval(() => {
    deleteExpiredPosts().catch((err) => console.error("Expired post cleanup error:", err));
  }, intervalMs);
}

module.exports = { deleteExpiredPosts, startExpiredPostCleanup };
