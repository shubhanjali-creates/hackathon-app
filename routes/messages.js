const express = require("express");
const router = express.Router();
const DirectMessage = require("../models/DirectMessage");

// Student inbox — messages from admins
router.get("/", async (req, res) => {
  try {
    const messages = await DirectMessage.find({
      toStudentId: req.session.studentId,
    }).sort({ createdAt: -1 });

    res.render("inbox", { messages });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading inbox");
  }
});

router.post("/:id/read", async (req, res) => {
  try {
    await DirectMessage.findOneAndUpdate(
      { _id: req.params.id, toStudentId: req.session.studentId },
      { read: true }
    );
    res.redirect("/inbox");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating message");
  }
});

module.exports = router;
