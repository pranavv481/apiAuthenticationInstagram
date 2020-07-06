const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
  // get authorization
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'You Must Be Logged In' });
  }
  const token = authorization.replace('Bearer ', '');
  // varify token
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      res.status(401).json({ error: 'You must Be logged in' });
    }

    const { _id } = payload;
    User.findById(_id).then((userData) => {
      req.user = userData;
    });
    next();
  });
};
