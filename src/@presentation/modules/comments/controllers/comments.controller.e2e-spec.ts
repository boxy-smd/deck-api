import type { INestApplication } from '@nestjs/common'
import {
  createComment,
  deleteComment,
  listComments,
  reportComment,
} from 'test/e2e/comment-utils'
import { clearDatabase } from 'test/e2e/database-utils'
import { createProject } from 'test/e2e/project-utils'
import { createProjectTestData } from 'test/e2e/seed-utils'
import { closeTestApp, createTestApp } from 'test/e2e/setup-app'
import { createAuthenticatedStudent } from 'test/e2e/student-utils'

describe('[E2E] CommentsController', () => {
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

  describe('GET /projects/:projectId/comments - List Comments', () => {
    it('should list project comments', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      const projectResponse = await createProject(app, token, {
        title: 'Projeto com Comentários',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
        allowComments: true,
      })

      await createComment(
        app,
        token,
        projectResponse.body.project_id,
        'Excelente projeto!',
      )
      await createComment(
        app,
        token,
        projectResponse.body.project_id,
        'Muito bom!',
      )

      // Act
      const response = await listComments(app, projectResponse.body.project_id)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.comments).toBeInstanceOf(Array)
      expect(response.body.comments.length).toBe(2)
    })

    it('should return empty array for project without comments', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      const projectResponse = await createProject(app, token, {
        title: 'Projeto sem Comentários',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
      })

      // Act
      const response = await listComments(app, projectResponse.body.project_id)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.comments).toBeInstanceOf(Array)
      expect(response.body.comments.length).toBe(0)
    })

    it('should return 404 for non-existent project', async () => {
      // Act
      const response = await listComments(
        app,
        '00000000-0000-0000-0000-000000000000',
      )

      // Assert
      expect(response.status).toBe(404)
    })
  })

  describe('POST /projects/:projectId/comments - Create Comment', () => {
    it('should create comment on project', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      const projectResponse = await createProject(app, token, {
        title: 'Projeto Comentável',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
        allowComments: true,
      })

      // Act
      const response = await createComment(
        app,
        token,
        projectResponse.body.project_id,
        'Ótimo trabalho! Parabéns pelo projeto.',
      )

      // Assert
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('comment_id')
      expect(typeof response.body.comment_id).toBe('string')
    })

    it('should not create comment without authentication', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      const projectResponse = await createProject(app, token, {
        title: 'Projeto',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
        allowComments: true,
      })

      // Act
      const response = await createComment(
        app,
        '',
        projectResponse.body.project_id,
        'Comentário sem autenticação',
      )

      // Assert
      expect(response.status).toBe(401)
    })

    it('should not create comment on project with comments disabled', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      const projectResponse = await createProject(app, token, {
        title: 'Projeto sem Comentários',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
        allowComments: false,
      })

      // Act
      const response = await createComment(
        app,
        token,
        projectResponse.body.project_id,
        'Tentando comentar',
      )

      // Assert
      expect(response.status).toBe(403)
    })

    it('should not create empty comment', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      const projectResponse = await createProject(app, token, {
        title: 'Projeto',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
        allowComments: true,
      })

      // Act
      const response = await createComment(
        app,
        token,
        projectResponse.body.project_id,
        '',
      )

      // Assert
      expect(response.status).toBe(400)
    })
  })

  describe('DELETE /projects/:projectId/comments/:commentId - Delete Comment', () => {
    it('should delete own comment', async () => {
      // Arrange
      const { trail, subject, professor } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      const projectResponse = await createProject(app, token, {
        title: 'Projeto',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
        allowComments: true,
      })

      const commentResponse = await createComment(
        app,
        token,
        projectResponse.body.project_id,
        'Comentário para deletar',
      )

      // Act
      const response = await deleteComment(
        app,
        token,
        projectResponse.body.project_id,
        commentResponse.body.comment_id,
      )

      // Assert
      expect(response.status).toBe(204)

      // Verify deletion
      const listResponse = await listComments(
        app,
        projectResponse.body.project_id,
      )
      expect(listResponse.body.comments).toHaveLength(0)
    })

    it('should not delete comment of another user', async () => {
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

      const projectResponse = await createProject(app, student1.token, {
        title: 'Projeto',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
        allowComments: true,
      })

      const commentResponse = await createComment(
        app,
        student1.token,
        projectResponse.body.project_id,
        'Comentário do estudante 1',
      )

      // Act - Tentar deletar com token de outro estudante
      const response = await deleteComment(
        app,
        student2.token,
        projectResponse.body.project_id,
        commentResponse.body.comment_id,
      )

      // Assert
      expect(response.status).toBe(403)
    })

    it('should not delete without authentication', async () => {
      // Act
      const response = await deleteComment(app, '', 'project-id', 'comment-id')

      // Assert
      expect(response.status).toBe(401)
    })
  })

  describe('POST /comments/:commentId/report - Report Comment', () => {
    it('should report inappropriate comment', async () => {
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

      const projectResponse = await createProject(app, student1.token, {
        title: 'Projeto',
        description: 'Desc',
        content: 'Content',
        publishedYear: 2024,
        semester: 3,
        subjectId: subject.id.toString(),
        trailsIds: [trail.id.toString()],
        professorsIds: [professor.id.toString()],
        allowComments: true,
      })

      const commentResponse = await createComment(
        app,
        student1.token,
        projectResponse.body.project_id,
        'Comentário inapropriado',
      )

      // Act
      const response = await reportComment(
        app,
        student2.token,
        commentResponse.body.comment_id,
        {
          projectId: projectResponse.body.project_id,
          content: 'Este comentário contém linguagem ofensiva',
        },
      )

      // Assert
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('message')
    })

    it('should not report without authentication', async () => {
      // Act
      const response = await reportComment(app, '', 'comment-id', {
        projectId: 'project-id',
        content: 'Denúncia',
      })

      // Assert
      expect(response.status).toBe(401)
    })

    it('should not report non-existent comment', async () => {
      // Arrange
      const { trail } = await createProjectTestData(app)
      const { token } = await createAuthenticatedStudent(
        app,
        trail.id.toString(),
      )

      // Act
      const response = await reportComment(
        app,
        token,
        '00000000-0000-0000-0000-000000000000',
        {
          projectId: '00000000-0000-0000-0000-000000000000',
          content: 'Denúncia',
        },
      )

      // Assert
      expect(response.status).toBe(404)
    })
  })
})
