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

// MODEL (IMPORTANT: SINGLE SOURCE OF TRUTH)
const Room = require("./models/Room");

const MONGO_URL = "mongodb://127.0.0.1:27017/hackathon-app";

// ---------------- DB CONNECT ----------------
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

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
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

// ---------------- GLOBAL VARIABLES ----------------
app.use(async (req, res, next) => {
  res.locals.currentStudent = req.session.studentName || null;
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

// ---------------- LOGIN MIDDLEWARE ----------------
const isLoggedIn = (req, res, next) => {
  if (req.session.studentId) return next();
  return res.redirect("/login");
};

// ---------------- PUBLIC ROUTES ----------------
app.use("/", authRoutes);
app.use("/complaints", complaintRoutes);

// ---------------- HOME PAGE (ALL POSTS) ----------------
app.get("/", isLoggedIn, async (req, res) => {
  try {
    const posts = await Room.find({}).sort({ pinned: -1, pinnedAt: -1, createdAt: -1 });

    res.render("home", { posts });
  } catch (err) {
    console.log(err);
    res.send("Error loading home page");
  }
});

// ---------------- PROTECTED ROUTES ----------------
app.use(isLoggedIn);

// ROOM + SPLIT ROUTES
app.use("/", postsRoutes);

// OTHER MODULES
app.use("/clubs", clubsRoutes);
app.use("/calendar", calendarRoutes);
app.use("/admin", adminRoutes);
app.use("/inbox", messagesRoutes);

// ---------------- SERVER ----------------
app.listen(8080, () => {
  console.log("app is listening on port 8080");
});