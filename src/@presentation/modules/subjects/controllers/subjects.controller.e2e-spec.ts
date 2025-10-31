import { HttpStatus, type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { clearDatabase } from 'test/e2e/database-utils'
import { createSubjectInDb } from 'test/e2e/seed-utils'
import { createTestApp } from 'test/e2e/setup-e2e'

describe('Subjects E2E Tests (Success Cases)', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await createTestApp()
  })

  afterAll(async () => {
    await clearDatabase(app)
    await app.close()
  })

  describe('GET /subjects', () => {
    it('should list all subjects', async () => {
      const response = await request(app.getHttpServer()).get('/subjects')

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('subjects')
      expect(Array.isArray(response.body.subjects)).toBe(true)
    })

    it('should filter subjects by name', async () => {
      await createSubjectInDb(app, {
        name: 'Banco de Dados',
        code: 'ABC1234',
      })

      const response = await request(app.getHttpServer())
        .get('/subjects')
        .query({ name: 'Banco' })

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('subjects')
      expect(Array.isArray(response.body.subjects)).toBe(true)
    })

    it('should return empty array when no subjects match filter', async () => {
      const response = await request(app.getHttpServer())
        .get('/subjects')
        .query({ name: 'Disciplina Inexistente XYZ' })

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('subjects')
      expect(Array.isArray(response.body.subjects)).toBe(true)
      expect(response.body.subjects.length).toBe(0)
    })

    it('should return all subjects when no filter is provided', async () => {
      const response = await request(app.getHttpServer()).get('/subjects')

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('subjects')
      expect(Array.isArray(response.body.subjects)).toBe(true)
    })

    it('should list subjects with different types', async () => {
      await createSubjectInDb(app, {
        name: 'Obrigatória 1',
        code: 'ABCD1234',
      })
      await createSubjectInDb(app, {
        name: 'Eletiva 1',
        code: 'BCDE1234',
      })
      await createSubjectInDb(app, {
        name: 'Opcional 1',
        code: 'CDEF1234',
      })

      const response = await request(app.getHttpServer()).get('/subjects')

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('subjects')
      expect(Array.isArray(response.body.subjects)).toBe(true)
    })
  })
})
