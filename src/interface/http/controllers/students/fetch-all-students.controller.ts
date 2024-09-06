import { makeFetchAllStudentsUseCase } from '@/interface/factories/students/make-fetch-all-students-use-case.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { StudentPresenter } from '../../presenters/student.ts'

export async function fetchAllStudents(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchAllStudentsUseCase = makeFetchAllStudentsUseCase()

  const result = await fetchAllStudentsUseCase.execute()

  return reply.status(200).send(result.map(StudentPresenter.toHTTP))
}
