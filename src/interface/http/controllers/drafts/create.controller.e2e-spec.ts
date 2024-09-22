import request from 'supertest'

import { app } from '@/app.ts'
import { createAndAuthenticateStudent } from 'test/e2e/create-and-authenticate-students.ts'

describe('create draft (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a draft', async () => {
    const { token } = await createAndAuthenticateStudent()

    const response = await request(app.server)
      .post('/drafts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Design de Interação',
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      draft_id: expect.any(String),
    })
  })
})
