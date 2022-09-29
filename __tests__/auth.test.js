'use strict';

process.env.SECRET = "TEST_SECRET";

const supertest = require('supertest');
// const base64 = require('base-64');
const { server } = require('../src/server');
const { db } = require('../src/models');

const mockServer = supertest(server);

let userData = {
  testUser: { username: 'user', password: 'password', role: 'user' },
  testWriter: { username: 'writer', password: 'password', role: 'writer' },
  testEditor: { username: 'editor', password: 'password', role: 'editor' },
  testAdmin: { username: 'admin', password: 'password', role: 'admin' },

};

/*
AUTH Routes
POST /signup creates a new user and sends an object with the user and the token to the client
POST /signin with basic authentication headers logs in a user and sends an object with the user and the token to the client
*/

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});


describe('Auth Routes', () => {

  it('POST /signup creates a new user and sends an object with the user and the token to the client', async () => {
    let user = userData.testUser;
    const response = await mockServer.post('/signup').send(user);
    const userObject = response.body.user;
    // console.log(userObject);
    // const expectedPassword = base64.decode(userObject.password);
    expect(response.status).toBe(201);
    expect(userObject.username).toBe(user.username);
    expect(userObject.role).toBe(user.role);
  })

  it('POST /signin with basic authentication headers logs in a user and sends an object with the user and the token to the client', async () => {
    let user = userData.testUser;
    const response = await mockServer.post('/signin').auth(user.username, user.password);
    const userObject = response.body.user;
    // console.log(userObject);
    expect(response.status).toBe(200);
    expect(userObject.token).toBeTruthy();
    expect(userObject.username).toBe(user.username);
  })
})