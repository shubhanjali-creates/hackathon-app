const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const upload = require("../middleware/upload");
const {
  validatePostFields,
  classifyIntentFromHashtags,
  computeExpiresAtFromMinutes,
  activeTimedPostFilter,
  extractPostInput,
} = require("../utils/postHelpers");

const postSort = { pinned: -1, pinnedAt: -1, createdAt: -1 };

function handleUploadError(err, req, res, next) {
  if (err) {
    console.error(err);
    return res.status(400).send(err.message || "Upload failed");
  }
  next();
}

function buildPostOrError(req, typeOverride, extra = {}) {
  const { title, description, hashtags, imageUrl } = extractPostInput(req);
  const validationError = validatePostFields({
    title,
    description,
    hashtags,
    imageUrl,
  });
  if (validationError) return { error: validationError };

  const type = typeOverride || classifyIntentFromHashtags(hashtags);

  return {
    data: {
      type,
      title,
      details: description,
      hashtags,
      imageUrl,
      postedBy: req.session.studentName,
      ...extra,
    },
  };
}

router.get("/home", async (req, res) => {
  try {
    const posts = await Room.find({}).sort(postSort);
    res.render("home", { posts, activeHashtag: null, popularHashtags: [] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading home page");
  }
});

router.post("/home", upload.single("image"), handleUploadError, async (req, res) => {
  try {
    const result = buildPostOrError(req);
    if (result.error) return res.status(400).send(result.error);

    const type = result.data.type;
    if (type === "food" || type === "cab") {
      const { expiresAt, lifespanMinutes } = computeExpiresAtFromMinutes(
        req.body.lifespanMinutes
      );
      result.data.expiresAt = expiresAt;
      result.data.lifespanMinutes = lifespanMinutes;
    }

    await Room.create(result.data);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

router.get("/cab-splits", async (req, res) => {
  try {
    const posts = await Room.find({
      type: "cab",
      ...activeTimedPostFilter(),
    }).sort(postSort);
    res.render("cab-splits", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading cab splits");
  }
});

router.post("/cab-splits", upload.single("image"), handleUploadError, async (req, res) => {
  try {
    const { expiresAt, lifespanMinutes } = computeExpiresAtFromMinutes(
      req.body.lifespanMinutes
    );
    const result = buildPostOrError(req, "cab", {
      destination: req.body.destination,
      leavingAt: req.body.leavingAt,
      seatsAvailable: req.body.seatsAvailable,
      expiresAt,
      lifespanMinutes,
    });
    if (result.error) return res.status(400).send(result.error);

    await Room.create(result.data);
    res.redirect("/cab-splits");
  } catch (err) {
    console.error(err);
    res.redirect("/cab-splits");
  }
});

router.get("/food-splits", async (req, res) => {
  try {
    const posts = await Room.find({
      type: "food",
      ...activeTimedPostFilter(),
    }).sort(postSort);
    res.render("food-splits", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading food splits");
  }
});

router.post("/food-splits", upload.single("image"), handleUploadError, async (req, res) => {
  try {
    const { expiresAt, lifespanMinutes } = computeExpiresAtFromMinutes(
      req.body.lifespanMinutes
    );
    const result = buildPostOrError(req, "food", {
      location: req.body.location,
      expiresAt,
      lifespanMinutes,
    });
    if (result.error) return res.status(400).send(result.error);

    await Room.create(result.data);
    res.redirect("/food-splits");
  } catch (err) {
    console.error(err);
    res.redirect("/food-splits");
  }
});

router.get("/resell", async (req, res) => {
  try {
    const posts = await Room.find({ type: "resell" }).sort(postSort);
    res.render("resell", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading resell listings");
  }
});

router.post("/resell", upload.single("image"), handleUploadError, async (req, res) => {
  try {
    const result = buildPostOrError(req, "resell", {
      itemName: (req.body.title || "").trim(),
      price: req.body.price,
      condition: req.body.condition,
    });
    if (result.error) return res.status(400).send(result.error);

    await Room.create(result.data);
    res.redirect("/resell");
  } catch (err) {
    console.error(err);
    res.redirect("/resell");
  }
});

router.get("/lost-and-found", async (req, res) => {
  try {
    const posts = await Room.find({ type: "lost" }).sort(postSort);
    res.render("lost-and-found", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading lost and found");
  }
});

router.post("/lost-and-found", upload.single("image"), handleUploadError, async (req, res) => {
  try {
    const title = (req.body.title || req.body.itemName || "").trim();
    req.body.title = title;
    const result = buildPostOrError(req, "lost", {
      itemName: title,
      itemStatus: req.body.type,
      location: req.body.location,
    });
    if (result.error) return res.status(400).send(result.error);

    await Room.create(result.data);
    res.redirect("/lost-and-found");
  } catch (err) {
    console.error(err);
    res.redirect("/lost-and-found");
  }
});

module.exports = router;
