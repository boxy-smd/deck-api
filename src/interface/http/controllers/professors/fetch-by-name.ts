import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchProfessorByNameUseCase } from '@/interface/factories/professors/make-fetch-professors-by-name-use-case.ts'
import type { FetchProfessorsByNameQuerySchema } from '../../schemas/professors/fetch-by-name.schemas.ts'

export async function fetchProfessorsByName(
  request: FastifyRequest<{
    Querystring: FetchProfessorsByNameQuerySchema
  }>,
  reply: FastifyReply,
) {
  const { name } = request.query

  const fetchProfessorByNameUseCase = makeFetchProfessorByNameUseCase()

  const result = await fetchProfessorByNameUseCase.execute({ name })

  return reply.status(200).send({
    professors: result.map(professor => ({
      id: professor.id,
      name: professor.name,
    })),
  })
}
