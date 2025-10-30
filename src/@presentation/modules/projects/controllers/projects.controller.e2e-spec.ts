import type { INestApplication } from '@nestjs/common'
import { clearDatabase } from 'test/e2e/database-utils'
import {
  createProject,
  deleteProject,
  getProject,
  listPosts,
  searchPosts,
} from 'test/e2e/project-utils'
import { createProjectTestData } from 'test/e2e/seed-utils'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'
import { createAuthenticatedStudent } from 'test/e2e/student-utils'

describe('[E2E] ProjectsController', () => {
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

  describe('POST /projects - Publish Project', () => {
    it('should publish a new project', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      const projectData = {
        title: 'Meu Website Incrível',
        description: 'Um projeto de desenvolvimento web',
        content: '# Conteúdo do projeto\n\nDescrição detalhada...',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
        allowComments: true,
      }

      // Act
      const response = await createProject(app, token, projectData)

      // Assert
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('project_id')
      expect(typeof response.body.project_id).toBe('string')
    })

    it('should not publish project without authentication', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)

      const projectData = {
        title: 'Meu Projeto',
        description: 'Descrição',
        content: 'Conteúdo',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      }

      // Act
      const response = await createProject(app, '', projectData)

      // Assert
      expect(response.status).toBe(401)
    })

    it('should not publish project with invalid subject', async () => {
      // Arrange
      const { trail, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      const projectData = {
        title: 'Meu Projeto',
        description: 'Descrição',
        content: 'Conteúdo',
        publishedYear: 2024,
        semester: 3,
        subjectId: 'invalid-uuid',
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      }

      // Act
      const response = await createProject(app, token, projectData)

      // Assert
      expect(response.status).toBe(404)
    })
  })

  describe('GET /posts - List Posts', () => {
    it('should list all posts', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      await createProject(app, token, {
        title: 'Projeto 1',
        description: 'Desc 1',
        content: 'Content 1',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      await createProject(app, token, {
        title: 'Projeto 2',
        description: 'Desc 2',
        content: 'Content 2',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      // Act
      const response = await listPosts(app)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.posts).toBeInstanceOf(Array)
      expect(response.body.posts.length).toBeGreaterThanOrEqual(2)
      expect(response.body).toHaveProperty('pagination')
    })

    it('should list posts with pagination', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      for (let i = 1; i <= 15; i++) {
        await createProject(app, token, {
          title: `Projeto ${i}`,
          description: `Descrição ${i}`,
          content: `Conteúdo ${i}`,
          publishedYear: 2024,
          semester: 3,
          subjectId: subject.id.toString(),
          trailsIds: [trail.id.toString()],
          professorsIds: [professor.id.toString()],
        })
      }

      // Act
      const response = await listPosts(app, { page: 1, perPage: 10 })

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.posts).toHaveLength(10)
      expect(response.body.pagination).toMatchObject({
        page: 1,
        perPage: 10,
        totalPages: 2,
      })
    })

    it('should search posts by query', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      await createProject(app, token, {
        title: 'Website com React',
        description: 'Projeto web',
        content: 'React TypeScript',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      await createProject(app, token, {
        title: 'App Mobile',
        description: 'Aplicativo mobile',
        content: 'Flutter Dart',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      // Act
      const response = await listPosts(app, { query: 'React' })

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.posts.length).toBeGreaterThan(0)
    })
  })

  describe('GET /posts/search - Search Posts', () => {
    it('should filter posts by semester', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      await createProject(app, token, {
        title: 'Projeto Semestre 3',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      await createProject(app, token, {
        title: 'Projeto Semestre 5',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 5,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      // Act
      const response = await searchPosts(app, { semester: 3 })

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.posts).toHaveLength(1)
      expect(response.body.posts[0].semester).toBe(3)
    })

    it('should filter posts by year', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      await createProject(app, token, {
        title: 'Projeto 2024',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      await createProject(app, token, {
        title: 'Projeto 2023',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2023,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      // Act
      const response = await searchPosts(app, { publishedYear: 2024 })

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.posts).toHaveLength(1)
      expect(response.body.posts[0].publishedYear).toBe(2024)
    })

    it('should filter posts by title', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      await createProject(app, token, {
        title: 'Website E-commerce',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      await createProject(app, token, {
        title: 'App Mobile',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      // Act
      const response = await searchPosts(app, { title: 'Website' })

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.posts.length).toBeGreaterThan(0)
    })
  })

  describe('GET /projects/:projectId - Get Project', () => {
    it('should get project details', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      const createResponse = await createProject(app, token, {
        title: 'Projeto Detalhado',
        description: 'Descrição completa',
        content: '# Markdown\n\nConteúdo completo',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      // Act
      const response = await getProject(app, createResponse.body.project_id)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        title: 'Projeto Detalhado',
        description: 'Descrição completa',
      })
      expect(response.body).toHaveProperty('content')
      expect(response.body).toHaveProperty('author')
      expect(response.body).toHaveProperty('subject')
    })

    it('should return 404 for non-existent project', async () => {
      // Act
      const response = await getProject(
        app,
        '00000000-0000-0000-0000-000000000000',
      )

      // Assert
      expect(response.status).toBe(404)
    })
  })

  describe('DELETE /projects/:projectId - Delete Project', () => {
    it('should delete own project', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      const createResponse = await createProject(app, token, {
        title: 'Projeto para Deletar',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      // Act
      const response = await deleteProject(
        app,
        token,
        createResponse.body.project_id,
      )

      // Assert
      expect(response.status).toBe(204)

      // Verify deletion
      const getResponse = await getProject(app, createResponse.body.project_id)
      expect(getResponse.status).toBe(404)
    })

    it('should not delete project of another student', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const student1 = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )
      const student2 = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
        { username: 'student2', email: 'student2@alu.ufc.br' },
      )

      const createResponse = await createProject(app, student1.token, {
        title: 'Projeto Estudante 1',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      // Act - Tentar deletar com token de outro estudante
      const response = await deleteProject(
        app,
        student2.token,
        createResponse.body.project_id,
      )

      // Assert
      expect(response.status).toBe(403)
    })

    it('should not delete without authentication', async () => {
      // Act
      const response = await deleteProject(
        app,
        '',
        '00000000-0000-0000-0000-000000000000',
      )

      // Assert
      expect(response.status).toBe(401)
    })
  })
})
