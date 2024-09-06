import { makeEditProfileUseCase } from '@/interface/factories/students/make-edit-profile-use-case.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { StudentProfilePresenter } from '../../presenters/student-profile.ts'
import type {
  EditProfileBodySchema,
  EditProfileParamsSchema,
} from '../../schemas/students/edit-profile.schemas.ts'

export async function editProfile(
  request: FastifyRequest<{
    Body: EditProfileBodySchema
    Params: EditProfileParamsSchema
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params

  const editProfileUseCase = makeEditProfileUseCase()

  const result = await editProfileUseCase.execute({
    studentId: id,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(200).send(StudentProfilePresenter.toHTTP(result.value))
}
