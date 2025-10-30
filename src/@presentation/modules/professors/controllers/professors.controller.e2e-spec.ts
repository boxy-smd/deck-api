import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createTestApp, closeTestApp } from 'test/e2e/setup-app'
import { clearDatabase } from 'test/e2e/database-utils'
import { createProfessorInDb } from 'test/e2e/seed-utils'

describe('[E2E] ProfessorsController', () => {
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

  describe('GET /professors - List Professors', () => {
    it('should list all professors', async () => {
      // Arrange
      await createProfessorInDb(app, { name: 'Prof. João Silva' })
      await createProfessorInDb(app, { name: 'Prof. Maria Santos' })
      await createProfessorInDb(app, { name: 'Prof. Pedro Costa' })

      // Act
      const response = await request(app.getHttpServer()).get('/professors')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.professors).toBeInstanceOf(Array)
      expect(response.body.professors.length).toBe(3)
    })

    it('should filter professors by name', async () => {
      // Arrange
      await createProfessorInDb(app, { name: 'Prof. Maria Silva' })
      await createProfessorInDb(app, { name: 'Prof. João Santos' })
      await createProfessorInDb(app, { name: 'Prof. Maria Costa' })

      // Act
      const response = await request(app.getHttpServer()).get(
        '/professors?name=Maria',
      )

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.professors).toBeInstanceOf(Array)
      expect(response.body.professors.length).toBe(2)
      expect(
        response.body.professors.every((p: { name: string }) =>
          p.name.includes('Maria'),
        ),
      ).toBe(true)
    })

    it('should return empty array when no professors match filter', async () => {
      // Arrange
      await createProfessorInDb(app, { name: 'Prof. João Silva' })

      // Act
      const response = await request(app.getHttpServer()).get(
        '/professors?name=Inexistente',
      )

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.professors).toBeInstanceOf(Array)
      expect(response.body.professors.length).toBe(0)
    })

    it('should return all professors when no filter is provided', async () => {
      // Arrange
      await createProfessorInDb(app, { name: 'Prof. A' })
      await createProfessorInDb(app, { name: 'Prof. B' })

      // Act
      const response = await request(app.getHttpServer()).get('/professors')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.professors.length).toBe(2)
    })
  })
})
