import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { makeTrail } from 'test/factories/make-trail'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import * as schema from '@/@infra/database/drizzle/schema'
import { clearDatabase } from './database-utils'
import { getDrizzleInstance } from './helpers/drizzle.helper'
import { createTestApp } from './setup-e2e'

/**
 * Students E2E Tests - Simplified
 *
 * Only tests critical happy paths and authorization.
 * Validation and business logic are covered by unit/integration tests.
 */
describe('Students E2E', () => {
  let app: INestApplication
  let db: ReturnType<typeof getDrizzleInstance>

  beforeAll(async () => {
    app = await createTestApp()
    db = getDrizzleInstance(app)
    await clearDatabase(db)
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await clearDatabase(db)
  })

  it('should register a new student (happy path)', async () => {
    const trail = makeTrail()
    await db.insert(schema.trails).values({
      id: trail.id.toString(),
      name: trail.name,
      createdAt: trail.createdAt,
      updatedAt: trail.updatedAt,
    })

    const response = await request(app.getHttpServer())
      .post('/students')
      .send({
        name: 'João Silva',
        username: 'joaosilva',
        email: 'joao@alu.ufc.br',
        password: 'senha123',
        semester: 3,
        trailsIds: [trail.id.toString()],
      })
      .expect(201)

    expect(response.body).toHaveProperty('user_id')
    expect(typeof response.body.user_id).toBe('string')
  })

  it('should login with valid credentials (happy path)', async () => {
    const trail = makeTrail()
    await db.insert(schema.trails).values({
      id: trail.id.toString(),
      name: trail.name,
      createdAt: trail.createdAt,
      updatedAt: trail.updatedAt,
    })

    // Register student
    await request(app.getHttpServer())
      .post('/students')
      .send({
        name: 'João Silva',
        username: 'joaosilva',
        email: 'joao@alu.ufc.br',
        password: 'senha123',
        semester: 3,
        trailsIds: [trail.id.toString()],
      })

    // Login
    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'joao@alu.ufc.br',
        password: 'senha123',
      })
      .expect(200)

    expect(response.body).toHaveProperty('token')
    expect(typeof response.body.token).toBe('string')
  })

  it('should get authenticated user profile (happy path)', async () => {
    const trail = makeTrail()
    await db.insert(schema.trails).values({
      id: trail.id.toString(),
      name: trail.name,
      createdAt: trail.createdAt,
      updatedAt: trail.updatedAt,
    })

    // Register and login
    await request(app.getHttpServer())
      .post('/students')
      .send({
        name: 'João Silva',
        username: 'joaosilva',
        email: 'joao@alu.ufc.br',
        password: 'senha123',
        semester: 3,
        trailsIds: [trail.id.toString()],
      })

    const loginResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'joao@alu.ufc.br',
        password: 'senha123',
      })

    const token = loginResponse.body.token

    // Get profile
    const response = await request(app.getHttpServer())
      .get('/profiles/joaosilva')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body).toMatchObject({
      name: 'João Silva',
      username: 'joaosilva',
    })
  })

  it('should get currently authenticated user profile (happy path)', async () => {
    const trail = makeTrail()
    await db.insert(schema.trails).values({
      id: trail.id.toString(),
      name: trail.name,
      createdAt: trail.createdAt,
      updatedAt: trail.updatedAt,
    })

    // Register and login
    await request(app.getHttpServer())
      .post('/students')
      .send({
        name: 'João Silva',
        username: 'joaosilva',
        email: 'joao@alu.ufc.br',
        password: 'senha123',
        semester: 3,
        trailsIds: [trail.id.toString()],
      })

    const loginResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'joao@alu.ufc.br',
        password: 'senha123',
      })

    const token = loginResponse.body.token

    // Get profile /students/me
    const response = await request(app.getHttpServer())
      .get('/students/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body).toMatchObject({
      name: 'João Silva',
      username: 'joaosilva',
    })
  })

  it('should update authenticated user profile (happy path)', async () => {
    const trail = makeTrail()
    await db.insert(schema.trails).values({
      id: trail.id.toString(),
      name: trail.name,
      createdAt: trail.createdAt,
      updatedAt: trail.updatedAt,
    })

    // Register student
    const registerResponse = await request(app.getHttpServer())
      .post('/students')
      .send({
        name: 'João Silva',
        username: 'joaosilva',
        email: 'joao@alu.ufc.br',
        password: 'senha123',
        semester: 3,
        trailsIds: [trail.id.toString()],
      })

    const userId = registerResponse.body.user_id

    // Login
    const loginResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'joao@alu.ufc.br',
        password: 'senha123',
      })

    const token = loginResponse.body.token

    // Update profile
    const response = await request(app.getHttpServer())
      .put(`/profiles/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        about: 'Desenvolvedor Full Stack',
        semester: 5,
        trailsIds: [trail.id.toString()],
      })
      .expect(200)

    expect(response.body.profile.semester).toBe(5)
    expect(response.body.profile).toBeDefined()
  })
})
