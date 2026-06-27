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
const roomsRoutes = require("./routes/rooms");
const postsRoutes = require("./routes/posts");
const clubsRoutes = require("./routes/clubs");
const calendarRoutes = require("./routes/calendar");

// MODEL
const Post = require("./models/Post");

const MONGO_URL = "mongodb://127.0.0.1:27017/hackathon-app";

// DB CONNECT
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

// VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// SESSION
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

// GLOBAL VARIABLES FOR EJS
app.use((req, res, next) => {
  res.locals.currentStudent = req.session.studentName || null;
  res.locals.currentRole = req.session.role || null;
  next();
});

// LOGIN MIDDLEWARE
const isLoggedIn = (req, res, next) => {
  if (req.session.studentId) return next();
  return res.redirect("/login");
};

// -------------------- ROUTES --------------------

// PUBLIC ROUTES
app.use("/", authRoutes);
app.use("/complaints", complaintRoutes);

// HOME ROUTE (GENERAL FEED)
app.get("/", isLoggedIn, async (req, res) => {
  try {
    const posts = await Post.find({ tag: "general" }).sort({
      createdAt: -1,
    });

    res.render("home", { posts });
  } catch (err) {
    console.log(err);
    res.send("Error loading home page");
  }
});

// PROTECTED ROUTES (ALL AFTER LOGIN)
app.use(isLoggedIn);

app.use("/", roomsRoutes);
app.use("/", postsRoutes);
app.use("/clubs", clubsRoutes);
app.use("/calendar", calendarRoutes);

// -------------------- SERVER --------------------
app.listen(8080, () => {
  console.log("app is listening on port 8080");
});