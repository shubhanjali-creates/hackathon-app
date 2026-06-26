const mongoose = require('mongoose');
const Student = require('./models/student.js');

mongoose.connect('mongodb://127.0.0.1:27017/hackathon-app')
  .then(async () => {
    const aarav = await Student.findOne({ rollNumber: 'BT2021001' });
    console.log(aarav);
    mongoose.connection.close();
  })
  .catch(err => console.error(err));