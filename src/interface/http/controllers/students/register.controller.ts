import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeRegisterUseCase } from '@/interface/factories/students/make-register-use-case.ts'
import type { RegisterBodySchema } from '@/interface/http/schemas/students/register.schemas.ts'

export async function register(
  request: FastifyRequest<{
    Body: RegisterBodySchema
  }>,
  reply: FastifyReply,
) {
  const {
    name,
    username,
    email,
    password,
    semester,
    about,
    profileUrl,
    trailsIds,
  } = request.body

  const registerUseCase = makeRegisterUseCase()

  const result = await registerUseCase.execute({
    name,
    username,
    email,
    password,
    semester,
    about,
    profileUrl,
    trailsIds,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(201).send({ user_id: result.value.id.toString() })
}
