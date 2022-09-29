'use strict';

const { db } = require('./src/models');
const server = require('./src/server.js');

db.sync().then(() => {
  console.log('connected to db!');
  // food.create({name: 'elaine', calories: '1000', type: 'fruit'});
  server.start(3001);
});
