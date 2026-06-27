const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");
const upload = require("../middleware/upload");
const { getImageUrl } = require("../utils/postHelpers");

function handleUploadError(err, req, res, next) {
  if (err) {
    console.error(err);
    return res.status(400).send(err.message || "Upload failed");
  }
  next();
}

router.get("/", async (req, res) => {
  try {
    const posts = await Complaint.find().sort({ createdAt: -1 });
    res.render("complaints", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading complaints");
  }
});

router.post("/", upload.single("image"), handleUploadError, async (req, res) => {
  try {
    const newComplaint = new Complaint({
      complaintCategory: req.body.complaintCategory,
      complaintTitle: req.body.complaintTitle,
      details: req.body.details,
      postedBy: req.session.studentName,
      studentId: req.session.studentId,
      imageUrl: getImageUrl(req.file),
    });

    await newComplaint.save();
    res.redirect("/complaints");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving complaint");
  }
});

router.post("/:id/resolve", async (req, res) => {
  if (req.session.role !== "student") {
    return res.status(403).send("Only students can mark complaints as resolved.");
  }

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).send("Complaint not found");

    if (!complaint.studentId || complaint.studentId.toString() !== req.session.studentId) {
      return res.status(403).send("You can only resolve your own complaints.");
    }

    if (complaint.resolved) {
      return res.redirect("/complaints");
    }

    complaint.resolved = true;
    complaint.resolvedAt = new Date();
    await complaint.save();

    res.redirect("/complaints?resolved=1");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error resolving complaint");
  }
});

module.exports = router;
