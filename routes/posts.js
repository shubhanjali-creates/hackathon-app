const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

const postSort = { pinned: -1, pinnedAt: -1, createdAt: -1 };

// ================= HOME FEED (optional use) =================
router.get("/home", async (req, res) => {
  try {
    const posts = await Room.find({}).sort(postSort);
    res.render("home", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading home page");
  }
});

router.post("/home", async (req, res) => {
  try {
    await Room.create({
      type: req.body.tag || "general",
      postedBy: req.session.studentName,
      details: req.body.content,
    });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// ================= CAB SPLITS =================
router.get("/cab-splits", async (req, res) => {
  try {
    const posts = await Room.find({ type: "cab" }).sort(postSort);
    res.render("cab-splits", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading cab splits");
  }
});

router.post("/cab-splits", async (req, res) => {
  try {
    await Room.create({
      type: "cab",
      destination: req.body.destination,
      leavingAt: req.body.leavingAt,
      seatsAvailable: req.body.seatsAvailable,
      postedBy: req.session.studentName,
      details: req.body.details,
    });
    res.redirect("/cab-splits");
  } catch (err) {
    console.error(err);
    res.redirect("/cab-splits");
  }
});

// ================= FOOD SPLITS =================
router.get("/food-splits", async (req, res) => {
  try {
    const posts = await Room.find({ type: "food" }).sort(postSort);
    res.render("food-splits", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading food splits");
  }
});

router.post("/food-splits", async (req, res) => {
  try {
    await Room.create({
      type: "food",
      title: req.body.title,
      location: req.body.location,
      postedBy: req.session.studentName,
      details: req.body.details,
    });
    res.redirect("/food-splits");
  } catch (err) {
    console.error(err);
    res.redirect("/food-splits");
  }
});

// ================= RESELL =================
router.get("/resell", async (req, res) => {
  try {
    const posts = await Room.find({ type: "resell" }).sort(postSort);
    res.render("resell", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading resell listings");
  }
});

router.post("/resell", async (req, res) => {
  try {
    await Room.create({
      type: "resell",
      itemName: req.body.itemName,
      price: req.body.price,
      condition: req.body.condition,
      postedBy: req.session.studentName,
      details: req.body.details,
    });
    res.redirect("/resell");
  } catch (err) {
    console.error(err);
    res.redirect("/resell");
  }
});

// ================= LOST & FOUND =================
router.get("/lost-and-found", async (req, res) => {
  try {
    const posts = await Room.find({ type: "lost" }).sort(postSort);
    res.render("lost-and-found", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading lost and found");
  }
});

router.post("/lost-and-found", async (req, res) => {
  try {
    await Room.create({
      type: "lost",
      itemStatus: req.body.type,
      itemName: req.body.itemName,
      location: req.body.location,
      postedBy: req.session.studentName,
      details: req.body.details,
    });
    res.redirect("/lost-and-found");
  } catch (err) {
    console.error(err);
    res.redirect("/lost-and-found");
  }
});

module.exports = router;