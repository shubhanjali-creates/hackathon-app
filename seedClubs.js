const mongoose = require('mongoose')
const Club = require('./models/Club.js')
const clubs = require('./init/clubs.json')

// paste your MongoDB URI directly here
const MONGO_URI = 'mongodb://localhost:27017/hackathon-app'

const seedClubs = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected')

    await Club.deleteMany({})
    console.log('Old clubs cleared')

    await Club.insertMany(clubs)
    console.log('All clubs seeded successfully!')

    mongoose.connection.close()
  } catch (err) {
    console.error('Seeding failed:', err.message)
    process.exit(1)
  }
}

seedClubs()