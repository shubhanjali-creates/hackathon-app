// Step 1 — load .env file first, before anything else
require('dotenv').config()

const express = require('express')
const path = require('path')
const connectDB = require('./config/db')

// Step 2 — create your express app
const app = express()

// Step 3 — connect to MongoDB
connectDB()

// Step 4 — set EJS as your templating engine
app.set('view engine', 'ejs')

// this tells express where your views folder is
app.set('views', path.join(__dirname, 'views'))

// Step 5 — middleware
// this lets express read form data (from HTML forms)
app.use(express.urlencoded({ extended: true }))

// this lets express read JSON data
app.use(express.json())

// this tells express where your CSS/images/JS files are
app.use(express.static(path.join(__dirname, 'public')))

// Step 6 — connect your routes
app.use('/', require('./routes/index'))

// Step 7 — start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})