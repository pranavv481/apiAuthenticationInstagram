const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
//env
require('dotenv').config();
//connect dataase
require('./config/db');
//model
require('./model/User');
require('./model/Post');

app.use(bodyParser.json());

app.use(require('./routes/authRoutes'));

app.listen(port, () => {
  console.log('server started on port ' + port);
});
