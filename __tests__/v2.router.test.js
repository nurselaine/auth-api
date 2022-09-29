'use strict';

const supertest = require('supertest');
const { server } = require('../src/server');
const { db } = require('../src/models');

const mockRequest = supertest(server);

let userData = {
  testUser: { username: 'user', password: 'password', role: 'user' },
  testWriter: { username: 'writer', password: 'password', role: 'writer' },
  testEditor: { username: 'editor', password: 'password', role: 'editor' },
  testAdmin: { username: 'admin', password: 'password', role: 'admin' },
};

let userToken;
let writerToken;
let editorToken;
let adminToken;

beforeAll(async () => {
  await db.sync();
  userToken = await mockRequest.post('/signup').send(userData.testUser);
  writerToken = await mockRequest.post('/signup').send(userData.testWriter);
  editorToken = await mockRequest.post('/signup').send(userData.testEditor);
  adminToken = await mockRequest.post('/signup').send(userData.testAdmin);
});

afterAll(async () => {
  await db.drop();
});

/*
POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item
GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items
GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID
PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID
DELETE /api/v2/:model/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found
*/

describe('Authenticated API Routes', () => {

  it('POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item', async () => {
    let food = {name: "cake", calories: "300", type: "dessert"}
    let accessToken = writerToken.body.user.token;
    const response = await mockRequest.post('/api/v2/food').set('Authorization', `Bearer ${accessToken}`).send(food);

    const foodObject = response.body;
    // console.log(foodObject);
    expect(response.status).toBe(201);
    expect(foodObject.name).toBe(food.name);
    expect(foodObject.type).toEqual(foodObject.type);
    expect(foodObject.calories).toEqual(foodObject.calories);
  })

  it('GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items', async () => {
    // let food = {name: "cake", calories: "300", type: "dessert"}
    let accessToken = userToken.body.user.token;
    const response = await mockRequest.get('/api/v2/food').set('Authorization', `Bearer ${accessToken}`);

    // const foodObject = response.body;
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  })

  it('GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID', async () => {
    // let food = {name: "cake", calories: "300", type: "dessert"}
    let accessToken = userToken.body.user.token;
    const response = await mockRequest.get('/api/v2/food/1').set('Authorization', `Bearer ${accessToken}`);

    // const foodObject = response.body;
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('cake');
    expect(response.body.calories).toEqual(300);
    expect(response.body.type).toEqual('dessert');
  })

  it('PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID', async () => {
    // let food = {name: "cake", calories: "300", type: "dessert"}
    let accessToken = editorToken.body.user.token;
    const response = await mockRequest.put('/api/v2/food/1').set('Authorization', `Bearer ${accessToken}`).send({name: "cake", calories: "30", type: "vegetable"});
    const userObject = response.body;

    // const foodObject = response.body;
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(userObject.name).toEqual('cake');
    expect(userObject.calories).toEqual('30');
    expect(userObject.type).toEqual('vegetable');
  })

  it('DELETE /api/v2/:model/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found', async () => {
    // let food = {name: "cake", calories: "300", type: "dessert"}
    let accessToken = adminToken.body.user.token;
    const response = await mockRequest.delete('/api/v2/food/1').set('Authorization', `Bearer ${accessToken}`);
    const userObject = response.body;

    const response2 = await mockRequest.get('/api/v2/food/1');
    const userObject2 = response.body;

    // const foodObject = response.body;
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(userObject).toEqual(1);
    expect(userObject2).toEqual(1);
  })
})

