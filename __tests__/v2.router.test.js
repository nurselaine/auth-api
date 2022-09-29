'use strict';

const supertest = require('supertest');
const { server } = require('../src/server');
const { db } = require('../src/models');

const mockRequest = supertest(server);

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe('Authenticated API Routes', () => {

  it('Can read ')
})

