import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestApp } from './setup-e2e'

describe('Subjects E2E', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await createTestApp()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /subjects', () => {
    it('deve listar disciplinas', async () => {
      const response = await request(app.getHttpServer())
        .get('/subjects')
        .expect(200)

      expect(response.body).toHaveProperty('subjects')
      expect(Array.isArray(response.body.subjects)).toBe(true)
    })
  })
})
