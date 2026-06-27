const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");

// ROUTES
const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");
const postsRoutes = require("./routes/posts");
const clubsRoutes = require("./routes/clubs");
const calendarRoutes = require("./routes/calendar");
const adminRoutes = require("./routes/admin");
const messagesRoutes = require("./routes/messages");
const DirectMessage = require("./models/DirectMessage");

// MODEL
const Room = require("./models/Room");
const { ensureDatabaseSeeded } = require("./init/bootstrap");
const { startExpiredPostCleanup } = require("./services/expiredPosts");

// ---------------- DB CONNECT ----------------
const MONGO_URL =
  process.env.ATLAS_URL || "mongodb://127.0.0.1:27017/hackathon-app";

mongoose
  .connect(MONGO_URL)
  .then(async () => {
    console.log("connected to DB");
    await ensureDatabaseSeeded();
    startExpiredPostCleanup();
  })
  .catch((err) => console.log("DB Error:", err));

// ---------------- VIEW ENGINE ----------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ---------------- MIDDLEWARES ----------------
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(methodOverride("_method"));

// ---------------- SESSION ----------------
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ---------------- GLOBAL VARIABLES ----------------
app.use(async (req, res, next) => {
  res.locals.currentStudent = req.session.studentName || null;
  res.locals.currentStudentId = req.session.studentId || null;
  res.locals.currentRole = req.session.role || null;
  res.locals.currentClubId = req.session.clubId || null;
  res.locals.unreadCount = 0;

  if (req.session.studentId) {
    try {
      res.locals.unreadCount = await DirectMessage.countDocuments({
        toStudentId: req.session.studentId,
        read: false,
      });
    } catch (err) {
      console.error(err);
    }
  }
  next();
});

// ---------------- AUTH MIDDLEWARE ----------------
const isLoggedIn = (req, res, next) => {
  if (req.session.studentId) return next();
  return res.redirect("/login");
};

// ---------------- ROUTES ----------------
app.use("/", authRoutes);

// HOME PAGE
app.get("/", isLoggedIn, async (req, res) => {
  try {
    const activeHashtag = (req.query.hashtag || "").trim().toLowerCase().replace(/^#/, "");
    const query = {};
    if (activeHashtag) {
      query.hashtags = activeHashtag;
    }

    const posts = await Room.find(query).sort({
      pinned: -1,
      pinnedAt: -1,
      createdAt: -1,
    });

    const popularHashtags = await Room.aggregate([
      { $unwind: "$hashtags" },
      { $group: { _id: "$hashtags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 24 },
      { $project: { tag: "$_id", count: 1, _id: 0 } },
    ]);

    res.render("home", { posts, activeHashtag, popularHashtags });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading home page");
  }
});

// PROTECTED ROUTES
app.use(isLoggedIn);

app.use("/complaints", complaintRoutes);
app.use("/", postsRoutes);
app.use("/clubs", clubsRoutes);
app.use("/calendar", calendarRoutes);
app.use("/admin", adminRoutes);
app.use("/inbox", messagesRoutes);

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});