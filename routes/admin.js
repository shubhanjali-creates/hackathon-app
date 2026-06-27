const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Student = require("../models/student");
const Club = require("../models/Club");
const Complaint = require("../models/Complaint");
const DirectMessage = require("../models/DirectMessage");
const { isAdmin, appointClubLeader } = require("../middleware/roles");

router.use(isAdmin);

// Admin dashboard
router.get("/", async (req, res) => {
  try {
    const [postCount, complaintCount, studentCount, clubCount, clubs, recentComplaints] =
      await Promise.all([
        Room.countDocuments(),
        Complaint.countDocuments(),
        Student.countDocuments({ role: "student" }),
        Club.countDocuments(),
        Club.find().populate("leaderId", "name rollNumber email"),
        Complaint.find().sort({ createdAt: -1 }).limit(5),
      ]);

    res.render("admin/dashboard", {
      postCount,
      complaintCount,
      studentCount,
      clubCount,
      clubs,
      recentComplaints,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading admin dashboard");
  }
});

// Appoint club leaders
router.get("/appoint", async (req, res) => {
  try {
    const students = await Student.find({ role: "student" }).sort({ name: 1 });
    const clubs = await Club.find().populate("leaderId", "name rollNumber");
    res.render("admin/appoint", { students, clubs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading appointment page");
  }
});

router.post("/appoint", async (req, res) => {
  try {
    const { studentId, clubId } = req.body;
    if (!studentId || !clubId) {
      return res.status(400).send("Student and club are required");
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).send("Student not found");
    if (student.role === "admin") {
      return res.status(400).send("Admins cannot be appointed as club leaders.");
    }

    await appointClubLeader(studentId, clubId);
    res.redirect("/admin/appoint?success=1");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error appointing club leader");
  }
});

router.post("/remove-leader/:clubId", async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);
    if (!club || !club.leaderId) return res.redirect("/admin/appoint");

    await Student.findByIdAndUpdate(club.leaderId, {
      role: "student",
      clubId: null,
    });
    await Club.findByIdAndUpdate(club._id, { leaderId: null });
    res.redirect("/admin/appoint?removed=1");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error removing club leader");
  }
});

// View all complaints (admin sees real names)
router.get("/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("studentId", "name email rollNumber")
      .sort({ createdAt: -1 });
    res.render("admin/complaints", { complaints });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading complaints");
  }
});

// Send direct message to a student
router.get("/message/:studentId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).send("Student not found");

    const complaintId = req.query.complaint || null;
    let complaint = null;
    if (complaintId) {
      complaint = await Complaint.findById(complaintId);
    }

    res.render("admin/message", { student, complaint });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading message form");
  }
});

router.post("/message", async (req, res) => {
  try {
    const { toStudentId, subject, content, relatedComplaintId } = req.body;
    const student = await Student.findById(toStudentId);
    if (!student) return res.status(404).send("Student not found");

    await DirectMessage.create({
      fromAdminId: req.session.studentId,
      fromAdminName: req.session.studentName,
      toStudentId: student._id,
      toStudentName: student.name,
      subject,
      content,
      relatedComplaintId: relatedComplaintId || undefined,
    });

    res.redirect("/admin/complaints?sent=1");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending message");
  }
});

// Delete any post
router.delete("/rooms/:id", async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    const redirect = req.body.redirect || req.query.redirect || "/";
    res.redirect(redirect);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting post");
  }
});

// Pin / unpin a post
router.post("/rooms/:id/pin", async (req, res) => {
  try {
    const post = await Room.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    post.pinned = !post.pinned;
    post.pinnedAt = post.pinned ? new Date() : null;
    post.pinnedBy = post.pinned ? req.session.studentName : null;
    await post.save();

    const redirect = req.body.redirect || "/";
    res.redirect(redirect);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error pinning post");
  }
});

module.exports = router;
