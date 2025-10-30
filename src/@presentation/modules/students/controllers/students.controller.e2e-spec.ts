import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { clearDatabase } from 'test/e2e/database-utils'
import { createTrailInDb } from 'test/e2e/seed-utils'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'
import {
  createAuthenticatedStudent,
  createStudent,
  getProfile,
  loginStudent,
} from 'test/e2e/student-utils'

describe('[E2E] StudentsController', () => {
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

  describe('POST /students - Register', () => {
    it('should register a new student successfully', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const studentData = {
        name: 'Maria Silva',
        username: 'mariasilva',
        email: 'maria.silva@alu.ufc.br',
        password: 'senha123',
        semester: 3,
        trailsIds: [trail.id.toString()],
      }

      // Act
      const response = await createStudent(app, studentData)

      // Assert
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('user_id')
      expect(typeof response.body.user_id).toBe('string')
    })

    it('should not register student with non-institutional email', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const studentData = {
        name: 'Maria Silva',
        username: 'mariasilva',
        email: 'maria@gmail.com',
        password: 'senha123',
        semester: 3,
        trailsIds: [trail.id.toString()],
      }

      // Act
      const response = await createStudent(app, studentData)

      // Assert
      expect(response.status).toBe(400)
    })

    it('should not register student with duplicate email', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const studentData = {
        name: 'Maria Silva',
        username: 'mariasilva',
        email: 'maria@alu.ufc.br',
        password: 'senha123',
        semester: 3,
        trailsIds: [trail.id.toString()],
      }

      await createStudent(app, studentData)

      // Act
      const response = await createStudent(app, {
        ...studentData,
        username: 'mariasilva2',
      })

      // Assert
      expect(response.status).toBe(409)
    })

    it('should not register student with duplicate username', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const studentData = {
        name: 'Maria Silva',
        username: 'mariasilva',
        email: 'maria@alu.ufc.br',
        password: 'senha123',
        semester: 3,
        trailsIds: [trail.id.toString()],
      }

      await createStudent(app, studentData)

      // Act
      const response = await createStudent(app, {
        ...studentData,
        email: 'maria2@alu.ufc.br',
      })

      // Assert
      expect(response.status).toBe(409)
    })

    it('should not register student with invalid semester', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const studentData = {
        name: 'Maria Silva',
        username: 'mariasilva',
        email: 'maria@alu.ufc.br',
        password: 'senha123',
        semester: 15, // Semestre inválido
        trailsIds: [trail.id.toString()],
      }

      // Act
      const response = await createStudent(app, studentData)

      // Assert
      expect(response.status).toBe(400)
    })

    it('should not register student with invalid trail id', async () => {
      // Arrange
      const studentData = {
        name: 'Maria Silva',
        username: 'mariasilva',
        email: 'maria@alu.ufc.br',
        password: 'senha123',
        semester: 3,
        trailsIds: ['invalid-uuid'],
      }

      // Act
      const response = await createStudent(app, studentData)

      // Assert
      expect(response.status).toBe(400)
    })
  })

  describe('POST /sessions - Login', () => {
    it('should authenticate student with valid credentials', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const credentials = {
        email: 'joao@alu.ufc.br',
        password: 'senha123',
      }

      await createStudent(app, {
        name: 'João Souza',
        username: 'joaosouza',
        email: credentials.email,
        password: credentials.password,
        semester: 5,
        trailsIds: [trail.id.toString()],
      })

      // Act
      const response = await loginStudent(app, credentials)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(typeof response.body.token).toBe('string')
      expect(response.body.token.length).toBeGreaterThan(0)
    })

    it('should not authenticate with wrong password', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      await createStudent(app, {
        name: 'João Souza',
        username: 'joaosouza',
        email: 'joao@alu.ufc.br',
        password: 'senha123',
        semester: 5,
        trailsIds: [trail.id.toString()],
      })

      // Act
      const response = await loginStudent(app, {
        email: 'joao@alu.ufc.br',
        password: 'senhaerrada',
      })

      // Assert
      expect(response.status).toBe(401)
    })

    it('should not authenticate with non-existent email', async () => {
      // Act
      const response = await loginStudent(app, {
        email: 'naoexiste@alu.ufc.br',
        password: 'senha123',
      })

      // Assert
      expect(response.status).toBe(401)
    })
  })

  describe('GET /profiles/:username - Get Profile', () => {
    it('should get student profile by username', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      await createStudent(app, {
        name: 'Ana Costa',
        username: 'anacosta',
        email: 'ana@alu.ufc.br',
        password: 'senha123',
        semester: 2,
        trailsIds: [trail.id.toString()],
      })

      // Act
      const response = await getProfile(app, 'anacosta')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        name: 'Ana Costa',
        username: 'anacosta',
        email: 'ana@alu.ufc.br',
        semester: 2,
      })
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('role')
      expect(response.body).toHaveProperty('status')
    })

    it('should return 404 for non-existent username', async () => {
      // Act
      const response = await getProfile(app, 'naoexiste')

      // Assert
      expect(response.status).toBe(404)
    })
  })

  describe('PUT /profiles/:studentId - Edit Profile', () => {
    it('should edit student profile', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const { userId, token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      // Act
      const response = await request(app.getHttpServer())
        .put(`/profiles/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          semester: 6,
          about: 'Estudante de Engenharia de Software',
        })

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.profile).toMatchObject({
        semester: 6,
        about: 'Estudante de Engenharia de Software',
      })
    })

    it('should not edit profile of another student', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      const otherStudent = await createStudent(app, {
        name: 'Outro Aluno',
        username: 'outroaluno',
        email: 'outro@alu.ufc.br',
        password: 'senha123',
        semester: 4,
        trailsIds: [trail.id.toString()],
      })

      // Act
      const response = await request(app.getHttpServer())
        .put(`/profiles/${otherStudent.body.user_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ semester: 7 })

      // Assert
      expect(response.status).toBe(403)
    })
  })

  describe('GET /students - List Students', () => {
    it('should list all students', async () => {
      // Arrange
      const trail = await createTrailInDb(app)

      await createStudent(app, {
        name: 'Aluno 1',
        username: 'aluno1',
        email: 'aluno1@alu.ufc.br',
        password: 'senha123',
        semester: 1,
        trailsIds: [trail.id.toString()],
      })

      await createStudent(app, {
        name: 'Aluno 2',
        username: 'aluno2',
        email: 'aluno2@alu.ufc.br',
        password: 'senha123',
        semester: 2,
        trailsIds: [trail.id.toString()],
      })

      // Act
      const response = await request(app.getHttpServer()).get('/students')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.users).toBeInstanceOf(Array)
      expect(response.body.users.length).toBe(2)
    })

    it('should filter students by name', async () => {
      // Arrange
      const trail = await createTrailInDb(app)

      await createStudent(app, {
        name: 'Maria Silva',
        username: 'maria',
        email: 'maria@alu.ufc.br',
        password: 'senha123',
        semester: 1,
        trailsIds: [trail.id.toString()],
      })

      await createStudent(app, {
        name: 'João Souza',
        username: 'joao',
        email: 'joao@alu.ufc.br',
        password: 'senha123',
        semester: 2,
        trailsIds: [trail.id.toString()],
      })

      // Act
      const response = await request(app.getHttpServer()).get(
        '/students?name=Maria',
      )

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.users).toHaveLength(1)
      expect(response.body.users[0].name).toBe('Maria Silva')
    })
  })

  describe('POST /profile-images/:username - Upload Profile Image', () => {
    it('should upload profile image', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const { username, token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      // Act
      const response = await request(app.getHttpServer())
        .post(`/profile-images/${username}`)
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('fake-image-data'), 'profile.jpg')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message')
    })

    it('should not upload without file', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const { username, token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      // Act
      const response = await request(app.getHttpServer())
        .post(`/profile-images/${username}`)
        .set('Authorization', `Bearer ${token}`)

      // Assert
      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /token/refresh - Refresh Token', () => {
    it('should refresh authentication token', async () => {
      // Arrange
      const trail = await createTrailInDb(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      // Act
      const response = await request(app.getHttpServer())
        .patch('/token/refresh')
        .set('Authorization', `Bearer ${token}`)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(typeof response.body.token).toBe('string')
    })

    it('should not refresh without authentication', async () => {
      // Act
      const response = await request(app.getHttpServer()).patch(
        '/token/refresh',
      )

      // Assert
      expect(response.status).toBe(401)
    })
  })
})
