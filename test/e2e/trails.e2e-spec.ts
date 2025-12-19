import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestApp } from './setup-e2e'

describe('Trails E2E', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await createTestApp()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /trails', () => {
    it('deve listar trilhas', async () => {
      const response = await request(app.getHttpServer())
        .get('/trails')
        .expect(200)

      expect(response.body).toHaveProperty('trails')
      expect(Array.isArray(response.body.trails)).toBe(true)
    })
  })
})
