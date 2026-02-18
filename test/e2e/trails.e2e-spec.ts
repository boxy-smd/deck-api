import { type INestApplication } from '@nestjs/common'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { DRIZZLE } from '@/@infra/database/drizzle/drizzle.provider'
import * as schema from '@/@infra/database/drizzle/schema'
import { seedCommonData } from './helpers/fixtures.helper'
import { createTestApp } from './setup-e2e'

describe('Trails E2E', () => {
  let app: INestApplication

  let db: NodePgDatabase<typeof schema>

  beforeAll(async () => {
    app = await createTestApp()
    db = app.get(DRIZZLE)
    await seedCommonData(db)
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /trails', () => {
    it('deve listar trilhas', async () => {
      const response = await request(app.getHttpServer())
        .get('/trails')
        .expect(200)

      console.log('Response Body:', JSON.stringify(response.body, null, 2))

      expect(response.body).toHaveProperty('trails')
      expect(Array.isArray(response.body.trails)).toBe(true)

      const trail = response.body.trails[0]
      expect(trail).toHaveProperty('color')
      expect(trail).toHaveProperty('lightColor')
      expect(trail).toHaveProperty('darkColor')
      expect(trail).toHaveProperty('icon')
    })
  })
})
