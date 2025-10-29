import request from 'supertest'

import { app } from '@/app'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students'

describe('refresh controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    const { cookies } = await createAndAuthenticateStudent()

    if (!cookies) {
      throw new Error('No cookies found')
    }

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
