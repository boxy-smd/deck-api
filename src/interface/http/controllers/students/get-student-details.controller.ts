import { makeGetStudentDetailsUseCase } from '@/interface/factories/students/make-get-student-details-use-case.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { StudentProfilePresenter } from '../../presenters/student-profile.ts'

export async function getStudentDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const studentId = request.user.sign.sub

  const getStudentDetailsUseCase = makeGetStudentDetailsUseCase()

  const result = await getStudentDetailsUseCase.execute({
    studentId,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  console.log('result', result.value)

  return reply.status(200).send({
    details: StudentProfilePresenter.toHTTP(result.value),
  })
}
