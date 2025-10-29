import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students'

describe('refresh controller (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to refresh a token', async () => {
    const app = await createTestApp()
    const { cookies } = await createAndAuthenticateStudent()

    if (!cookies) {
      throw new Error('No cookies found')
    }

    const response = await request(app.getHttpServer())
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
