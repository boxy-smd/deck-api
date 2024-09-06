import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchAllSubjectsUseCase } from '@/interface/factories/subjects/make-fetch-all-subjects-use-case.ts'
import { SubjectPresenter } from '../../presenters/subject.ts'

export async function fetchAllSubjects(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchAllSubjectsUseCase = makeFetchAllSubjectsUseCase()

  const result = await fetchAllSubjectsUseCase.execute()

  return reply
    .status(200)
    .send({ subjects: result.map(SubjectPresenter.toHTTP) })
}
