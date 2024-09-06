import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchAllProfessorsUseCase } from '@/interface/factories/professors/make-fetch-all-professors-use-case.ts'
import { ProfessorPresenter } from '../../presenters/professor.ts'

export async function fetchAllProfessors(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchAllProfessorsUseCase = makeFetchAllProfessorsUseCase()

  const result = await fetchAllProfessorsUseCase.execute()

  return reply
    .status(200)
    .send({ professors: result.map(ProfessorPresenter.toHTTP) })
}
