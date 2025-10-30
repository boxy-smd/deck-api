import type { INestApplication } from '@nestjs/common'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { clearDatabase } from './database-utils'
import { createTrailInDb } from './seed-utils'
import { closeTestApp, createTestApp } from './setup-app'
import { createStudent, getProfile, loginStudent } from './student-utils'

describe('[E2E] Students', () => {
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

  describe('POST /students', () => {
    it('should create a new student', async () => {
      // Arrange
      const trail = await createTrailInDb(app, { name: 'Web Development' })
      const studentData = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@alu.ufc.br',
        password: '123456',
        semester: 1,
        trailsIds: [trail.id.toString()],
      }

      // Act
      const response = await createStudent(app, studentData)

      // Assert
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('user_id')
      expect(typeof response.body.user_id).toBe('string')
    })

    it('should not create student with invalid email', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const studentData = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'invalid@gmail.com', // Email não institucional
        password: '123456',
        semester: 1,
        trailsIds: [trail.id.toString()],
      }

      // Act
      const response = await createStudent(app, studentData)

      // Assert
      expect(response.status).toBe(400)
    })

    it('should not create student with duplicate email', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const studentData = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@alu.ufc.br',
        password: '123456',
        semester: 1,
        trailsIds: [trail.id.toString()],
      }

      await createStudent(app, studentData)

      // Act - Tentar criar novamente
      const response = await createStudent(app, {
        ...studentData,
        username: 'johndoe2',
      })

      // Assert
      expect(response.status).toBe(409)
    })
  })

  describe('POST /sessions', () => {
    it('should authenticate a student', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const credentials = {
        email: 'johndoe@alu.ufc.br',
        password: '123456',
      }

      await createStudent(app, {
        name: 'John Doe',
        username: 'johndoe',
        email: credentials.email,
        password: credentials.password,
        semester: 1,
        trailsIds: [trail.id.toString()],
      })

      // Act
      const response = await loginStudent(app, credentials)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(typeof response.body.token).toBe('string')
    })

    it('should not authenticate with wrong password', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      await createStudent(app, {
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@alu.ufc.br',
        password: '123456',
        semester: 1,
        trailsIds: [trail.id.toString()],
      })

      // Act
      const response = await loginStudent(app, {
        email: 'johndoe@alu.ufc.br',
        password: 'wrongpassword',
      })

      // Assert
      expect(response.status).toBe(401)
    })
  })

  describe('GET /profiles/:username', () => {
    it('should get student profile by username', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      await createStudent(app, {
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@alu.ufc.br',
        password: '123456',
        semester: 1,
        trailsIds: [trail.id.toString()],
      })

      // Act
      const response = await getProfile(app, 'johndoe')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@alu.ufc.br',
        semester: 1,
      })
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('role')
      expect(response.body).toHaveProperty('status')
    })

    it('should return 404 for non-existent username', async () => {
      // Act
      const response = await getProfile(app, 'nonexistent')

      // Assert
      expect(response.status).toBe(404)
    })
  })
})
