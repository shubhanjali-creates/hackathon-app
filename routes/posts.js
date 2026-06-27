const express = require("express");
const router = express.Router();

const Post = require("../models/Post");


// ================= CAB SPLITS =================
router.get("/cab-splits", async (req, res) => {
  const posts = await Post.find({ type: "cab" });
  res.render("cabSplits", { posts });
});

router.post("/cab-splits", async (req, res) => {
  await Post.create({
    type: "cab",
    destination: req.body.destination,
    leavingAt: req.body.leavingAt,
    seatsAvailable: req.body.seatsAvailable,
    postedBy: req.body.postedBy,
    description: req.body.details
  });

  res.redirect("/cab-splits");
});


// ================= FOOD SPLITS =================
router.get("/food-splits", async (req, res) => {
  const posts = await Post.find({ type: "food" });
  res.render("foodSplits", { posts });
});

router.post("/food-splits", async (req, res) => {
  await Post.create({
    type: "food",
    title: req.body.title,
    location: req.body.location,
    postedBy: req.body.postedBy,
    description: req.body.details
  });

  res.redirect("/food-splits");
});


// ================= LOST & FOUND =================
router.get("/lost-and-found", async (req, res) => {
  const posts = await Post.find({ type: "lost" });
  res.render("lostFound", { posts });
});

router.post("/lost-and-found", async (req, res) => {
  await Post.create({
    type: "lost",
    itemStatus: req.body.type,
    itemName: req.body.itemName,
    location: req.body.location,
    postedBy: req.body.postedBy,
    description: req.body.details
  });

  res.redirect("/lost-and-found");
});


// ================= RESELL =================
router.get("/resell", async (req, res) => {
  const posts = await Post.find({ type: "resell" });
  res.render("resell", { posts });
});

router.post("/resell", async (req, res) => {
  await Post.create({
    type: "resell",
    itemName: req.body.itemName,
    price: req.body.price,
    condition: req.body.condition,
    postedBy: req.body.postedBy,
    description: req.body.details
  });

  res.redirect("/resell");
});

module.exports = router;