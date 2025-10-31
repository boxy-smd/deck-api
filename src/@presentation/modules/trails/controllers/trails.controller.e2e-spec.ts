import { HttpStatus, type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { clearDatabase } from 'test/e2e/database-utils'
import { createTrailInDb } from 'test/e2e/seed-utils'
import { createTestApp } from 'test/e2e/setup-e2e'

describe('Trails E2E Tests (Success Cases)', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await createTestApp()
  })

  afterAll(async () => {
    await clearDatabase(app)
    await app.close()
  })

  describe('GET /trails', () => {
    it('should list all trails', async () => {
      await createTrailInDb(app, { name: 'Design Digital' })
      await createTrailInDb(app, { name: 'Desenvolvimento de Software' })
      await createTrailInDb(app, { name: 'Audiovisual' })

      const response = await request(app.getHttpServer()).get('/trails')

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('trails')
      expect(Array.isArray(response.body.trails)).toBe(true)
      expect(response.body.trails.length).toBeGreaterThanOrEqual(3)
    })

    it('should return all trails with their properties', async () => {
      const response = await request(app.getHttpServer()).get('/trails')

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('trails')

      if (response.body.trails.length > 0) {
        const trail = response.body.trails[0]
        expect(trail).toHaveProperty('id')
        expect(trail).toHaveProperty('name')
      }
    })

    it('should successfully fetch trails multiple times', async () => {
      const response1 = await request(app.getHttpServer()).get('/trails')
      const response2 = await request(app.getHttpServer()).get('/trails')

      expect(response1.status).toBe(HttpStatus.OK)
      expect(response2.status).toBe(HttpStatus.OK)
      expect(response1.body.trails).toEqual(response2.body.trails)
    })
  })
})
