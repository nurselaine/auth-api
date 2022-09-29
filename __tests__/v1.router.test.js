'use strict';

const supertest = require('supertest');
const { server } = require('../src/server');
const { db } = require('../src/models');

const mockRequest = supertest(server);

// beforeAll(async () => {
//   await db.sync();
// });

// afterAll(async () => {
//   await db.drop();
// });

describe('Unauthenticated API Routes', () => {

  it('Can create a user with specified role', async () => {
    let user = { username: 'user', password: 'pass', role: 'user' };
    const response = await mockRequest.post('/signup').send(user);
    const userObject = response.body;

    expect(response.status).toBe(201);
    expect(userObject.username).toBe('user');
    expect(userObject.password).not.toBe('pass');
    expect(userObject.role).toBeEqual('user');
  })
})