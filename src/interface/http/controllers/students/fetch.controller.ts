import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchStudentsUseCase } from '@/interface/factories/students/make-fetch-students-use-case.ts'
import { StudentPresenter } from '../../presenters/student.ts'
import type { FetchStudentsQuery } from '../../schemas/students/fetch.schemas.ts'

export async function fetchStudents(
  request: FastifyRequest<{
    Querystring: FetchStudentsQuery
  }>,
  reply: FastifyReply,
) {
  const { name } = request.query

  const fetchStudentsUseCase = makeFetchStudentsUseCase()

  const result = await fetchStudentsUseCase.execute({
    name,
  })

  return reply.status(200).send(result.map(StudentPresenter.toHTTP))
}
