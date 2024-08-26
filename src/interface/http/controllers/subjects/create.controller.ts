import { makeCreateSubjectUseCase } from '@/interface/factories/subjects/make-create-subject-use-case.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreateSubjectBodySchema } from '../../schemas/subjects/create.schemas.ts'

export async function createSubject(
  request: FastifyRequest<{
    Body: CreateSubjectBodySchema
  }>,
  reply: FastifyReply,
) {
  const { name } = request.body

  const createSubjectUseCase = makeCreateSubjectUseCase()

  const result = await createSubjectUseCase.execute({
    name,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(201).send(result.value)
}
