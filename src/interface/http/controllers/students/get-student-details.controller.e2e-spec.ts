import request from 'supertest'

import { app } from '@/app'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students'

describe('get student details controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get student details', async () => {
    const { studentId, token } = await createAndAuthenticateStudent()

    const response = await request(app.server)
      .get('/students/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.details.id).toBe(studentId)
  })
})
