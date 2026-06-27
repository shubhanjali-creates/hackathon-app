const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");

// Show complaints page
router.get("/", async (req, res) => {
  try {
    const posts = await Complaint.find().sort({ createdAt: -1 });
    res.render("complaints", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading complaints");
  }
});

// Submit complaint


router.post("/", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const newComplaint = new Complaint({
      complaintCategory: req.body.complaintCategory,
      complaintTitle: req.body.complaintTitle,
      details: req.body.details,
      postedBy: req.session.studentName,
      studentId: req.session.studentId,
    });

    await newComplaint.save();

    res.redirect("/complaints");

  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving complaint");
  }
});
module.exports = router;