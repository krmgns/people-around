/**
 * Note: Before running tests (npm run test:e2e),
 * be sure that db is already seeded, and app server started.
 */

import request from 'supertest';
import * as utils from './../src/data/utils';
import { ALI_LAT, ALI_LON } from './../src/data/utils';

const API_URL = 'http://localhost:3000';

describe('AppController (e2e)', () => {
  it('GET /', () => {
    request(API_URL)
      .get('/')
      .expect(404);
  });

  it('GET /feed', async () => {
    const response = await request(API_URL)
      .get('/feed')
      .expect(200)
      .expect('Content-Type', /^application\/json/);

    const user = response.body[0];

    expect(user.id).toEqual(expect.any(Number));
    expect(user.name).toEqual(expect.any(String));
    expect(user.email).toEqual(expect.any(String));
    expect(user.bio).toEqual(expect.any(String));
    expect(user.latitude).toEqual(expect.any(Number));
    expect(user.longitude).toEqual(expect.any(Number));
    expect(user.createdAt).toEqual(expect.any(String));
    expect(user.updatedAt).toEqual(expect.any(String));
    expect(user._distance).toEqual(expect.any(Number));
  });

  it('GET /feed [with location filter]', async () => {
    // @see seed.ts file for location.
    const filter = `?location=${ALI_LAT},${ALI_LON}&metric=km`;
    const response = await request(API_URL)
      .get('/feed' + filter)
      .expect(200)
      .expect('Content-Type', /^application\/json/);

    const user = response.body[0];

    // Ali, closest one.
    expect(user._distance).toBe(0);
  });

  it('GET /user/:id', async () => {
    const userId = 1;
    const response = await request(API_URL)
      .get('/user/' + userId)
      .expect(200)
      .expect('Content-Type', /^application\/json/);

    const user = response.body;

    expect(user.id).toEqual(expect.any(Number));
    expect(user.name).toEqual(expect.any(String));
    expect(user.email).toEqual(expect.any(String));
    expect(user.bio).toEqual(expect.any(String));
    expect(user.latitude).toEqual(expect.any(Number));
    expect(user.longitude).toEqual(expect.any(Number));
    expect(user.createdAt).toEqual(expect.any(String));
    expect(user.updatedAt).toEqual(expect.any(String));

    // Not found.
    request(API_URL).get('/user/0')
      .expect(404);
  });

  it('POST /user/:id/like', async () => {
    const likeAction = 1; // Like.
    const likeResponse = await request(API_URL)
      .post('/user/1/like?action=' + likeAction)
      .expect([201, 409])
      .expect('Content-Type', /^application\/json/);

    const likeData = likeResponse.body;

    expect(likeData.id).toEqual(expect.any(Number));
    expect(likeData.likerId).toEqual(expect.any(Number));
    expect(likeData.likedId).toEqual(expect.any(Number));
    expect(likeData.action).toBe(1);
    expect(likeData.createdAt).toEqual(expect.any(String));
    expect(likeData.updatedAt).toEqual(expect.any(String));

    // Conflict.
    request(API_URL).post('/user/1/like?action=' + likeAction)
      .expect(409);

    const dislikeAction = 0; // Dislike.

    const dislikeResponse = await request(API_URL)
      .post('/user/1/like?action=' + dislikeAction)
      .expect(201)
      .expect('Content-Type', /^application\/json/);

    const dislikeData = dislikeResponse.body;

    expect(dislikeData.id).toEqual(expect.any(Number));
    expect(dislikeData.likerId).toEqual(expect.any(Number));
    expect(dislikeData.likedId).toEqual(expect.any(Number));
    expect(dislikeData.action).toBe(0);
    expect(dislikeData.createdAt).toEqual(expect.any(String));
    expect(dislikeData.updatedAt).toEqual(expect.any(String));

    // Invalid action.
    request(API_URL).post('/user/1/like?action=999')
      .expect(400);
  });

  it('DELETE /user/:id/like', async () => {
    const response = await request(API_URL)
      .delete('/user/1/like')
      .expect(200)
      .expect('Content-Type', /^application\/json/);

    const data = response.body;

    expect(data.id).toEqual(expect.any(Number));
    expect(data.likerId).toEqual(expect.any(Number));
    expect(data.likedId).toEqual(expect.any(Number));
    expect(data.action).toEqual(expect.any(Number));
    expect(data.createdAt).toEqual(expect.any(String));
    expect(data.updatedAt).toEqual(expect.any(String));

    // Not found.
    request(API_URL).delete('/user/1/like')
      .expect(404);
  });

  it('POST /user/login', async () => {
    const response = await request(API_URL)
      .post('/user/login')
      .send({email: 'ali@baz.com', password: '123'})
      .expect(200)
      .expect('Content-Type', /^application\/json/);

    const user = response.body;

    expect(user.id).toBe(1);
    expect(user.name).toBe('Ali');

    // Invalid login.
    request(API_URL).post('/user/login')
      .send({email: '', password: ''})
      .expect(400);

    // Invalid credentials.
    request(API_URL).post('/user/login')
      .send({email: 'foo@bar.com', password: '...'})
      .expect(401);

    // Not found.
    request(API_URL).post('/user/login')
      .send({email: 'foo@bar', password: '...'})
      .expect(404);
  });

  it('POST /user/logout', async () => {
    const response = await request(API_URL)
      .post('/user/logout')
      .send({email: 'ali@baz.com'})
      .expect(200)
      .expect('Content-Type', /^application\/json/);

    const data = response.body;

    expect(data.okay).toBe(true);
    expect(data.email).toBe('ali@baz.com');

    // Invalid logout.
    request(API_URL).post('/user/logout')
      .send({email: ''})
      .expect(400);
  });

  it('POST /user/register', async () => {
    const name = utils.getRandomString(5);
    const email = name + '@localhost.com';
    const data = {
      name, email,
      password: '123', bio: '...',
      latitude: utils.getRandomLatitude(),
      longitude: utils.getRandomLongitude(),
    };
    const response = await request(API_URL)
      .post('/user/register')
      .send(data)
      .expect(201)
      .expect('Content-Type', /^application\/json/);

    const user = response.body;

    expect(user.name).toBe(data.name);
    expect(user.email).toBe(data.email);
    expect(user.bio).toBe(data.bio);
    expect(user.latitude).toBe(data.latitude);
    expect(user.longitude).toBe(data.longitude);

    // Conflict.
    request(API_URL).post('/user/register')
      .send(data)
      .expect(409);

    delete data.name;

    // Invalid register.
    request(API_URL).post('/user/register')
      .send(data)
      .expect(400);
  });

  it('PUT /user/update', async () => {
    const data = {
      id: 1, name: 'Ali',
      bio: 'My bio ...',
      latitude: ALI_LAT,
      longitude: ALI_LON,
    };
    const response = await request(API_URL)
      .put('/user/update')
      .send(data)
      .expect(200)
      .expect('Content-Type', /^application\/json/);

    const user = response.body;

    expect(user.id).toBe(data.id);
    expect(user.name).toBe(data.name);
    expect(user.bio).toBe(data.bio);
    expect(user.latitude).toBe(data.latitude);
    expect(user.longitude).toBe(data.longitude);

    delete data.id;

    // Invalid update.
    request(API_URL).put('/user/update')
      .send(data)
      .expect(400);
  });
});
