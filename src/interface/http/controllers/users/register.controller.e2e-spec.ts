import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app.ts'

describe('register controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 1,
    })

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({
      user_id: expect.any(String),
    })
  })
})
