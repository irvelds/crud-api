import { IncomingMessage, Server, ServerResponse } from 'http';
import { server } from '../src/index';
import supertest from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { RESPONSE_MESSAGES } from '../src/constants'
import { IUser } from '../src/types'


jest.useRealTimers();

let testServer: Server<typeof IncomingMessage, typeof ServerResponse>;


beforeEach(async () => {
  testServer = server;
});

afterEach(async () => {
  testServer.close();

});


const userId = uuidv4();
const ENDPOINT = '/api/users';

describe('1 TEST METOD GET', () => {

  test('Should answer with status code 404, and the correct message if the userId does not exist', async () => {
    const response = await supertest(server).get(`${ENDPOINT}/${userId}`);
    const result = response.body;
    expect(response.status).toBe(404);
    expect(result.message).toEqual(RESPONSE_MESSAGES.NOT_USER_ID);
  });

  test('Should answer with status code 400, and the correct message if the id is not Uuid', async () => {
    const response = await supertest(server).get(`${ENDPOINT}/0`);
    const result = response.body;
    expect(response.status).toBe(400);
    expect(result.message).toEqual(RESPONSE_MESSAGES.NOT_UUID);
  });

  test('Should answer with status code 200 and empty array, when GET api/users request', async () => {
    const response = await supertest(server).get(ENDPOINT);
    const result = response.body;
    expect(response.status).toBe(200);
    expect(result.response).toEqual([]);
  });

  test('Should answer with status code 404 and and the correct message if end point not correct', async () => {
    const response = await supertest(server).get(`${ENDPOINT}blabla`);
    const result = response.body;
    expect(response.status).toBe(404);
    expect(result.message).toEqual(RESPONSE_MESSAGES.ENDPOINT_ERROR);
  });

});


describe('2 TEST METOD POST', () => {

  test('Should answer with status code 400 when username is missing', async () => {
    const userData = {
      age: 10,
      hobbies: ['hobbies'],
    };
    const response = await supertest(server).post(ENDPOINT).send(userData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(RESPONSE_MESSAGES.REQUARED_FIELDS_ERROR);
  });

  test('Should answer with status code 400 when age is missing', async () => {
    const userData = {
      username: "username",
      hobbies: ['hobbies'],
    };
    const response = await supertest(server).post(ENDPOINT).send(userData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(RESPONSE_MESSAGES.REQUARED_FIELDS_ERROR);
  });

  test('Should answer with status code 400 when hobbies is missing', async () => {
    const userData = {
      username: "username",
      age: 10,
    };
    const response = await supertest(server).post(ENDPOINT).send(userData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(RESPONSE_MESSAGES.REQUARED_FIELDS_ERROR);
  });

  test('Should answer with status code 400 when invalid JSON', async () => {
    const userData = "";
    const response = await supertest(server).post(ENDPOINT).send(userData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(RESPONSE_MESSAGES.INVALID_BODY);
  });

  test('Should answer with status code 400 when invalid parametrs', async () => {
    const userData = {
      username: "userName",
      age: 10,
      hobbies: ['hobbies', 5],
    };
    const response = await supertest(server).post(ENDPOINT).send(userData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(RESPONSE_MESSAGES.INVALID_DATA);
  });

  test('Should answer with status code 201 when create new user', async () => {
    const userData = {
      id: "46b08466-7174-4f90-bf07-694b8a8ea096",
      username: "userName",
      age: 10,
      hobbies: ['hobbies'],
    };
    const response = await supertest(server).post(ENDPOINT).send(userData);
    expect(response.status).toBe(201);
    expect(response.body.response).toEqual(userData);
  });

});


describe('3 TEST METOD PUT', () => {

  const userId: string = '46b08466-7174-4f90-bf07-694b8a8ea096';
  const updateUserData: IUser = {
    username: 'newName',
    age: 20,
    hobbies: ['newHobbies'],
  };
  test('Should answer with status code 200 if custom data changed successfully', async () => {
    const response = await supertest(server).put(`${ENDPOINT}/${userId}`).send(updateUserData);
    const result = response.body.response;
    expect(response.status).toBe(200);
    expect(result.username).toEqual(updateUserData.username);
    expect(result.age).toEqual(updateUserData.age);
    expect(result.hobbies).toEqual(updateUserData.hobbies);
  });

  test('Should answer with status code 404 and  the correct message if end point not correct', async () => {
    const response = await supertest(server).put(`${ENDPOINT}blabla/${userId}`);
    const result = response.body;
    expect(response.status).toBe(404);
    expect(result.message).toEqual(RESPONSE_MESSAGES.ENDPOINT_ERROR);
  });

});


describe('4 TEST METOD DELETE', () => {
  const postUserData: IUser = {
    username: 'newName',
    age: 20,
    hobbies: ['newHobbies'],
  };

  test('Should answer with status code 204 if the user was created and then deleted', async () => {
    const newUser = await supertest(server).post(ENDPOINT).send(postUserData);
    const trueId = newUser.body.response.id;
    // const wrongId = '7' + trueId.slice(1);
    const response = await supertest(server).delete(`${ENDPOINT}/${trueId}`);
    expect(response.status).toBe(204);
  });

  test('Should answer with status code 400 if Id is not Uuid', async () => {
    const response = await supertest(server).delete(`${ENDPOINT}/0`);
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(RESPONSE_MESSAGES.NOT_UUID);
  });

});

