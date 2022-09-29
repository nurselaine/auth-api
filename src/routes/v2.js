'use strict';

const express = require('express');
const permissions = require('../middleware/acl2');
const bearer2 = require('../middleware/bearer2');
const dataModules = require('../models');

const router = express.Router();

console.log("i'm in my v2 routes");

router.param('model', (req, res, next) => {
  console.log('v2 function', req.params.model);
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model', bearer2, handleGetAll);
router.get('/:model/:id', bearer2, handleGetOne);
router.post('/:model', bearer2, permissions('create'), handleCreate);
router.put('/:model/:id', bearer2, permissions('update'), handleUpdate);
router.delete('/:model/:id', bearer2, permissions('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id)
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  console.log('hello handle create function')
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj)
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}


module.exports = router;