import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Client } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, client

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  client = await Client.create({ createdBy: user })
})

test('POST /clients 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, name: 'test', email: 'test', phone: 'test', direction: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(body.email).toEqual('test')
  expect(body.phone).toEqual('test')
  expect(body.direction).toEqual('test')
  expect(typeof body.createdBy).toEqual('object')
})

test('POST /clients 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /clients 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /clients 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /clients 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /clients/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${client.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(client.id)
})

test('GET /clients/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${client.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /clients/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${client.id}`)
  expect(status).toBe(401)
})

test('GET /clients/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})

test('PUT /clients/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${client.id}`)
    .send({ access_token: adminSession, name: 'test', email: 'test', phone: 'test', direction: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(client.id)
  expect(body.name).toEqual('test')
  expect(body.email).toEqual('test')
  expect(body.phone).toEqual('test')
  expect(body.direction).toEqual('test')
})

test('PUT /clients/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${client.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /clients/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${client.id}`)
  expect(status).toBe(401)
})

test('PUT /clients/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: adminSession, name: 'test', email: 'test', phone: 'test', direction: 'test' })
  expect(status).toBe(404)
})

test('DELETE /clients/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${client.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /clients/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${client.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /clients/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${client.id}`)
  expect(status).toBe(401)
})

test('DELETE /clients/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
