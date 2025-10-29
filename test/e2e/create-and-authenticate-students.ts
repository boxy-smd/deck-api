import request from 'supertest'

import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository'
import { makeTrail } from 'test/factories/make-trail'
import { createTestApp } from './setup-app'

export async function createAndAuthenticateStudent() {
  const app = await createTestApp()
  const trailsRepository = new PrismaTrailsRepository()

  const trail = makeTrail()

  await trailsRepository.create(trail)

  const registerResponse = await request(app.getHttpServer())
    .post('/students')
    .send({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 1,
      trailsIds: [trail.id.toString()],
    })

  const authenticationResponse = await request(app.getHttpServer())
    .post('/sessions')
    .send({
      email: 'johndoe@alu.ufc.br',
      password: '123456',
    })

  return {
    studentId: registerResponse.body.user_id,
    token: authenticationResponse.body.token,
    trail,
    cookies: authenticationResponse.get('Set-Cookie'),
  }
}
