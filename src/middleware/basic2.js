'use strict';

const base64 = require('base-64');
const { users } = require('../models');

module.exports = async (req, res, next) => {
  console.log(`basic auth ${req.headers.authorization}`);
  if (!req.headers.authorization) { return next('Invalid Login') }
  console.log('basic middleware function');
  let basic = req.headers.authorization.split(' ').pop();
  // console.log(`basic token from head ${basic}`);
  let [username, password] = base64.decode(basic).split(':');

  try {
    console.log(`username ${username} password ${password}`);
    req.user = await users.authenticateBasic(username, password);
    console.log()
    next();
  } catch (e) {
    _authError()
  }

  function _authError() {
    res.status(403).send('Invalid Login');
  }

}