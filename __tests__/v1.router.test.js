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

let userData = {
  testUser: { name: 'user', calories: 'password', type: 'vegetables' },
  testUser2: { name: 'user', calories: 'password', type: 'fruit' },
  testUser3: { name: 'user', calories: 'password', type: 'protein' },
};


/*
V1 (Unauthenticated API) routes
POST /api/v1/:model adds an item to the DB and returns an object with the added item
GET /api/v1/:model returns a list of :model items
GET /api/v1/:model/ID returns a single item by ID
PUT /api/v1/:model/ID returns a single, updated item by ID
DELETE /api/v1/:model/ID returns an empty object. Subsequent GET for the same ID should result in nothing found
*/
describe('Unauthenticated API Routes', () => {

  it('POST /api/v1/:model adds an item to the DB and returns an object with the added item', async () => {
    let user = userData.testUser;
    const response = await mockRequest.post('/api/v1/food').send(user);
    const userObject = response.body;

    expect(response.status).toBe(201);
    expect(userObject.name).toBe(user.name);
    expect(userObject.type).toEqual(user.type);
  })

  it('GET /api/v1/:model returns a list of :model items', async () => {
    let user = userData.testUser;
    const response = await mockRequest.get('/api/v1/food');
    const userObject = response.body;
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(userObject.length).toBe(1);
    expect(userObject[0].name).toBe(user.name);
    expect(userObject[0].type).toBe(user.type);
  })

  it('GET /api/v1/:model/ID returns a single item by ID', async () => {
    const user = userData.testUser;
    const response = await mockRequest.get('/api/v1/food/1');
    const userObject = response.body;
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(userObject.id).toEqual(1);
    expect(userObject.name).toBe(user.name);
    expect(userObject.calories).toBe(user.calories);
    expect(userObject.type).toBe(user.type);
  })

  it('PUT /api/v1/:model/ID returns a single, updated item by ID', async () => {
    const user = userData.testUser2;
    const response = await mockRequest.put('/api/v1/food/1').send(user);
    const userObject = response.body;
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(userObject.id).toEqual(1);
    expect(userObject.name).toBe(user.name);
    expect(userObject.calories).toBe(user.calories);
    expect(userObject.type).toBe(user.type);
  })

  it('DELETE /api/v1/:model/ID returns an empty object. Subsequent GET for the same ID should result in nothing found', async () => {
    const user = userData.testUser2;
    const response = await mockRequest.delete('/api/v1/food/1');
    const userObject = response.body;
    // console.log(response.body);
    
    const response2 = await mockRequest.get('/api/v1/food/1');
    const userObject2 = response2.body;
    expect(response.status).toBe(200);
    expect(userObject).toEqual(1);
    expect(userObject2).toBeFalsy();
  })
})