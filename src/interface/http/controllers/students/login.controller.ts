import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeLoginUseCase } from '@/interface/factories/students/make-login-use-case.ts'
import type { LoginBody } from '@/interface/http/schemas/students/login.schemas.ts'

export async function login(
  request: FastifyRequest<{
    Body: LoginBody
  }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body

  const loginUseCase = makeLoginUseCase()

  const result = await loginUseCase.execute({
    email,
    password,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  const token = await reply.jwtSign({
    sign: {
      sub: result.value.email,
    },
  })

  const refreshToken = await reply.jwtSign({
    sign: {
      sub: result.value.email,
      expiresIn: '7d',
    },
  })

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    })
}
