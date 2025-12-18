import { HttpStatus, type INestApplication } from '@nestjs/common'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createTestApp } from './setup-e2e'

describe('Professors E2E', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await createTestApp()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /professors', () => {
    it('deve listar professores', async () => {
      const response = await request(app.getHttpServer())
        .get('/professors')
        .expect(200)

      expect(response.body).toHaveProperty('professors')
      expect(Array.isArray(response.body.professors)).toBe(true)
    })

    it('should return all professors when no filter is provided', async () => {
      const response = await request(app.getHttpServer()).get('/professors')

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('professors')
      expect(Array.isArray(response.body.professors)).toBe(true)
    })
  })
})
