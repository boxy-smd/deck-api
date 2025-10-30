import { PrismaTrailMapper } from '@/@infra/database/prisma/mappers/prisma-trail-mapper'
import { PrismaService } from '@/@infra/database/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { makeTrail } from 'test/factories/make-trail'
import { createTestApp } from './setup-app'

export async function createAndAuthenticateStudent(app?: INestApplication) {
  const testApp = app ?? (await createTestApp())
  const prisma = testApp.get(PrismaService)

  const trail = makeTrail()
  const trailData = PrismaTrailMapper.toPrisma(trail)

  await prisma.trail.create({ data: trailData })

  const registerResponse = await request(testApp.getHttpServer())
    .post('/students')
    .send({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 1,
      trailsIds: [trail.id.toString()],
    })

  const authenticationResponse = await request(testApp.getHttpServer())
    .post('/sessions')
    .send({
      email: 'johndoe@alu.ufc.br',
      password: '123456',
    })

  return {
    app: testApp,
    studentId: registerResponse.body.user_id,
    token: authenticationResponse.body.token,
    trail,
    cookies: authenticationResponse.get('Set-Cookie'),
  }
}
