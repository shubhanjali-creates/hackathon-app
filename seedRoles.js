// seedRoles.js
//
// Upgrades a few existing students (already inserted by init/feed_students.js)
// to the 'club' or 'admin' role, by roll number.
//
// This does NOT delete or recreate any student documents — it only updates
// the `role` field on records that already exist. Run init/feed_students.js
// first if you haven't already, otherwise these roll numbers won't be found.
//
// Run with:  node seedRoles.js

const mongoose = require('mongoose')
const Student = require('./models/student.js')

const MONGO_URI = 'mongodb://127.0.0.1:27017/hackathon-app'

// Real roll numbers picked from init/students.js
const roleAssignments = [
  // Club accounts
  { rollNumber: 'BT2021001', role: 'club' },   // Aarav Sharma
  { rollNumber: 'BT2022002', role: 'club' },   // Priya Singh
  { rollNumber: 'BT2023007', role: 'club' },   // Arjun Nair
  { rollNumber: 'BT2021013', role: 'club' },   // Meera Iyer
  { rollNumber: 'BT2022018', role: 'club' },   // Yash Kapoor

  // Admin accounts
  { rollNumber: 'BT2021005', role: 'admin' },  // Vikram Patel
  { rollNumber: 'BT2024008', role: 'admin' },  // Pooja Verma
  { rollNumber: 'BT2023011', role: 'admin' },  // Rahul Kumar
]

const seedRoles = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected')

    for (const { rollNumber, role } of roleAssignments) {
      const result = await Student.findOneAndUpdate(
        { rollNumber },
        { role },
        { new: true }
      )

      if (result) {
        console.log(`Updated ${result.name} (${rollNumber}) -> role: ${role}`)
      } else {
        console.warn(`No student found with rollNumber ${rollNumber}. Did you run init/feed_students.js first?`)
      }
    }

    console.log('Role seeding complete.')
    mongoose.connection.close()
  } catch (err) {
    console.error('Role seeding failed:', err.message)
    process.exit(1)
  }
}

seedRoles()