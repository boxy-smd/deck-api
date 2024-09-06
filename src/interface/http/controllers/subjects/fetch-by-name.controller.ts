import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchSubjectByNameUseCase } from '@/interface/factories/subjects/make-fetch-subjects-by-name-use-case.ts'
import { SubjectPresenter } from '../../presenters/subject.ts'
import type { FetchSubjectsByNameQuerySchema } from '../../schemas/subjects/fetch-by-name.schemas.ts'

export async function fetchSubjectsByName(
  request: FastifyRequest<{
    Querystring: FetchSubjectsByNameQuerySchema
  }>,
  reply: FastifyReply,
) {
  const { name } = request.query

  const fetchSubjectByNameUseCase = makeFetchSubjectByNameUseCase()

  const result = await fetchSubjectByNameUseCase.execute({ name })

  return reply.status(200).send({
    subjects: result.map(SubjectPresenter.toHTTP),
  })
}
