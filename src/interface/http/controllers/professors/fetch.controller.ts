import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchProfessorsUseCase } from '@/interface/factories/professors/make-fetch-professors-use-case.ts'
import { ProfessorPresenter } from '../../presenters/professor.ts'
import type { FetchProfessors } from '../../schemas/professors/fetch.schemas.ts'

export async function fetchProfessors(
  request: FastifyRequest<{
    Querystring: FetchProfessors
  }>,
  reply: FastifyReply,
) {
  const { name } = request.query

  const fetchProfessorsUseCase = makeFetchProfessorsUseCase()

  const result = await fetchProfessorsUseCase.execute({
    name,
  })

  return reply
    .status(200)
    .send({ professors: result.map(ProfessorPresenter.toHTTP) })
}
