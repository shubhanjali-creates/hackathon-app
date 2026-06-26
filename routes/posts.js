const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

// GET home page — fetch all posts and show them
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
    res.render('home', { posts })
  } catch (err) {
    console.error(err)
    res.render('home', { posts: [] })
  }
})

// POST — create a new post
router.post('/posts', async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content,
      postedBy: req.body.postedBy,
      tag: req.body.tag
    })
    await post.save()
    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.redirect('/')
  }
})

module.exports = router