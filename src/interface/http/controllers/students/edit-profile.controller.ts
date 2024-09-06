import { makeEditProfileUseCase } from '@/interface/factories/students/make-edit-profile-use-case.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { StudentProfilePresenter } from '../../presenters/student-profile.ts'
import type {
  EditProfileBody,
  EditProfileParams,
} from '../../schemas/students/edit-profile.schemas.ts'

export async function editProfile(
  request: FastifyRequest<{
    Body: EditProfileBody
    Params: EditProfileParams
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params
  const { name, about, profileUrl, semester, trailsIds } = request.body

  const editProfileUseCase = makeEditProfileUseCase()

  const result = await editProfileUseCase.execute({
    studentId: id,
    name,
    about,
    profileUrl,
    semester,
    trailsIds,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(200).send({
    profile: StudentProfilePresenter.toHTTP(result.value),
  })
}
