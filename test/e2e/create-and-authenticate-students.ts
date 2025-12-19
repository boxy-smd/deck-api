import type { INestApplication } from '@nestjs/common'
import request from 'supertest'

import { createTestApp } from './setup-e2e'

export async function createAndAuthenticateStudent(app?: INestApplication) {
  const testApp = app ?? (await createTestApp())

  const registerResponse = await request(testApp.getHttpServer())
    .post('/students')
    .send({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 1,
      trailsIds: [],
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
    cookies: authenticationResponse.get('Set-Cookie'),
  }
}
