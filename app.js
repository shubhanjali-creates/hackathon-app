const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate");
const session = require('express-session')
// 1. At the top — new requires


const authRoutes = require('./routes/auth');



const MONGO_URL = 'mongodb://127.0.0.1:27017/hackathon-app';
main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect(MONGO_URL);

  
};
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);




app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use((req, res, next) => {
  res.locals.currentStudent = req.session.studentName || null;
  next();
});
app.use('/', authRoutes);
//home route
// 5. Middleware to protect all other routes
const isLoggedIn = (req, res, next) => {
  if (req.session.studentId) return next();
  res.redirect('/login');
};
app.use(isLoggedIn);  // everything defined AFTER this line is protected
app.use('/', require('./routes/rooms'))
app.use('/', require('./routes/posts'))
app.use('/clubs', require('./routes/clubs'))
app.use("/calendar", require("./routes/calendar"));

app.listen(8080,()=>{
    console.log("app is listening on port 8080");
});
