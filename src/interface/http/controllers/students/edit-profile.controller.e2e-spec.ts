import request from 'supertest'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students'

describe('edit profile controller (e2e)', () => {
  beforeAll(async () => {
    await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should be able to edit profile', async () => {
    const app = await createTestApp()
    const { studentId, token } = await createAndAuthenticateStudent()

    const response = await request(app.getHttpServer())
      .put(`/profiles/${studentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        semester: 8,
      })

    expect(response.status).toBe(200)
    expect(response.body.profile.semester).toBe(8)
  })
})
