'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');

const v1Routes = require('./routes/v1.js');
const v2Routes = require('./routes/v2');
const authRoutes = require('./routes/routes2');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(logger);
console.log('hello...');

app.get('/hello', async (req, res) => {res.send('hello')})

app.use('/api/v1', v1Routes); // http://localhost:3001/api/v1
app.use('/api/v2', v2Routes);
app.use(authRoutes); // http://localhost:3001
console.log('hello again');
app.use('*', notFoundHandler);
app.use(errorHandler);

function start (){
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
}

module.exports = {
  server: app,
  // start: port => {
  //   if (!port) { throw new Error('Missing Port'); }
  //   app.listen(port, () => 
  //     console.log(`Listening on ${port}`));
  // },
  start,
};