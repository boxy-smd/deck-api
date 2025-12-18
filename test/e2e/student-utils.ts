import type { INestApplication } from '@nestjs/common'
import request from 'supertest'

/**
 * Cria um estudante via API
 */
export async function createStudent(
  app: INestApplication,
  data: {
    name: string
    username: string
    email: string
    password: string
    semester: number
    trailsIds: string[]
    about?: string
    profileUrl?: string
  },
): Promise<request.Response> {
  return await request(app.getHttpServer()).post('/students').send(data)
}

/**
 * Realiza login de um estudante
 */
export async function loginStudent(
  app: INestApplication,
  credentials: {
    email: string
    password: string
  },
): Promise<request.Response> {
  return await request(app.getHttpServer()).post('/sessions').send(credentials)
}

/**
 * Busca perfil de um estudante por username
 */
export async function getProfile(
  app: INestApplication,
  username: string,
): Promise<request.Response> {
  return await request(app.getHttpServer()).get(`/profiles/${username}`)
}

/**
 * Cria e autentica um estudante de forma simplificada
 */
export async function createAuthenticatedStudent(
  app: INestApplication,
  trailId: string,
  overrides?: {
    name?: string
    username?: string
    email?: string
    password?: string
    semester?: number
  },
) {
  const userData = {
    name: overrides?.name ?? 'John Doe',
    username: overrides?.username ?? `user_${Date.now()}`,
    email: overrides?.email ?? `user_${Date.now()}@alu.ufc.br`,
    password: overrides?.password ?? '123456',
    semester: overrides?.semester ?? 1,
    trailsIds: [trailId],
  }

  const registerResponse = await createStudent(app, userData)

  const authResponse = await loginStudent(app, {
    email: userData.email,
    password: userData.password,
  })

  return {
    userId: registerResponse.body.user_id,
    token: authResponse.body.token,
    username: userData.username,
    email: userData.email,
  }
}
