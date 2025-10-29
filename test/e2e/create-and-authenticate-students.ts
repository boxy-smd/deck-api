import request from 'supertest'

import { app } from '@/app'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository'
import { makeTrail } from 'test/factories/make-trail'

export async function createAndAuthenticateStudent() {
  const trailsRepository = new PrismaTrailsRepository()

  const trail = makeTrail()

  await trailsRepository.create(trail)

  const registerResponse = await request(app.server)
    .post('/students')
    .send({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 1,
      trailsIds: [trail.id.toString()],
    })

  const authenticationResponse = await request(app.server)
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
