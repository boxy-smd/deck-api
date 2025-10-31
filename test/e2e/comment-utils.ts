import type { INestApplication } from '@nestjs/common'
import request from 'supertest'

/**
 * Cria um comentário em um projeto
 */
export async function createComment(
  app: INestApplication,
  token: string,
  projectId: string,
  data: { content: string },
) {
  return await request(app.getHttpServer())
    .post(`/projects/${projectId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send(data)
}

/**
 * Lista comentários de um projeto
 */
export async function listComments(app: INestApplication, projectId: string) {
  return await request(app.getHttpServer()).get(
    `/projects/${projectId}/comments`,
  )
}

/**
 * Deleta um comentário
 */
export async function deleteComment(
  app: INestApplication,
  token: string,
  projectId: string,
  commentId: string,
) {
  return await request(app.getHttpServer())
    .delete(`/projects/${projectId}/comments/${commentId}`)
    .set('Authorization', `Bearer ${token}`)
}

/**
 * Reporta um comentário
 */
export async function reportComment(
  app: INestApplication,
  token: string,
  commentId: string,
  data: {
    projectId: string
    content: string
  },
) {
  return await request(app.getHttpServer())
    .post(`/comments/${commentId}/report`)
    .set('Authorization', `Bearer ${token}`)
    .send(data)
}
