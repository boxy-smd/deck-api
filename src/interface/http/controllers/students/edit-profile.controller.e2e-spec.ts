import request from 'supertest'

import { app } from '@/app'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students'

describe('edit profile controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to edit profile', async () => {
    const { studentId, token } = await createAndAuthenticateStudent()

    const response = await request(app.server)
      .put(`/profiles/${studentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        semester: 8,
      })

    expect(response.status).toBe(200)
    expect(response.body.profile.semester).toBe(8)
  })
})
