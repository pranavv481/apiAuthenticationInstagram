const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('mongodb connected');
});

mongoose.connection.on('error', (err) => {
  console.log('Error: ' + err);
});
