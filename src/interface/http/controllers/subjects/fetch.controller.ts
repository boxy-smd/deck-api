import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchSubjectsUseCase } from '@/interface/factories/subjects/make-fetch-subjects-use-case'
import { SubjectPresenter } from '../../presenters/subject'
import type { FetchSubjects } from '../../schemas/subjects/fetch.schemas'

export async function fetchSubjects(
  request: FastifyRequest<{
    Querystring: FetchSubjects
  }>,
  reply: FastifyReply,
) {
  const { name } = request.query

  const fetchSubjectsUseCase = makeFetchSubjectsUseCase()

  const result = await fetchSubjectsUseCase.execute({ name })

  return reply
    .status(200)
    .send({ subjects: result.map(SubjectPresenter.toHTTP) })
}
