// seedRoles.js
//
// Upgrades students to admin or club leader roles and links leaders to clubs.
// Run init/feed_students.js and seedClubs.js first.
//
// Run with: node seedRoles.js

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const Student = require("./models/student.js");
const Club = require("./models/Club.js");
const { appointClubLeader } = require("./middleware/roles.js");

const MONGO_URI =
  process.env.ATLAS_URL || "mongodb://127.0.0.1:27017/hackathon-app";

const adminRollNumbers = ['BT2021005', 'BT2024008', 'BT2023011']

const clubLeaderAssignments = [
  { rollNumber: 'BT2021001', clubName: 'Shaurya' },
  { rollNumber: 'BT2022002', clubName: 'Nrityam' },
  { rollNumber: 'BT2023007', clubName: 'Sanskriti' },
  { rollNumber: 'BT2021013', clubName: 'Technocracy' },
  { rollNumber: 'BT2022018', clubName: 'TCP' },
]

const seedRoles = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected')

    for (const rollNumber of adminRollNumbers) {
      const result = await Student.findOneAndUpdate(
        { rollNumber },
      { role: 'admin', clubId: null },
      { returnDocument: 'after' }
      )
      if (result) {
        console.log(`Admin: ${result.name} (${rollNumber})`)
      } else {
        console.warn(`No student found: ${rollNumber}`)
      }
    }

    for (const { rollNumber, clubName } of clubLeaderAssignments) {
      const student = await Student.findOne({ rollNumber })
      const club = await Club.findOne({ name: clubName })

      if (!student || !club) {
        console.warn(`Skipping ${rollNumber} / ${clubName} — student or club not found`)
        continue
      }

      await appointClubLeader(student._id, club._id)
      console.log(`Club leader: ${student.name} -> ${clubName}`)
    }

    console.log('Role seeding complete.')
    mongoose.connection.close()
  } catch (err) {
    console.error('Role seeding failed:', err.message)
    process.exit(1)
  }
}

seedRoles()
