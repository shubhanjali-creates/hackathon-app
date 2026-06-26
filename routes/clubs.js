const express = require('express')
const router = express.Router()
const Club = require('../models/Club')
const ClubMessage = require('../models/ClubMessage')

// GET /clubs — show all clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find()
    res.render('clubs/index', { clubs })
  } catch (err) {
    console.error(err)
    res.redirect('/')
  }
})

// GET /clubs/:id — show single club chat page
router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
    const messages = await ClubMessage.find({ 
      clubId: req.params.id 
    }).sort({ createdAt: 1 })

    res.render('clubs/chat', { club, messages })
  } catch (err) {
    console.error(err)
    res.redirect('/clubs')
  }
})

// POST /clubs/:id/message — send a message in club chat
router.post('/:id/message', async (req, res) => {
  try {
    const message = new ClubMessage({
      clubId: req.params.id,
      senderName: req.body.senderName,
      content: req.body.content
    })
    await message.save()
    res.redirect(`/clubs/${req.params.id}`)
  } catch (err) {
    console.error(err)
    res.redirect(`/clubs/${req.params.id}`)
  }
})

module.exports = router