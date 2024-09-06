import { makeGetProfileUseCase } from '@/interface/factories/students/make-get-profile-use-case.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { StudentProfilePresenter } from '../../presenters/student-profile.ts'
import type { GetProfileParamsSchema } from '../../schemas/students/get-profile.schemas.ts'

export async function getProfile(
  request: FastifyRequest<{
    Params: GetProfileParamsSchema
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params

  const getProfileUseCase = makeGetProfileUseCase()

  const result = await getProfileUseCase.execute({
    studentId: id,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(200).send(StudentProfilePresenter.toHTTP(result.value))
}
