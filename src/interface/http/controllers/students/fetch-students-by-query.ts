import { makeFetchStudentsByQueryUseCase } from '@/interface/factories/students/make-fetch-students-by-query-use-case.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { StudentPresenter } from '../../presenters/student.ts'
import type { FetchStudentsByQuerySchema } from '../../schemas/students/fetch-students-by-query.schemas.ts'

export async function fetchStudentsByQuery(
  request: FastifyRequest<{
    Querystring: FetchStudentsByQuerySchema
  }>,
  reply: FastifyReply,
) {
  const { name, username } = request.query

  const fetchStudentsByQueryUseCase = makeFetchStudentsByQueryUseCase()

  const result = await fetchStudentsByQueryUseCase.execute({
    name,
    username,
  })

  return reply.status(200).send(result.map(StudentPresenter.toHTTP))
}
