import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeEditProfileUseCase } from '@/interface/factories/students/make-edit-profile-use-case.ts'
import { StudentProfilePresenter } from '../../presenters/student-profile.ts'
import type {
  EditProfileBody,
  EditProfileParams,
} from '../../schemas/students/edit-profile.schemas.ts'

export async function editProfile(
  request: FastifyRequest<{
    Params: EditProfileParams
    Body: EditProfileBody
  }>,
  reply: FastifyReply,
) {
  const { studentId } = request.params

  if (studentId !== request.user.sign.sub) {
    return reply.status(403).send({ message: 'Forbidden.' })
  }

  const { about, profileUrl, semester, trailsIds } = request.body

  const editProfileUseCase = makeEditProfileUseCase()

  const result = await editProfileUseCase.execute({
    studentId,
    profileUrl,
    semester,
    trailsIds,
    about,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(200).send({
    profile: StudentProfilePresenter.toHTTP(result.value),
  })
}
