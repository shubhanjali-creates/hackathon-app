const express = require('express')
const router = express.Router()

// GET homepage
router.get('/', (req, res) => {
  res.render('index', { title: 'Hackathon App' })
  // this renders views/index.ejs
  // and passes { title: 'Hackathon App' } as data to that file
})

module.exports = router