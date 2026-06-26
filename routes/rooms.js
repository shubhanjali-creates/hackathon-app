const express = require('express')
const router = express.Router()
const Room = require('../models/Room')

// FOOD SPLITS
router.get('/food-splits', async (req, res) => {
  const posts = await Room.find({ type: 'food' }).sort({ createdAt: -1 })
  res.render('food-splits', { posts })
})

router.post('/food-splits', async (req, res) => {
  const post = new Room({ ...req.body, type: 'food' })
  await post.save()
  res.redirect('/food-splits')
})

// CAB SPLITS
router.get('/cab-splits', async (req, res) => {
  const posts = await Room.find({ type: 'cab' }).sort({ createdAt: -1 })
  res.render('cab-splits', { posts })
})

router.post('/cab-splits', async (req, res) => {
  const post = new Room({ ...req.body, type: 'cab' })
  await post.save()
  res.redirect('/cab-splits')
})

// RESELL
router.get('/resell', async (req, res) => {
  const posts = await Room.find({ type: 'resell' }).sort({ createdAt: -1 })
  res.render('resell', { posts })
})

router.post('/resell', async (req, res) => {
  const post = new Room({ ...req.body, type: 'resell' })
  await post.save()
  res.redirect('/resell')
})

// LOST AND FOUND
router.get('/lost-and-found', async (req, res) => {
  const posts = await Room.find({ type: 'lost' }).sort({ createdAt: -1 })
  res.render('lost-and-found', { posts })
})

router.post('/lost-and-found', async (req, res) => {
  const post = new Room({ ...req.body, type: 'lost' })
  await post.save()
  res.redirect('/lost-and-found')
})
// COMPLAINTS
router.get('/complaints', async (req, res) => {
  const posts = await Room.find({ type: 'complaint' }).sort({ createdAt: -1 })
  res.render('complaints', { posts })
})

router.post('/complaints', async (req, res) => {
  const post = new Room({
    ...req.body,
    type: 'complaint',
    anonymous: true
  })

  await post.save()

  res.redirect('/complaints')
})

module.exports = router