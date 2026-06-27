require("dotenv").config();
const mongoose = require("mongoose");
const initdata = require("./students.js");
const Student = require("../models/student.js");

const MONGO_URL =
  process.env.ATLAS_URL || "mongodb://127.0.0.1:27017/hackathon-app";
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
 const initDB = async ()=> {
    await Student.deleteMany({});

    await Student.insertMany(
      initdata.data.map((s) => ({ ...s, role: "student", clubId: null }))
    );
    console.log("Student data was initialised");
 };
 initDB();