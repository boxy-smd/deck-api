import { HttpStatus, type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { clearDatabase } from 'test/e2e/database-utils'
import { createTrailInDb } from 'test/e2e/seed-utils'
import { createTestApp } from 'test/e2e/setup-e2e'
import {
  createAuthenticatedStudent,
  createStudent,
  getProfile,
  loginStudent,
} from 'test/e2e/student-utils'

describe('Students E2E Tests (Success Cases)', () => {
  let app: INestApplication
  let trailId: string

  beforeAll(async () => {
    app = await createTestApp()
    const trail = await createTrailInDb(app, { name: 'Design Digital' })
    trailId = trail.id.toString()
  })

  afterAll(async () => {
    await clearDatabase(app)
    await app.close()
  })

  describe('POST /students', () => {
    it('should register a new student successfully', async () => {
      const response = await createStudent(app, {
        name: 'João Silva',
        username: 'joaosilva',
        email: 'joao.silva@alu.ufc.br',
        password: '123456',
        semester: 1,
        trailsIds: [trailId],
      })

      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toHaveProperty('user_id')
      expect(response.body.user_id).toBeTruthy()
    })

    it('should register a student with optional fields', async () => {
      const response = await createStudent(app, {
        name: 'Maria Santos',
        username: 'mariasantos',
        email: 'maria.santos@alu.ufc.br',
        password: '123456',
        semester: 3,
        trailsIds: [trailId],
        about: 'Estudante de SMD',
        profileUrl: 'https://example.com/profile.jpg',
      })

      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toHaveProperty('user_id')
    })
  })

  describe('POST /sessions', () => {
    it('should authenticate a student and return JWT token', async () => {
      const email = 'auth.test@alu.ufc.br'
      const password = '123456'

      await createStudent(app, {
        name: 'Auth Test',
        username: 'authtest',
        email,
        password,
        semester: 1,
        trailsIds: [trailId],
      })

      const response = await loginStudent(app, { email, password })

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('token')
      expect(typeof response.body.token).toBe('string')
    })
  })

  describe('GET /profiles/:username', () => {
    it('should get student profile by username', async () => {
      const username = 'profiletest'
      await createStudent(app, {
        name: 'Profile Test',
        username,
        email: 'profile.test@alu.ufc.br',
        password: '123456',
        semester: 2,
        trailsIds: [trailId],
      })

      const response = await getProfile(app, username)

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('username', username)
      expect(response.body).toHaveProperty('name')
      expect(response.body).toHaveProperty('email')
    })
  })

  describe('PUT /profiles/:studentId', () => {
    it('should edit student profile', async () => {
      const { userId, token } = await createAuthenticatedStudent(app, trailId, {
        username: 'editprofile',
        email: 'edit.profile@alu.ufc.br',
      })

      const response = await request(app.getHttpServer())
        .put(`/profiles/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          about: 'Novo sobre mim',
          semester: 5,
          trailsIds: [trailId],
        })

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('profile')
    })
  })

  describe('GET /students', () => {
    it('should list all students', async () => {
      await createStudent(app, {
        name: 'List Test 1',
        username: 'listtest1',
        email: 'list.test1@alu.ufc.br',
        password: '123456',
        semester: 1,
        trailsIds: [trailId],
      })

      await createStudent(app, {
        name: 'List Test 2',
        username: 'listtest2',
        email: 'list.test2@alu.ufc.br',
        password: '123456',
        semester: 2,
        trailsIds: [trailId],
      })

      const response = await request(app.getHttpServer()).get('/students')

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('users')
      expect(Array.isArray(response.body.users)).toBe(true)
      expect(response.body.users.length).toBeGreaterThan(0)
    })

    it('should filter students by name', async () => {
      await createStudent(app, {
        name: 'Unique Name Test',
        username: 'uniquenametest',
        email: 'unique.name@alu.ufc.br',
        password: '123456',
        semester: 1,
        trailsIds: [trailId],
      })

      const response = await request(app.getHttpServer())
        .get('/students')
        .query({ name: 'Unique Name' })

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('users')
      expect(Array.isArray(response.body.users)).toBe(true)
    })
  })

  describe('GET /students/:studentId', () => {
    it('should get student details by username', async () => {
      const { username } = await createAuthenticatedStudent(app, trailId, {
        username: 'detailstest',
        email: 'details.test@alu.ufc.br',
      })

      const response = await request(app.getHttpServer()).get(
        `/students/${username}`,
      )

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('username', username)
    })
  })

  describe('PATCH /token/refresh', () => {
    it('should refresh JWT token', async () => {
      const { token } = await createAuthenticatedStudent(app, trailId, {
        username: 'refreshtoken',
        email: 'refresh.token@alu.ufc.br',
      })

      const response = await request(app.getHttpServer())
        .patch('/token/refresh')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('token')
      expect(typeof response.body.token).toBe('string')
    })
  })
})
