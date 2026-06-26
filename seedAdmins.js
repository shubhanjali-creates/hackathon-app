const mongoose = require('mongoose')
const Admin = require('./models/Admin')

const MONGO_URI = 'mongodb://localhost:27017/hackathon-app'

const admins = [
  {
    name: 'Rahul Sharma',
    rollNumber: 'BT2021001',
    password: 'shoriya123',
    clubName: 'Shoriya',
    role: 'Leader'
  },
  {
    name: 'Priya Singh',
    rollNumber: 'BT2021002',
    password: 'nityam123',
    clubName: 'Nityam',
    role: 'Leader'
  },
  {
    name: 'Aditya Mehta',
    rollNumber: 'BT2021003',
    password: 'sanskriti123',
    clubName: 'Sanskriti',
    role: 'Admin'
  },
  {
    name: 'Sneha Gupta',
    rollNumber: 'BT2021004',
    password: 'technocracy123',
    clubName: 'Technocracy',
    role: 'Leader'
  },
  {
    name: 'Vikram Nair',
    rollNumber: 'BT2021005',
    password: 'tcp123',
    clubName: 'TCP',
    role: 'Admin'
  }
]

const seedAdmins = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected')

    await Admin.deleteMany({})
    console.log('Old admins cleared')

    await Admin.insertMany(admins)
    console.log('All admins seeded successfully!')

    mongoose.connection.close()
  } catch (err) {
    console.error('Seeding failed:', err.message)
    process.exit(1)
  }
}

seedAdmins()