const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const verifyToken = require('../middleware/verifyToken');

router.get('/protected', verifyToken, (req, res) => {
  res.send('hi');
});

router.post('/signup', (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: 'Please Add All The Field' });
  }
  User.findOne({ email })
    .then((duplicatUser) => {
      if (duplicatUser) {
        return res.status(422).json({ error: 'Invalid User ' });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });
        user
          .save()
          .then((user) => {
            return res.status(200).json({ message: 'successfully User Added' });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })

    .catch((err) => {
      console.log(err);
    });
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: 'Please Provide email and Password' });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (!savedUser) {
        res.status(422).json({ error: 'Please Provide email and Password' });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((isMatch) => {
          if (!isMatch) {
            res
              .status(422)
              .json({ error: 'Please Provide email and Password' });
          } else {
            // res.status(200).json({ message: 'Successfully SignIn' });
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            res.json({ token });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
