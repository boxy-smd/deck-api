import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { clearDatabase } from 'test/e2e/database-utils'
import { createTrailInDb } from 'test/e2e/seed-utils'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'

describe('[E2E] TrailsController', () => {
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

  describe('GET /trails - List Trails', () => {
    it('should list all trails', async () => {
      // Arrange
      await createTrailInDb(app, { name: 'Web Development' })
      await createTrailInDb(app, { name: 'Mobile Development' })
      await createTrailInDb(app, { name: 'Game Development' })

      // Act
      const response = await request(app.getHttpServer()).get('/trails')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.trails).toBeInstanceOf(Array)
      expect(response.body.trails.length).toBe(3)
    })

    it('should return trails with correct structure', async () => {
      // Arrange
      await createTrailInDb(app, { name: 'Web Development' })

      // Act
      const response = await request(app.getHttpServer()).get('/trails')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.trails[0]).toHaveProperty('id')
      expect(response.body.trails[0]).toHaveProperty('name')
      expect(typeof response.body.trails[0].id).toBe('string')
      expect(typeof response.body.trails[0].name).toBe('string')
    })

    it('should return empty array when no trails exist', async () => {
      // Act
      const response = await request(app.getHttpServer()).get('/trails')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.trails).toBeInstanceOf(Array)
      expect(response.body.trails.length).toBe(0)
    })

    it('should list trails in consistent order', async () => {
      // Arrange
      await createTrailInDb(app, { name: 'Trail A' })
      await createTrailInDb(app, { name: 'Trail B' })
      await createTrailInDb(app, { name: 'Trail C' })

      // Act
      const response1 = await request(app.getHttpServer()).get('/trails')
      const response2 = await request(app.getHttpServer()).get('/trails')

      // Assert
      expect(response1.status).toBe(200)
      expect(response2.status).toBe(200)
      expect(response1.body.trails).toEqual(response2.body.trails)
    })
  })
})
