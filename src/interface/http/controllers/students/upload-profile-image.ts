import { makeUploadProfileImageUseCase } from '@/interface/factories/students/make-upload-profile-image-use-case.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { UpdateProfileImageParams } from '../../schemas/students/upload-profile-image.schemas.ts'

export async function uploadProfileImage(
  request: FastifyRequest<{
    Params: UpdateProfileImageParams
  }>,
  reply: FastifyReply,
) {
  const { username } = request.params
  const profileImage = await request.file()

  if (!profileImage) {
    return reply.code(400).send({ error: 'No image provided.' })
  }

  const uploadStudentProfileUseCase = makeUploadProfileImageUseCase()

  const { mimetype } = profileImage

  const image = await profileImage.toBuffer()

  await uploadStudentProfileUseCase.execute({
    filename: `${username}.${mimetype.split('/')[1]}`,
    image,
    username,
  })

  return reply.code(201).send({
    message: 'Profile image uploaded successfully.',
  })
}
