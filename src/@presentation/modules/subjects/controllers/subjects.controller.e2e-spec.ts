import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { clearDatabase } from 'test/e2e/database-utils'
import { createSubjectInDb } from 'test/e2e/seed-utils'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

describe('[E2E] SubjectsController', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await createTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  beforeEach(async () => {
    await clearDatabase(app)
  })

  describe('GET /subjects - List Subjects', () => {
    it('should list all subjects', async () => {
      // Arrange
      await createSubjectInDb(app, {
        name: 'Desenvolvimento Web',
        code: 'SMD0001',
      })
      await createSubjectInDb(app, {
        name: 'Programação Orientada a Objetos',
        code: 'SMD0002',
      })
      await createSubjectInDb(app, {
        name: 'Banco de Dados',
        code: 'SMD0003',
      })

      // Act
      const response = await request(app.getHttpServer()).get('/subjects')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.subjects).toBeInstanceOf(Array)
      expect(response.body.subjects.length).toBe(3)
    })

    it('should filter subjects by name', async () => {
      // Arrange
      await createSubjectInDb(app, {
        name: 'Desenvolvimento Web',
        code: 'SMD0001',
      })
      await createSubjectInDb(app, {
        name: 'Desenvolvimento Mobile',
        code: 'SMD0002',
      })
      await createSubjectInDb(app, {
        name: 'Banco de Dados',
        code: 'SMD0003',
      })

      // Act
      const response = await request(app.getHttpServer()).get(
        '/subjects?name=Desenvolvimento',
      )

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.subjects).toBeInstanceOf(Array)
      expect(response.body.subjects.length).toBe(2)
      expect(
        response.body.subjects.every((s: { name: string }) =>
          s.name.includes('Desenvolvimento'),
        ),
      ).toBe(true)
    })

    it('should return empty array when no subjects match filter', async () => {
      // Arrange
      await createSubjectInDb(app, {
        name: 'Desenvolvimento Web',
        code: 'SMD0001',
      })

      // Act
      const response = await request(app.getHttpServer()).get(
        '/subjects?name=Inexistente',
      )

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.subjects).toBeInstanceOf(Array)
      expect(response.body.subjects.length).toBe(0)
    })

    it('should return all subjects when no filter is provided', async () => {
      // Arrange
      await createSubjectInDb(app, {
        name: 'Disciplina A',
        code: 'SMD0001',
      })
      await createSubjectInDb(app, {
        name: 'Disciplina B',
        code: 'SMD0002',
      })

      // Act
      const response = await request(app.getHttpServer()).get('/subjects')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.subjects.length).toBe(2)
    })

    it('should return subjects with correct structure', async () => {
      // Arrange
      await createSubjectInDb(app, {
        name: 'Desenvolvimento Web',
        code: 'SMD0001',
      })

      // Act
      const response = await request(app.getHttpServer()).get('/subjects')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.subjects[0]).toHaveProperty('id')
      expect(response.body.subjects[0]).toHaveProperty('name')
      expect(response.body.subjects[0]).toHaveProperty('code')
    })
  })
})
