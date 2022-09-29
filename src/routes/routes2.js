'use strict';

const express = require('express');
const authRouter = express.Router();

const { users } = require('../models/index');
const basicAuth = require('../middleware/basic2');
const bearerAuth = require('../middleware/bearer2');
const permissions = require('../middleware/acl2');

console.log('hello in my routes2 file');

authRouter.post('/signup', async (req, res, next) => {
  try {
    console.log('sign up route handler');
    console.log(`req.body ${req.body}`);
    let userRecord = await users.create(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  console.log('this is my signin handler');
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
  const userRecords = await users.findAll({});
  const list = userRecords.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  console.log('this is my secret funciton');
  res.status(200).send('Welcome to the secret area')
});

module.exports = authRouter;