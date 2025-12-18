import { type INestApplication } from '@nestjs/common'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createTestApp } from './setup-e2e'
import { clearDatabase } from './database-utils'
import { getDrizzleInstance } from './helpers/drizzle.helper'
import { eq } from 'drizzle-orm'

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

    // Cria e autentica um estudante
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

    // Cria um projeto com comentários habilitados
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

  describe('POST /projects/:projectId/comments', () => {
    it('deve criar um comentário em projeto publicado', async () => {
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

    it('deve impedir comentário sem autenticação', async () => {
      await request(app.getHttpServer())
        .post(`/projects/${projectId}/comments`)
        .send({
          content: 'Tentando comentar sem login',
        })
        .expect(401)
    })

    it('deve validar conteúdo vazio', async () => {
      const response = await request(app.getHttpServer())
        .post(`/projects/${projectId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: '',
        })
        .expect(400)

      expect(response.body.message).toBeDefined()
    })

    it('deve impedir comentário em projeto com comentários desabilitados', async () => {
      // Cria projeto sem allowComments
      const restrictedProjectRes = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Projeto Restrito',
          description: 'Sem comentários',
          semester: 3,
          publishedYear: 2024,
          allowComments: false,
        })

      await request(app.getHttpServer())
        .post(`/projects/${restrictedProjectRes.body.project_id}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Tentando comentar',
        })
        .expect(403)
    })

    it('deve impedir comentário em projeto em rascunho', async () => {
      // Cria projeto em DRAFT usando o endpoint correto
      const draftProjectRes = await request(app.getHttpServer())
        .post('/projects/drafts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Projeto Draft',
          description: 'Ainda não publicado',
          semester: 3,
          publishedYear: 2024,
        })

      await request(app.getHttpServer())
        .post(`/projects/${draftProjectRes.body.project_id}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Comentário em draft',
        })
        .expect(403)
    })
  })

  describe('GET /projects/:projectId/comments', () => {
    it('deve listar comentários de um projeto', async () => {
      // Cria 3 comentários
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

      // Lista comentários
      const response = await request(app.getHttpServer())
        .get(`/projects/${projectId}/comments`)
        .expect(200)

      expect(response.body.comments).toHaveLength(3)
      expect(response.body.comments[0]).toHaveProperty('content')
      expect(response.body.comments[0]).toHaveProperty('authorId')
      expect(response.body.comments[0]).toHaveProperty('createdAt')
    })

    it('deve retornar lista vazia para projeto sem comentários', async () => {
      const response = await request(app.getHttpServer())
        .get(`/projects/${projectId}/comments`)
        .expect(200)

      expect(response.body.comments).toHaveLength(0)
    })
  })

  // PUT não implementado na API - skipando testes
  describe.skip('PUT /comments/:id', () => {
    it('deve editar próprio comentário', async () => {
      // Endpoint não implementado
    })

    it('deve impedir edição de comentário de outro usuário', async () => {
      // Endpoint não implementado
    })
  })

  describe('DELETE /projects/:projectId/comments/:commentId', () => {
    it('deve deletar próprio comentário', async () => {
      // Cria comentário
      const commentRes = await request(app.getHttpServer())
        .post(`/projects/${projectId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Comentário para deletar' })

      const commentId = commentRes.body.comment_id

      // Deleta comentário (rota correta)
      await request(app.getHttpServer())
        .delete(`/projects/${projectId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204)

      // Verifica que foi deletado
      const listRes = await request(app.getHttpServer())
        .get(`/projects/${projectId}/comments`)
        .expect(200)

      expect(listRes.body.comments).toHaveLength(0)
    })

    it('deve permitir moderador deletar qualquer comentário', async () => {
      // Cria comentário com usuário atual
      const commentRes = await request(app.getHttpServer())
        .post(`/projects/${projectId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Comentário para moderador deletar' })

      const commentId = commentRes.body.comment_id

      // Cria usuário moderador diretamente no banco
      const moderatorEmail = 'moderador@alu.ufc.br'
      const moderatorPassword = 'senha999'
      
      await request(app.getHttpServer()).post('/students').send({
        name: 'Moderador',
        username: 'moderador',
        email: moderatorEmail,
        password: moderatorPassword,
        semester: 8,
        trailsIds: [],
      })

      // Atualiza role do moderador no banco
      const { users } = await import('@/@infra/database/drizzle/schema')
      await db.update(users)
        .set({ role: 'MODERATOR' })
        .where(eq(users.email, moderatorEmail))

      // Login como moderador
      const modLoginRes = await request(app.getHttpServer())
        .post('/sessions')
        .send({
          email: moderatorEmail,
          password: moderatorPassword,
        })

      // Moderador deleta comentário de outro usuário
      await request(app.getHttpServer())
        .delete(`/projects/${projectId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${modLoginRes.body.token}`)
        .expect(204)
    })
  })

  describe('POST /comments/:commentId/report', () => {
    it('deve reportar um comentário inadequado', async () => {
      // Cria comentário
      const commentRes = await request(app.getHttpServer())
        .post(`/projects/${projectId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Comentário ofensivo' })

      // Cria outro usuário para reportar
      await request(app.getHttpServer()).post('/students').send({
        name: 'Reporter',
        username: 'reporter',
        email: 'reporter@alu.ufc.br',
        password: 'senha789',
        semester: 2,
        trailsIds: [],
      })

      const loginRes = await request(app.getHttpServer())
        .post('/sessions')
        .send({
          email: 'reporter@alu.ufc.br',
          password: 'senha789',
        })

      // Reporta comentário (rota correta: /comments/:id/report - SINGULAR!)
      const response = await request(app.getHttpServer())
        .post(`/comments/${commentRes.body.comment_id}/report`)
        .set('Authorization', `Bearer ${loginRes.body.token}`)
        .send({
          content: 'Este comentário contém linguagem ofensiva',
          projectId: projectId,
        })
        .expect(201)

      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toBeDefined()
    })
  })
})
