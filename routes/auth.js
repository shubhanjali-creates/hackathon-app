const express  = require('express');
const router   = express.Router();
const Student  = require('../models/student');
// GET /login — show the login page
router.get('/login', (req, res) => {
  if (req.session.studentId) return res.redirect('/');  // already logged in
  res.render('login', { error: null });
});
// POST /login — verify email + roll number
router.post('/login', async (req, res) => {
  const { email, rollNumber } = req.body;
  try {
    const student = await Student.findOne({
      email:      email.trim().toLowerCase(),
      rollNumber: rollNumber.trim()
    });
    if (!student) {
      return res.render('login', { error: 'Invalid email or roll number.' });
    }
    // Save student info in session
    req.session.studentId   = student._id;
    req.session.studentName = student.name;
    req.session.role        = student.role || 'student';
    req.session.clubId      = student.clubId ? student.clubId.toString() : null;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Something went wrong. Try again.' });
  }
});
// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});
module.exports = router;