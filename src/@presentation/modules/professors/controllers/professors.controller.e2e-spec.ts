import { HttpStatus, type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { clearDatabase } from 'test/e2e/database-utils'
import { createProfessorInDb } from 'test/e2e/seed-utils'
import { createTestApp } from 'test/e2e/setup-e2e'

describe('Professors E2E Tests (Success Cases)', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await createTestApp()
  })

  afterAll(async () => {
    await clearDatabase(app)
    await app.close()
  })

  describe('GET /professors', () => {
    it('should list all professors', async () => {
      const response = await request(app.getHttpServer()).get('/professors')

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('professors')
      expect(Array.isArray(response.body.professors)).toBe(true)
    })

    it('should filter professors by name', async () => {
      await createProfessorInDb(app, { name: 'Prof. Carlos Eduardo' })

      const response = await request(app.getHttpServer())
        .get('/professors')
        .query({ name: 'Carlos' })

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('professors')
      expect(Array.isArray(response.body.professors)).toBe(true)
    })

    it('should return empty array when no professors match filter', async () => {
      const response = await request(app.getHttpServer())
        .get('/professors')
        .query({ name: 'Nome Inexistente XYZ' })

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('professors')
      expect(Array.isArray(response.body.professors)).toBe(true)
      expect(response.body.professors.length).toBe(0)
    })

    it('should return all professors when no filter is provided', async () => {
      const response = await request(app.getHttpServer()).get('/professors')

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('professors')
      expect(Array.isArray(response.body.professors)).toBe(true)
    })
  })
})
