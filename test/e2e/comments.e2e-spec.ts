import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { clearDatabase } from './database-utils'
import { getDrizzleInstance } from './helpers/drizzle.helper'
import { createTestApp } from './setup-e2e'

/**
 * Comments E2E Tests - Simplified
 *
 * Only tests critical happy paths.
 * Validation and authorization are covered by unit/integration tests.
 */
describe('Comments E2E', () => {
  let app: INestApplication
  let db: ReturnType<typeof getDrizzleInstance>
  let authToken: string
  let projectId: string

  beforeAll(async () => {
    app = await createTestApp()
    db = getDrizzleInstance(app)
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await clearDatabase(db)

    // Register and authenticate student
    await request(app.getHttpServer()).post('/students').send({
      name: 'Comentarista',
      username: 'comentarista',
      email: 'comentarista@alu.ufc.br',
      password: 'senha123',
      semester: 3,
      trailsIds: [],
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'comentarista@alu.ufc.br',
        password: 'senha123',
      })

    authToken = loginResponse.body.token

    // Create project with comments enabled
    const projectResponse = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Projeto para Comentar',
        description: 'Aceita comentários',
        semester: 3,
        publishedYear: 2024,
        allowComments: true,
      })

    projectId = projectResponse.body.project_id
  })

  it('should create a comment on published project (happy path)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/projects/${projectId}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'Excelente projeto! Parabéns!',
      })
      .expect(201)

    expect(response.body).toHaveProperty('comment_id')
    expect(response.body.comment_id).toBeDefined()
  })

  it('should list project comments (happy path)', async () => {
    // Create 3 comments
    await request(app.getHttpServer())
      .post(`/projects/${projectId}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: 'Comentário 1' })

    await request(app.getHttpServer())
      .post(`/projects/${projectId}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: 'Comentário 2' })

    await request(app.getHttpServer())
      .post(`/projects/${projectId}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: 'Comentário 3' })

    // List comments
    const response = await request(app.getHttpServer())
      .get(`/projects/${projectId}/comments`)
      .expect(200)

    expect(response.body.comments).toHaveLength(3)
    expect(response.body.comments[0]).toHaveProperty('content')
    expect(response.body.comments[0]).toHaveProperty('authorId')
    expect(response.body.comments[0]).toHaveProperty('createdAt')
  })

  it('should delete own comment (happy path)', async () => {
    // Create comment
    const commentRes = await request(app.getHttpServer())
      .post(`/projects/${projectId}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: 'Comentário para deletar' })

    const commentId = commentRes.body.comment_id

    // Delete comment
    await request(app.getHttpServer())
      .delete(`/projects/${projectId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204)

    // Verify deletion
    const listRes = await request(app.getHttpServer())
      .get(`/projects/${projectId}/comments`)
      .expect(200)

    expect(listRes.body.comments).toHaveLength(0)
  })
})
