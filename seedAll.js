/**
 * Seeds students, clubs, and roles into the same database the app uses.
 * Run: node seedAll.js
 */
require("dotenv").config();

const mongoose = require("mongoose");
const Student = require("./models/student");
const Club = require("./models/Club");
const clubData = require("./init/clubs.json");
const studentData = require("./init/students.js").data;
const { appointClubLeader } = require("./middleware/roles");

const MONGO_URL =
  process.env.ATLAS_URL || "mongodb://127.0.0.1:27017/hackathon-app";

const ADMIN_ROLL_NUMBERS = ["BT2021005", "BT2024008", "BT2023011"];

const CLUB_LEADER_ASSIGNMENTS = [
  { rollNumber: "BT2021001", clubName: "Shaurya" },
  { rollNumber: "BT2022002", clubName: "Nrityam" },
  { rollNumber: "BT2023007", clubName: "Sanskriti" },
  { rollNumber: "BT2021013", clubName: "Technocracy" },
  { rollNumber: "BT2022018", clubName: "TCP" },
];

async function seedAll() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to:", mongoose.connection.name);

  await Student.deleteMany({});
  await Student.insertMany(
    studentData.map((s) => ({ ...s, role: "student", clubId: null }))
  );
  console.log(`Inserted ${studentData.length} students`);

  await Club.deleteMany({});
  await Club.insertMany(clubData);
  console.log(`Inserted ${clubData.length} clubs`);

  for (const rollNumber of ADMIN_ROLL_NUMBERS) {
    const admin = await Student.findOneAndUpdate(
      { rollNumber },
      { role: "admin", clubId: null },
      { new: true }
    );
    if (admin) console.log(`Admin: ${admin.name} (${rollNumber})`);
  }

  for (const { rollNumber, clubName } of CLUB_LEADER_ASSIGNMENTS) {
    const student = await Student.findOne({ rollNumber });
    const club = await Club.findOne({ name: clubName });
    if (!student || !club) {
      console.warn(`Skipped ${rollNumber} / ${clubName}`);
      continue;
    }
    await appointClubLeader(student._id, club._id);
    console.log(`Club leader: ${student.name} -> ${clubName}`);
  }

  console.log("Database seeding complete.");
  await mongoose.disconnect();
}

seedAll().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
