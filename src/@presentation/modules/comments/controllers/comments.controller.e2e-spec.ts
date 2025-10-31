import { HttpStatus, type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createComment } from 'test/e2e/comment-utils'
import { clearDatabase } from 'test/e2e/database-utils'
import { createProject } from 'test/e2e/project-utils'
import { createProjectTestData } from 'test/e2e/seed-utils'
import { createTestApp } from 'test/e2e/setup-e2e'
import { createAuthenticatedStudent } from 'test/e2e/student-utils'

describe('Comments E2E Tests (Success Cases)', () => {
  let app: INestApplication
  let token: string
  let projectId: string
  let trailId: string
  let subjectId: string
  let professorId: string

  beforeAll(async () => {
    app = await createTestApp()
    const testData = await createProjectTestData(app)

    trailId = testData.trail.id.toString()
    subjectId = testData.subject.id.toString()
    professorId = testData.professor.id.toString()

    const auth = await createAuthenticatedStudent(app, trailId)
    token = auth.token

    const projectResponse = await createProject(app, token, {
      title: 'Projeto para Comentários',
      description: 'Descrição',
      content: 'Conteúdo',
      publishedYear: 2024,
      semester: 1,
      subjectId,
      trailsIds: [trailId],
      professorsIds: [professorId],
      allowComments: true,
    })

    projectId = projectResponse.body.project_id
  })

  afterAll(async () => {
    await clearDatabase(app)
    await app.close()
  })

  describe('GET /projects/:projectId/comments', () => {
    it('should list all comments of a project', async () => {
      await createComment(app, token, projectId, {
        content: 'Primeiro comentário',
      })

      await createComment(app, token, projectId, {
        content: 'Segundo comentário',
      })

      const response = await request(app.getHttpServer()).get(
        `/projects/${projectId}/comments`,
      )

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('comments')
      expect(Array.isArray(response.body.comments)).toBe(true)
      expect(response.body.comments.length).toBeGreaterThanOrEqual(2)
    })

    it('should return empty array when project has no comments', async () => {
      const newProjectResponse = await createProject(app, token, {
        title: 'Projeto Sem Comentários',
        description: 'Descrição',
        content: 'Conteúdo',
        publishedYear: 2024,
        semester: 1,
        subjectId,
        trailsIds: [trailId],
        professorsIds: [professorId],
        allowComments: true,
      })

      const response = await request(app.getHttpServer()).get(
        `/projects/${newProjectResponse.body.project_id}/comments`,
      )

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toHaveProperty('comments')
      expect(Array.isArray(response.body.comments)).toBe(true)
      expect(response.body.comments.length).toBe(0)
    })
  })

  describe('POST /projects/:projectId/comments', () => {
    it('should create a comment on a project', async () => {
      const response = await createComment(app, token, projectId, {
        content: 'Ótimo projeto! Parabéns pelo trabalho.',
      })

      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toHaveProperty('comment_id')
      expect(response.body.comment_id).toBeTruthy()
    })

    it('should create multiple comments by the same user', async () => {
      const response1 = await createComment(app, token, projectId, {
        content: 'Primeiro comentário do usuário',
      })

      const response2 = await createComment(app, token, projectId, {
        content: 'Segundo comentário do mesmo usuário',
      })

      expect(response1.status).toBe(HttpStatus.CREATED)
      expect(response2.status).toBe(HttpStatus.CREATED)
      expect(response1.body.comment_id).toBeTruthy()
      expect(response2.body.comment_id).toBeTruthy()
    })

    it('should create comment with long content', async () => {
      const longContent = 'A'.repeat(500)

      const response = await createComment(app, token, projectId, {
        content: longContent,
      })

      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toHaveProperty('comment_id')
    })
  })

  describe('DELETE /projects/:projectId/comments/:commentId', () => {
    it('should delete a comment when user is the author', async () => {
      const createResponse = await createComment(app, token, projectId, {
        content: 'Comentário para deletar',
      })

      const commentId = createResponse.body.comment_id

      const response = await request(app.getHttpServer())
        .delete(`/projects/${projectId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(HttpStatus.NO_CONTENT)
    })
  })

  describe('POST /comments/:commentId/report', () => {
    it('should report a comment successfully', async () => {
      const auth2 = await createAuthenticatedStudent(app, trailId, {
        username: 'reporter',
        email: 'reporter@alu.ufc.br',
      })

      const commentResponse = await createComment(app, token, projectId, {
        content: 'Comentário a ser reportado',
      })

      const commentId = commentResponse.body.comment_id

      const response = await request(app.getHttpServer())
        .post(`/comments/${commentId}/report`)
        .set('Authorization', `Bearer ${auth2.token}`)
        .send({
          projectId,
          content: 'Conteúdo inapropriado',
        })

      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toHaveProperty('message')
    })

    it('should report a comment with detailed reason', async () => {
      const auth2 = await createAuthenticatedStudent(app, trailId, {
        username: 'reporter2',
        email: 'reporter2@alu.ufc.br',
      })

      const commentResponse = await createComment(app, token, projectId, {
        content: 'Outro comentário a ser reportado',
      })

      const commentId = commentResponse.body.comment_id

      const response = await request(app.getHttpServer())
        .post(`/comments/${commentId}/report`)
        .set('Authorization', `Bearer ${auth2.token}`)
        .send({
          projectId,
          content: 'Este comentário contém spam e linguagem ofensiva',
        })

      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toHaveProperty('message')
    })
  })
})
