const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate");
const session = require('express-session')



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


app.use('/', require('./routes/rooms'))
app.use('/', require('./routes/posts'))
app.use('/clubs', require('./routes/clubs'))
app.use("/calendar", require("./routes/calendar"));
app.use(session({
  secret: 'campuslivesecret',
  resave: false,
  saveUninitialized: false
}))



//home route
app.get("/",(req,res)=>{
   res.render("home.ejs");
});

app.listen(8080,()=>{
    console.log("app is listening on port 8080");
});
