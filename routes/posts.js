const express = require("express");
const router = express.Router();
const Room = require("../models/Room");


// ================= HOME FEED (optional use) =================
router.get("/home", async (req, res) => {
  const posts = await Room.find({}).sort({ createdAt: -1 });
  res.render("home", { posts });
});

router.post("/home", async (req, res) => {
  try {
    await Room.create({
      type: req.body.tag || "general",
      postedBy: req.session.studentName,
      details: req.body.content
    });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});


// ================= CAB SPLITS =================
router.get("/cab-splits", async (req, res) => {
  const posts = await Room.find({ type: "cab" }).sort({ pinned: -1, pinnedAt: -1, createdAt: -1 });
  res.render("cab-splits", { posts });
});

router.post("/cab-splits", async (req, res) => {
  await Room.create({
    type: "cab",
    destination: req.body.destination,
    leavingAt: req.body.leavingAt,
    seatsAvailable: req.body.seatsAvailable,
    postedBy: req.session.studentName,
    description: req.body.details
  });

  res.redirect("/cab-splits");
});


// ================= FOOD SPLITS =================
router.get("/food-splits", async (req, res) => {
  const posts = await Room.find({ type: "food" }).sort({ pinned: -1, pinnedAt: -1, createdAt: -1 });
  res.render("food-splits", { posts });
});

router.post("/food-splits", async (req, res) => {
  await Room.create({
    type: "food",
    title: req.body.title,
    location: req.body.location,
    postedBy: req.session.studentName,
    description: req.body.details
  });

  res.redirect("/food-splits");
});


// ================= RESELL =================
router.get("/resell", async (req, res) => {
  const posts = await Room.find({ type: "resell" }).sort({ pinned: -1, pinnedAt: -1, createdAt: -1 });
  res.render("resell", { posts });
});

router.post("/resell", async (req, res) => {
  await Room.create({
    type: "resell",
    itemName: req.body.itemName,
    price: req.body.price,
    condition: req.body.condition,
    postedBy: req.session.studentName,
    description: req.body.details
  });

  res.redirect("/resell");
});


// ================= LOST & FOUND =================
router.get("/lost-and-found", async (req, res) => {
  const posts = await Room.find({ type: "lost" }).sort({ pinned: -1, pinnedAt: -1, createdAt: -1 });
  res.render("lost-and-found", { posts });
});

router.post("/lost-and-found", async (req, res) => {
  await Room.create({
    type: "lost",
    itemStatus: req.body.type,
    itemName: req.body.itemName,
    location: req.body.location,
    postedBy: req.session.studentName,
    description: req.body.details
  });

  res.redirect("/lost-and-found");
});

module.exports = router;