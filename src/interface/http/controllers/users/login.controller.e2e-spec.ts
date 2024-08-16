import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app.ts'

describe('authenticate controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate a user', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 1,
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@alu.ufc.br',
      password: '123456',
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      token: expect.any(String),
    })
  })
})
