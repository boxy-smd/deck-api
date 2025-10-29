import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetProfileUseCase } from '@/interface/factories/students/make-get-profile-use-case'
import { StudentProfilePresenter } from '../../presenters/student-profile'
import type { GetProfileParams } from '../../schemas/students/get-profile.schemas'

export async function getProfile(
  request: FastifyRequest<{
    Params: GetProfileParams
  }>,
  reply: FastifyReply,
) {
  const { username } = request.params

  const getProfileUseCase = makeGetProfileUseCase()

  const result = await getProfileUseCase.execute({
    username,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(200).send({
    profile: StudentProfilePresenter.toHTTP(result.value),
  })
}
