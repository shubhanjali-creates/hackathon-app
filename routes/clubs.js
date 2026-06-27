const express = require('express')
const router = express.Router()
const Club = require('../models/Club')
const ClubMessage = require('../models/ClubMessage')
const upload = require('../middleware/upload')
const { getImageUrl } = require('../utils/postHelpers')

function handleUploadError(err, req, res, next) {
  if (err) {
    console.error(err)
    return res.status(400).send(err.message || 'Upload failed')
  }
  next()
}

// GET /clubs/my-club — club leader goes to their club
router.get('/my-club', async (req, res) => {
  if (req.session.role === 'club' && req.session.clubId) {
    return res.redirect(`/clubs/${req.session.clubId}`)
  }
  res.redirect('/clubs')
})

// GET /clubs — show all clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find().populate('leaderId', 'name')
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
    if (!club) {
      return res.status(404).redirect('/clubs')
    }

    const messages = await ClubMessage.find({
      clubId: req.params.id
    }).sort({ pinned: -1, pinnedAt: -1, createdAt: 1 })

    const canManageClub =
      req.session.role === 'admin' ||
      (req.session.role === 'club' &&
        req.session.clubId === req.params.id.toString())

    res.render('clubs/chat', { club, messages, canManageClub })
  } catch (err) {
    console.error(err)
    res.redirect('/clubs')
  }
})

// POST /clubs/:id/message — send a message in club chat
router.post('/:id/message', upload.single('image'), handleUploadError, async (req, res) => {
  try {
    const message = new ClubMessage({
      clubId: req.params.id,
      senderName: req.session.studentName,
      content: req.body.content,
      imageUrl: getImageUrl(req.file),
    })
    await message.save()
    res.redirect(`/clubs/${req.params.id}`)
  } catch (err) {
    console.error(err)
    res.redirect(`/clubs/${req.params.id}`)
  }
})

// DELETE /clubs/:id/messages/:messageId — admin or this club's leader
router.delete('/:id/messages/:messageId', async (req, res) => {
  const clubId = req.params.id
  const isAdmin = req.session.role === 'admin'
  const isOwnClub =
    req.session.role === 'club' && req.session.clubId === clubId

  if (!isAdmin && !isOwnClub) {
    return res.status(403).send('You can only delete messages in your own club.')
  }

  try {
    await ClubMessage.findOneAndDelete({
      _id: req.params.messageId,
      clubId,
    })
    res.redirect(`/clubs/${clubId}`)
  } catch (err) {
    console.error(err)
    res.redirect(`/clubs/${clubId}`)
  }
})

// POST /clubs/:id/messages/:messageId/pin — admin or this club's leader
router.post('/:id/messages/:messageId/pin', async (req, res) => {
  const clubId = req.params.id
  const isAdmin = req.session.role === 'admin'
  const isOwnClub =
    req.session.role === 'club' && req.session.clubId === clubId

  if (!isAdmin && !isOwnClub) {
    return res.status(403).send('You can only pin messages in your own club.')
  }

  try {
    const message = await ClubMessage.findOne({
      _id: req.params.messageId,
      clubId,
    })
    if (!message) return res.status(404).send('Message not found')

    message.pinned = !message.pinned
    message.pinnedAt = message.pinned ? new Date() : null
    message.pinnedBy = message.pinned ? req.session.studentName : null
    await message.save()

    res.redirect(`/clubs/${clubId}`)
  } catch (err) {
    console.error(err)
    res.redirect(`/clubs/${clubId}`)
  }
})

module.exports = router
