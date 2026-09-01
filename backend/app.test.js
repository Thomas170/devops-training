const test = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const express = require('express')

const app = express()
const services = [
  { id: 1, name: 'API Auth', status: 'Online' },
  { id: 2, name: 'Database', status: 'Online' },
  { id: 3, name: 'Payment Service', status: 'Online' }
]

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() })
})

app.get('/api/services', (req, res) => {
  res.json(services)
})

test('GET /api/health returns status UP', async () => {
  const res = await request(app)
    .get('/api/health')
    .expect(200)

  assert.equal(res.body.status, 'UP')
  assert.ok(res.body.timestamp)
})

test('GET /api/services returns the list of services', async () => {
  const res = await request(app)
    .get('/api/services')
    .expect(200)

  assert.equal(Array.isArray(res.body), true)
  assert.equal(res.body.length, 3)
  assert.deepEqual(res.body[0], services[0])
})
