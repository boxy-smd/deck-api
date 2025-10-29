import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students'

describe('get student details controller (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to get student details', async () => {
    const app = await createTestApp()
    const { studentId, token } = await createAndAuthenticateStudent()

    const response = await request(app.getHttpServer())
      .get('/students/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.details.id).toBe(studentId)
  })
})
